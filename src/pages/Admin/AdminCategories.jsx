import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';
import Modal from '../../components/Modal/Modal.jsx';
import { Spinner } from '../../components/Loader/Loader.jsx';
import API from '../../services/api.js';
import { fallbackCategories } from '../../data/fallbackData.js';
import './Admin.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    name: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=80',
    active: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await API.get('/categories');
      if (res.data?.success && res.data.data) {
        setCategories(res.data.data);
      } else {
        setCategories(fallbackCategories);
      }
    } catch {
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setIsEditing(false);
    setCurrentId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '',
      active: cat.active !== undefined ? cat.active : true,
    });
    setIsEditing(true);
    setCurrentId(cat._id);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlertMsg(null);

    try {
      if (isEditing) {
        const res = await API.put(`/categories/${currentId}`, formData);
        if (res.data?.success) {
          setCategories((prev) =>
            prev.map((c) => (c._id === currentId ? res.data.data : c))
          );
          setIsModalOpen(false);
          setAlertMsg({ type: 'success', text: 'Category updated successfully.' });
        }
      } else {
        const res = await API.post('/categories', formData);
        if (res.data?.success) {
          setCategories((prev) => [...prev, res.data.data]);
          setIsModalOpen(false);
          setAlertMsg({ type: 'success', text: 'Category created successfully.' });
        }
      }
    } catch (err) {
      setAlertMsg({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Operation failed.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/categories/${deleteTarget._id}`);
      setCategories((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setDeleteTarget(null);
      setAlertMsg({ type: 'success', text: 'Category deleted successfully.' });
    } catch (err) {
      setAlertMsg({
        type: 'error',
        text: err.response?.data?.message || 'Could not delete category.',
      });
      setDeleteTarget(null);
    }
  };

  return (
    <div className="admin-categories-view animate-fade-in">
      <div className="admin-actions-bar flex-between mb-4">
        <h3>Categories Management ({categories.length})</h3>
        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          <FaPlus /> Add Category
        </button>
      </div>

      {alertMsg && (
        <div className={`profile-alert ${alertMsg.type} card mb-4`}>
          {alertMsg.text}
        </div>
      )}

      {loading ? (
        <Spinner size="medium" text="Loading categories..." />
      ) : (
        <div className="admin-table-wrapper card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Products Count</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id || cat.slug}>
                  <td>
                    <div className="table-product-cell">
                      <img
                        src={cat.image || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&auto=format&fit=crop&q=80'}
                        alt={cat.name}
                        className="table-product-thumb"
                      />
                      <strong>{cat.name}</strong>
                    </div>
                  </td>
                  <td>
                    <code>{cat.slug}</code>
                  </td>
                  <td>
                    <span className="text-secondary text-sm">
                      {cat.description?.slice(0, 60) || 'General Category'}
                    </span>
                  </td>
                  <td>
                    <strong>{cat.productCount || 0} items</strong>
                  </td>
                  <td>
                    <span className={`badge ${cat.active ? 'badge-new' : 'badge-discount'}`}>
                      {cat.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions-cell">
                      <button
                        type="button"
                        className="table-action-icon-btn"
                        onClick={() => handleOpenEdit(cat)}
                        title="Edit Category"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className="table-action-icon-btn delete"
                        onClick={() => setDeleteTarget(cat)}
                        title="Delete Category"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Category' : 'Create Category'}
        maxWidth="540px"
      >
        <form onSubmit={handleSaveCategory} className="admin-form-grid">
          <div className="form-group">
            <label className="form-label">Category Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              className="form-input"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <label className="filter-checkbox-label">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            />
            <span>Active in Navigation &amp; Catalog</span>
          </label>

          <div className="checkout-step-actions mt-3">
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Category Deletion"
        maxWidth="440px"
      >
        <p>
          Are you sure you want to delete category <strong>{deleteTarget?.name}</strong>? Deletion will
          be blocked if active products are assigned to this category.
        </p>
        <div className="checkout-step-actions mt-4">
          <button type="button" className="btn btn-outline" onClick={() => setDeleteTarget(null)}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
            Delete Category
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCategories;

import { useState, useEffect } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaTimes,
  FaCheck,
} from 'react-icons/fa';
import Modal from '../../components/Modal/Modal.jsx';
import { Spinner } from '../../components/Loader/Loader.jsx';
import API from '../../services/api.js';
import { formatCurrency } from '../../utils/formatters.js';
import { fallbackProducts, fallbackCategories } from '../../data/fallbackData.js';
import './Admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    brand: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: '',
    sku: '',
    shortDescription: '',
    description: '',
    images: [''],
    featured: false,
    bestseller: false,
    newArrival: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchProductsAndCats = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.allSettled([
        API.get('/products?limit=100'),
        API.get('/categories'),
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value.data?.success) {
        setProducts(prodRes.value.data.data);
      } else {
        setProducts(fallbackProducts);
      }

      if (catRes.status === 'fulfilled' && catRes.value.data?.success) {
        setCategories(catRes.value.data.data);
      } else {
        setCategories(fallbackCategories);
      }
    } catch {
      setProducts(fallbackProducts);
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCats();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      ...initialForm,
      category: categories[0]?._id || '',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
    });
    setIsEditing(false);
    setCurrentProductId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setFormData({
      name: p.name,
      brand: p.brand,
      category: p.category?._id || p.category || '',
      price: p.price,
      discountPrice: p.discountPrice || '',
      stock: p.stock,
      sku: p.sku || '',
      shortDescription: p.shortDescription || '',
      description: p.description,
      images: p.images && p.images.length > 0 ? p.images : [''],
      featured: Boolean(p.featured),
      bestseller: Boolean(p.bestseller),
      newArrival: Boolean(p.newArrival),
    });
    setIsEditing(true);
    setCurrentProductId(p._id);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlertMsg(null);

    const cleanImages = formData.images.filter((img) => img.trim() !== '');
    if (cleanImages.length === 0) {
      cleanImages.push('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80');
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
      stock: Number(formData.stock),
      images: cleanImages,
    };

    try {
      if (isEditing) {
        const res = await API.put(`/admin/products/${currentProductId}`, payload);
        if (res.data?.success) {
          setProducts((prev) =>
            prev.map((item) => (item._id === currentProductId ? res.data.data : item))
          );
          setIsModalOpen(false);
          setAlertMsg({ type: 'success', text: 'Product updated successfully.' });
        }
      } else {
        const res = await API.post('/admin/products', payload);
        if (res.data?.success) {
          setProducts((prev) => [res.data.data, ...prev]);
          setIsModalOpen(false);
          setAlertMsg({ type: 'success', text: 'Product created successfully.' });
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
      await API.delete(`/admin/products/${deleteTarget._id}`);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
      setAlertMsg({ type: 'success', text: 'Product removed from store catalog.' });
    } catch (err) {
      setAlertMsg({
        type: 'error',
        text: err.response?.data?.message || 'Could not delete product.',
      });
      setDeleteTarget(null);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-products-view animate-fade-in">
      <div className="admin-actions-bar flex-between mb-4 flex-wrap gap-3">
        <div className="admin-search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search products by title, brand, or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem', width: '320px' }}
          />
        </div>

        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          <FaPlus /> Add New Product
        </button>
      </div>

      {alertMsg && (
        <div className={`profile-alert ${alertMsg.type} card mb-4`}>
          {alertMsg.text}
        </div>
      )}

      {loading ? (
        <Spinner size="medium" text="Loading product inventory..." />
      ) : (
        <div className="admin-table-wrapper card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Badges</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="table-product-cell">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80'}
                        alt={p.name}
                        className="table-product-thumb"
                      />
                      <div>
                        <strong className="table-product-name">{p.name}</strong>
                        <span className="table-product-sku">SKU: {p.sku || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td>{p.category?.name || 'General'}</td>
                  <td>
                    <strong>{formatCurrency(p.discountPrice || p.price)}</strong>
                    {p.discountPrice > 0 && (
                      <span className="text-muted ml-1" style={{ textDecoration: 'line-through', fontSize: '0.8rem' }}>
                        {formatCurrency(p.price)}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={p.stock <= 5 ? 'text-warning font-bold' : ''}>
                      {p.stock} units
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1 flex-wrap">
                      {p.featured && <span className="badge badge-featured">Featured</span>}
                      {p.bestseller && <span className="badge badge-bestseller">Hot</span>}
                      {p.newArrival && <span className="badge badge-new">New</span>}
                    </div>
                  </td>
                  <td>
                    <div className="table-actions-cell">
                      <button
                        type="button"
                        className="table-action-icon-btn"
                        onClick={() => handleOpenEdit(p)}
                        title="Edit Product"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className="table-action-icon-btn delete"
                        onClick={() => setDeleteTarget(p)}
                        title="Delete Product"
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

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Product Details' : 'Create New Product'}
        maxWidth="740px"
      >
        <form onSubmit={handleSaveProduct} className="admin-form-grid">
          <div className="form-group">
            <label className="form-label">Product Title *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Brand *</label>
              <input
                type="text"
                className="form-input"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">SKU (Stock Keeping Unit)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Auto-generated if empty"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                placeholder="Optional"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Quantity *</label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Image URL *</label>
            <input
              type="url"
              className="form-input"
              value={formData.images[0] || ''}
              onChange={(e) => {
                const imgs = [...formData.images];
                imgs[0] = e.target.value;
                setFormData({ ...formData, images: imgs });
              }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Short Summary (1-2 sentences)</label>
            <input
              type="text"
              className="form-input"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea
              className="form-textarea"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="checkbox-row">
            <label className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <span>Featured on Homepage</span>
            </label>

            <label className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={formData.bestseller}
                onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
              />
              <span>Bestseller / Trending</span>
            </label>

            <label className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={formData.newArrival}
                onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
              />
              <span>New Arrival</span>
            </label>
          </div>

          <div className="checkout-step-actions">
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Product Deletion"
        maxWidth="440px"
      >
        <p>
          Are you sure you want to permanently delete <strong>{deleteTarget?.name}</strong>? This action
          cannot be undone.
        </p>
        <div className="checkout-step-actions mt-4">
          <button type="button" className="btn btn-outline" onClick={() => setDeleteTarget(null)}>
            Keep Product
          </button>
          <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
            Delete Permanently
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProducts;

import { useState, useEffect } from 'react';
import { FaUsers, FaSearch, FaUserShield, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import API from '../../services/api.js';
import { Spinner } from '../../components/Loader/Loader.jsx';
import { formatDate } from '../../utils/formatters.js';
import { useAuth } from '../../context/AuthContext.jsx';
import './Admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [alertMsg, setAlertMsg] = useState(null);

  const { user: currentAdmin } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/users');
      if (res.data?.success && res.data.data) {
        setUsers(res.data.data);
      }
    } catch (err) {
      // Fallback demo users
      setUsers([
        {
          _id: 'usr-1',
          name: 'Muhammad Rashid (Lead Developer & Admin)',
          email: 'admin@rashidstore.com',
          role: 'admin',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          _id: 'usr-2',
          name: 'Shopper Demo',
          email: 'user@rashidstore.com',
          role: 'user',
          isActive: true,
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (targetUser) => {
    if (targetUser._id === currentAdmin?._id) {
      setAlertMsg({
        type: 'error',
        text: 'Security Protection: You cannot change your own administrative role.',
      });
      return;
    }

    const nextRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      const res = await API.put(`/admin/users/${targetUser._id}`, { role: nextRole });
      if (res.data?.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === targetUser._id ? { ...u, role: nextRole } : u))
        );
        setAlertMsg({ type: 'success', text: `User role changed to ${nextRole}.` });
        setTimeout(() => setAlertMsg(null), 3000);
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to update user role.' });
    }
  };

  const handleToggleActive = async (targetUser) => {
    if (targetUser._id === currentAdmin?._id) {
      setAlertMsg({
        type: 'error',
        text: 'Security Protection: You cannot deactivate your own account.',
      });
      return;
    }

    const nextActive = !targetUser.isActive;
    try {
      const res = await API.put(`/admin/users/${targetUser._id}`, { isActive: nextActive });
      if (res.data?.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === targetUser._id ? { ...u, isActive: nextActive } : u))
        );
        setAlertMsg({
          type: 'success',
          text: `User account is now ${nextActive ? 'Active' : 'Deactivated'}.`,
        });
        setTimeout(() => setAlertMsg(null), 3000);
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to update account status.' });
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-users-view animate-fade-in">
      <div className="admin-actions-bar flex-between mb-4 flex-wrap gap-3">
        <div className="admin-search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem', width: '320px' }}
          />
        </div>
      </div>

      {alertMsg && (
        <div className={`profile-alert ${alertMsg.type} card mb-4`}>
          {alertMsg.text}
        </div>
      )}

      {loading ? (
        <Spinner size="medium" text="Loading registered accounts..." />
      ) : (
        <div className="admin-table-wrapper card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isSelf = u._id === currentAdmin?._id;
                return (
                  <tr key={u._id}>
                    <td>
                      <strong>{u.name}</strong>
                      {isSelf && <span className="badge badge-featured ml-2">You</span>}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-bestseller' : 'badge-new'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-new' : 'badge-discount'}`}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>
                      <div className="table-actions-cell">
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleToggleRole(u)}
                          disabled={isSelf}
                          title={u.role === 'admin' ? 'Demote to Customer' : 'Promote to Admin'}
                        >
                          <FaUserShield /> {u.role === 'admin' ? 'Demote' : 'Promote'}
                        </button>

                        <button
                          type="button"
                          className={`btn btn-sm ${u.isActive ? 'btn-outline' : 'btn-primary'}`}
                          onClick={() => handleToggleActive(u)}
                          disabled={isSelf}
                          title={u.isActive ? 'Disable User' : 'Enable User'}
                        >
                          {u.isActive ? <FaUserTimes /> : <FaUserCheck />}
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

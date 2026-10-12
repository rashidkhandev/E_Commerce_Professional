import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaLock,
  FaShieldAlt,
  FaClipboardList,
  FaHeart,
  FaSignOutAlt,
  FaCheck,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import API from '../../services/api.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './Profile.css';

const Profile = () => {
  useDocumentTitle('My Profile');
  const { user, isAdmin, logout, updateUserState } = useAuth();

  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    province: user?.address?.province || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'Pakistan',
  });

  // Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        province: user.address?.province || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || 'Pakistan',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const payload = {
        name: profileData.name,
        phone: profileData.phone,
        address: {
          street: profileData.street,
          city: profileData.city,
          province: profileData.province,
          postalCode: profileData.postalCode,
          country: profileData.country,
        },
      };

      const res = await API.put('/users/profile', payload);
      if (res.data?.success) {
        updateUserState({ ...user, ...res.data.data });
        setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to update profile.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setStatusMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await API.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.data?.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setStatusMessage({ type: 'success', text: 'Password changed successfully!' });
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to change password.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container profile-page animate-fade-in">
      <div className="profile-layout">
        {/* Left Profile Sidebar */}
        <aside className="profile-sidebar card">
          <div className="profile-user-card">
            <div className="profile-avatar-circle">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 className="profile-display-name">{user?.name}</h3>
            <span className="profile-display-email">{user?.email}</span>
            <div className="profile-role-badge">
              {isAdmin ? (
                <span className="badge badge-bestseller">
                  <FaShieldAlt /> Administrator
                </span>
              ) : (
                <span className="badge badge-new">Customer</span>
              )}
            </div>
          </div>

          <nav className="profile-nav-links">
            <button
              type="button"
              className={`profile-nav-btn ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('info');
                setStatusMessage(null);
              }}
            >
              <FaUser /> Personal Details
            </button>
            <button
              type="button"
              className={`profile-nav-btn ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('password');
                setStatusMessage(null);
              }}
            >
              <FaLock /> Change Password
            </button>
            <Link to="/orders" className="profile-nav-btn">
              <FaClipboardList /> Order History
            </Link>
            <Link to="/wishlist" className="profile-nav-btn">
              <FaHeart /> My Wishlist
            </Link>
            {isAdmin && (
              <Link to="/admin" className="profile-nav-btn admin-portal-btn">
                <FaShieldAlt /> Open Admin Dashboard
              </Link>
            )}
            <button type="button" className="profile-nav-btn logout-nav-btn" onClick={logout}>
              <FaSignOutAlt /> Sign Out
            </button>
          </nav>
        </aside>

        {/* Right Tab Content */}
        <main className="profile-content-area card">
          {statusMessage && (
            <div className={`profile-alert ${statusMessage.type} animate-fade-in`}>
              {statusMessage.text}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="profile-tab-pane animate-fade-in">
              <h2 className="tab-title">Personal &amp; Shipping Details</h2>
              <p className="tab-subtitle">Update your profile info and default delivery address.</p>

              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">Email Address (Immutable)</label>
                    <input type="email" className="form-input" value={user?.email || ''} disabled />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="e.g. 03347784456"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>

                <h3 className="section-divider-title">
                  <FaMapMarkerAlt /> Default Shipping Address
                </h3>

                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="House/Apartment #, Street name"
                    value={profileData.street}
                    onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">Province / State</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.province}
                      onChange={(e) => setProfileData({ ...profileData, province: e.target.value })}
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.postalCode}
                      onChange={(e) => setProfileData({ ...profileData, postalCode: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
                  {loading ? 'Saving Changes...' : <><FaCheck /> Save Profile Details</>}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="profile-tab-pane animate-fade-in">
              <h2 className="tab-title">Security &amp; Password</h2>
              <p className="tab-subtitle">Update your password to ensure account safety.</p>

              <form onSubmit={handlePasswordChange} className="profile-form" style={{ maxWidth: '460px' }}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password (min 6 chars)</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    required
                    minLength={6}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordData.confirmNewPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
                    }
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
                  {loading ? 'Updating Password...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;

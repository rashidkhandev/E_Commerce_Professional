import { useState } from 'react';
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaClipboardList,
  FaTags,
  FaUsers,
  FaShieldAlt,
} from 'react-icons/fa';
import AdminDashboard from './AdminDashboard.jsx';
import AdminProducts from './AdminProducts.jsx';
import AdminOrders from './AdminOrders.jsx';
import AdminCategories from './AdminCategories.jsx';
import AdminUsers from './AdminUsers.jsx';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './Admin.css';

const Admin = () => {
  useDocumentTitle('Store Administration Control Center');
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="container admin-layout-container animate-fade-in">
      {/* Top Banner */}
      <div className="admin-header-strip">
        <div className="admin-title-group">
          <h1>
            <FaShieldAlt className="text-secondary" /> Administrative Control Panel
          </h1>
          <p className="admin-subtitle">
            Manage live products, categories, orders, inventory, and registered accounts
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="admin-tabs-nav">
        <button
          type="button"
          className={`admin-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <FaTachometerAlt /> Metrics &amp; Dashboard
        </button>

        <button
          type="button"
          className={`admin-nav-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <FaBoxOpen /> Products Management
        </button>

        <button
          type="button"
          className={`admin-nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <FaClipboardList /> Orders Management
        </button>

        <button
          type="button"
          className={`admin-nav-tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <FaTags /> Categories
        </button>

        <button
          type="button"
          className={`admin-nav-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <FaUsers /> User Accounts
        </button>
      </nav>

      {/* Render Active View */}
      <main className="admin-main-view">
        {activeTab === 'dashboard' && <AdminDashboard onNavigateTab={setActiveTab} />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'categories' && <AdminCategories />}
        {activeTab === 'users' && <AdminUsers />}
      </main>
    </div>
  );
};

export default Admin;

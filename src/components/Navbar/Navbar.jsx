import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  FaShoppingBag,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaShieldAlt,
  FaSignOutAlt,
  FaClipboardList,
} from 'react-icons/fa';
import SearchBar from '../SearchBar/SearchBar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);

  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll appearance change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountDropdownOpen(false);
    setIsSearchOpenMobile(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setIsAccountDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="navbar-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Left: Brand Identity */}
          <Link to="/" className="navbar-brand">
            <span className="brand-logo-badge">E</span>
            <div className="brand-text-group">
              <span className="brand-name">E-COMMERCE</span>
              <span className="brand-tagline">Shop Smarter</span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="navbar-nav desktop-only">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Home
            </NavLink>
            <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Shop
            </NavLink>
            <NavLink to="/shop?sort=discount" className={({ isActive }) => `nav-link nav-deals ${isActive ? 'active' : ''}`}>
              Deals
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              About
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Contact
            </NavLink>
          </nav>

          {/* Desktop Search Bar */}
          <div className="navbar-search desktop-only">
            <SearchBar />
          </div>

          {/* Right Actions: Theme, Wishlist, Cart, Account */}
          <div className="navbar-actions">
            {/* Theme Toggle Button */}
            <button
              type="button"
              className="navbar-icon-btn theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>

            {/* Wishlist Link with Live Counter */}
            <Link to="/wishlist" className="navbar-icon-btn" aria-label="Wishlist">
              <FaHeart />
              {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
            </Link>

            {/* Cart Link with Live Counter */}
            <Link to="/cart" className="navbar-icon-btn cart-btn" aria-label="Cart">
              <FaShoppingBag />
              {cartCount > 0 && <span className="action-badge cart-badge">{cartCount}</span>}
            </Link>

            {/* Account Dropdown */}
            <div className="account-dropdown-wrapper">
              <button
                type="button"
                className="navbar-icon-btn user-btn"
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                aria-label="User Account Menu"
              >
                <FaUser />
              </button>

              {isAccountDropdownOpen && (
                <div className="account-dropdown-menu animate-fade-in">
                  {user ? (
                    <>
                      <div className="account-dropdown-header">
                        <p className="account-user-name">{user.name}</p>
                        <p className="account-user-email">{user.email}</p>
                      </div>

                      <div className="account-dropdown-links">
                        <Link to="/profile" className="account-menu-item">
                          <FaUser /> Profile Details
                        </Link>
                        <Link to="/orders" className="account-menu-item">
                          <FaClipboardList /> My Orders
                        </Link>
                        <Link to="/wishlist" className="account-menu-item">
                          <FaHeart /> My Wishlist
                        </Link>

                        {isAdmin && (
                          <Link to="/admin" className="account-menu-item admin-link">
                            <FaShieldAlt /> Admin Dashboard
                          </Link>
                        )}
                      </div>

                      <div className="account-dropdown-footer">
                        <button type="button" className="account-logout-btn" onClick={handleLogout}>
                          <FaSignOutAlt /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="account-guest-view">
                      <p className="guest-greeting">Welcome to E-Commerce</p>
                      <Link to="/login" className="btn btn-primary btn-sm btn-block">
                        Sign In
                      </Link>
                      <Link to="/register" className="btn btn-outline btn-sm btn-block">
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Row (Visible on Small Screens) */}
        <div className="mobile-search-row container mobile-only">
          <SearchBar onCloseMobile={() => setIsMobileMenuOpen(false)} />
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <Link to="/" className="navbar-brand" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="brand-logo-badge">E</span>
            <span className="brand-name">E-COMMERCE</span>
          </Link>
          <button
            type="button"
            className="mobile-drawer-close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          <NavLink to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/shop" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            Shop All Products
          </NavLink>
          <NavLink to="/shop?sort=discount" className="mobile-nav-link nav-deals" onClick={() => setIsMobileMenuOpen(false)}>
            Exclusive Deals & Discounts
          </NavLink>
          <NavLink to="/about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            About E-Commerce
          </NavLink>
          <NavLink to="/contact" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            Customer Support & Contact
          </NavLink>

          <div className="mobile-drawer-divider"></div>

          {user ? (
            <>
              <div className="mobile-user-info">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
              <NavLink to="/profile" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <FaUser /> My Profile
              </NavLink>
              <NavLink to="/orders" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <FaClipboardList /> Order History
              </NavLink>
              <NavLink to="/wishlist" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <FaHeart /> My Wishlist ({wishlistCount})
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className="mobile-nav-link admin-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaShieldAlt /> Admin Management
                </NavLink>
              )}
              <button type="button" className="btn btn-outline btn-block mt-3" onClick={handleLogout}>
                <FaSignOutAlt /> Sign Out
              </button>
            </>
          ) : (
            <div className="mobile-auth-actions">
              <Link to="/login" className="btn btn-primary btn-block" onClick={() => setIsMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-outline btn-block" onClick={() => setIsMobileMenuOpen(false)}>
                Create Account
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </>
  );
};

export default Navbar;

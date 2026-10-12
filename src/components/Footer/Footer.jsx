import { Link } from 'react-router-dom';
import {
  FaGithub,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaLock,
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-root">
      {/* Top Value Proposition Strip */}
      <div className="footer-strip">
        <div className="container footer-strip-grid">
          <div className="strip-item">
            <FaTruck className="strip-icon" />
            <div>
              <h4>Free Express Shipping</h4>
              <p>On all domestic orders over $75</p>
            </div>
          </div>
          <div className="strip-item">
            <FaShieldAlt className="strip-icon" />
            <div>
              <h4>Authentic Guarantee</h4>
              <p>100% verified premium inventory</p>
            </div>
          </div>
          <div className="strip-item">
            <FaUndo className="strip-icon" />
            <div>
              <h4>Hassle-Free Returns</h4>
              <p>30-day effortless return window</p>
            </div>
          </div>
          <div className="strip-item">
            <FaLock className="strip-icon" />
            <div>
              <h4>Secure Checkout</h4>
              <p>Cash on Delivery & 256-bit SSL protection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="container footer-main">
        <div className="footer-columns">
          {/* Column 1: Brand & Lead Developer */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-brand">
              <span className="brand-logo-badge">E</span>
              <div>
                <span className="brand-name">E-COMMERCE</span>
                <span className="brand-sub">Crafted by Muhammad Rashid</span>
              </div>
            </Link>
            <p className="footer-bio">
              A high-performance, full-stack MERN e-commerce application engineered with scalable architecture,
              seamless UX, secure state synchronization, and enterprise-grade performance.
            </p>

            <div className="developer-tag-card">
              <span className="dev-title">Lead Developer & Architect:</span>
              <strong className="dev-name">Muhammad Rashid</strong>
              <span className="dev-role">MERN Stack Developer</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home Overview</Link></li>
              <li><Link to="/shop">Shop Catalog</Link></li>
              <li><Link to="/shop?sort=discount">Deals & Discounts</Link></li>
              <li><Link to="/about">About Store</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="footer-col">
            <h4 className="footer-col-title">Store Policies</h4>
            <ul className="footer-links">
              <li><Link to="/policies/privacy">Privacy Policy</Link></li>
              <li><Link to="/policies/terms">Terms & Conditions</Link></li>
              <li><Link to="/policies/shipping">Shipping Policy</Link></li>
              <li><Link to="/policies/returns">Return & Refund Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Social Connect */}
          <div className="footer-col">
            <h4 className="footer-col-title">Direct Connect</h4>
            <div className="footer-contact-list">
              <a href="mailto:rashidwazir093@gmail.com" className="footer-contact-item">
                <FaEnvelope className="contact-icon" />
                <span>rashidwazir093@gmail.com</span>
              </a>
              <a
                href="https://wa.me/923347784456"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-item whatsapp-item"
              >
                <FaWhatsapp className="contact-icon" />
                <span>03347784456 (WhatsApp)</span>
              </a>
              <div className="footer-contact-item">
                <FaPhoneAlt className="contact-icon" />
                <span>+92 334 7784456</span>
              </div>
            </div>

            <div className="footer-social-row">
              <a
                href="https://github.com/rashidkhandevlink"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label="GitHub Profile"
                title="GitHub: rashidkhandevlink"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/rashid-wazir-272a06420/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label="LinkedIn Profile"
                title="LinkedIn: Rashid Wazir"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://wa.me/923347784456"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn whatsapp-social"
                aria-label="WhatsApp Chat"
                title="WhatsApp Direct Contact"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Disclaimer */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} <strong>E-Commerce</strong>. Designed and Developed with precision by{' '}
            <strong>Muhammad Rashid</strong> (MERN Stack Developer). All rights reserved.
          </p>
          <div className="payment-badges-row">
            <span className="pay-pill">Cash on Delivery</span>
            <span className="pay-pill">256-Bit SSL</span>
            <span className="pay-pill">Verified Portfolio</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

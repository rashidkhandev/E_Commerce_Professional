import { Link } from 'react-router-dom';
import { FaHome, FaShoppingBag, FaQuestionCircle } from 'react-icons/fa';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './NotFound.css';

const NotFound = () => {
  useDocumentTitle('404 - Page Not Found');

  return (
    <div className="container not-found-page animate-fade-in">
      <div className="not-found-card card">
        <span className="error-code">404</span>
        <h1 className="error-title">Page Not Found</h1>
        <p className="error-desc">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="error-actions-group">
          <Link to="/" className="btn btn-primary btn-lg">
            <FaHome /> Return Home
          </Link>
          <Link to="/shop" className="btn btn-outline btn-lg">
            <FaShoppingBag /> Explore Shop
          </Link>
          <Link to="/contact" className="btn btn-outline btn-lg">
            <FaQuestionCircle /> Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

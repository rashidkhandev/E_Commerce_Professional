import { Link } from 'react-router-dom';
import { FaHeart, FaTrashAlt, FaShoppingBag, FaArrowRight } from 'react-icons/fa';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { formatCurrency } from '../../utils/formatters.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './Wishlist.css';

const Wishlist = () => {
  useDocumentTitle('My Wishlist');
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container wishlist-empty-page animate-fade-in">
        <div className="wishlist-empty-card card">
          <div className="empty-heart-circle">
            <FaHeart />
          </div>
          <h2>Your Wishlist is Empty</h2>
          <p>Tap the heart icon on any product to save items you love for later.</p>
          <Link to="/shop" className="btn btn-primary mt-3">
            Explore Catalog <FaArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container wishlist-page animate-fade-in">
      <div className="wishlist-header">
        <h1 className="wishlist-title">Saved Wishlist</h1>
        <p className="wishlist-subtitle">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved in your favorites
        </p>
      </div>

      <div className="wishlist-grid">
        {wishlistItems.map((item) => {
          const effectivePrice = item.discountPrice > 0 ? item.discountPrice : item.price;
          const image = item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';

          return (
            <div key={item._id} className="wishlist-card card">
              <div className="wishlist-media">
                <Link to={`/product/${item.slug || item._id}`}>
                  <img src={image} alt={item.name} className="wishlist-img" />
                </Link>
                <button
                  type="button"
                  className="wishlist-delete-btn"
                  onClick={() => removeFromWishlist(item._id)}
                  title="Remove from wishlist"
                >
                  <FaTrashAlt />
                </button>
              </div>

              <div className="wishlist-body">
                <span className="wishlist-brand">{item.brand || 'E-Commerce'}</span>
                <h3 className="wishlist-item-title">
                  <Link to={`/product/${item.slug || item._id}`}>{item.name}</Link>
                </h3>

                <div className="wishlist-price-row">
                  <span className="wishlist-price">{formatCurrency(effectivePrice)}</span>
                  {item.discountPrice > 0 && (
                    <span className="wishlist-orig-price">{formatCurrency(item.price)}</span>
                  )}
                </div>

                <div className="wishlist-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-block btn-sm"
                    onClick={() => handleMoveToCart(item)}
                  >
                    <FaShoppingBag /> Move to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;

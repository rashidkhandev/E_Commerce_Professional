import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaEye, FaShoppingBag, FaCheck } from 'react-icons/fa';
import Rating from '../Rating/Rating.jsx';
import Modal from '../Modal/Modal.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { formatCurrency } from '../../utils/formatters.js';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const isFavorited = isInWishlist(product._id);
  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
  const secondaryImage = product.images?.[1] || primaryImage;

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleOpenQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  // WhatsApp click handler for quick view
  const getWhatsAppLink = () => {
    const text = `Hello E-Commerce! I am interested in ordering:
Product: ${product.name}
SKU: ${product.sku || 'N/A'}
Price: ${formatCurrency(currentPrice)}`;
    return `https://wa.me/923347784456?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      <div
        className="product-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card Media Header */}
        <div className="product-card-media">
          <Link to={`/product/${product.slug || product._id}`} className="product-card-image-link">
            <img
              src={isHovered ? secondaryImage : primaryImage}
              alt={product.name}
              className="product-card-img"
              loading="lazy"
            />
          </Link>

          {/* Badges */}
          <div className="product-badges">
            {hasDiscount && (
              <span className="badge badge-discount">
                -{product.discountPercentage || Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
              </span>
            )}
            {product.newArrival && <span className="badge badge-new">New</span>}
            {product.bestseller && !product.newArrival && <span className="badge badge-bestseller">Hot</span>}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            className={`product-wishlist-btn ${isFavorited ? 'active' : ''}`}
            onClick={handleToggleWishlist}
            aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isFavorited ? <FaHeart /> : <FaRegHeart />}
          </button>

          {/* Hover Actions: Quick View */}
          <div className="product-hover-actions">
            <button
              type="button"
              className="product-action-btn"
              onClick={handleOpenQuickView}
              title="Quick View"
              aria-label="Quick View"
            >
              <FaEye /> Quick View
            </button>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="product-card-body">
          <div className="product-card-meta">
            <span className="product-brand">{product.brand || 'E-Commerce'}</span>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="product-low-stock">Only {product.stock} left</span>
            )}
            {product.stock === 0 && <span className="product-out-of-stock">Out of stock</span>}
          </div>

          <h3 className="product-title">
            <Link to={`/product/${product.slug || product._id}`}>{product.name}</Link>
          </h3>

          <div className="product-rating-row">
            <Rating value={product.rating || 4.5} count={product.reviewCount || 0} size={13} />
          </div>

          <div className="product-footer-row">
            <div className="product-prices">
              <span className="product-price">{formatCurrency(currentPrice)}</span>
              {hasDiscount && (
                <span className="product-original-price">{formatCurrency(product.price)}</span>
              )}
            </div>

            <button
              type="button"
              className={`product-add-cart-btn ${addedAnimation ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              aria-label="Add to cart"
            >
              {addedAnimation ? <FaCheck /> : <FaShoppingBag />}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <Modal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        title="Product Preview"
        maxWidth="680px"
      >
        <div className="quickview-grid">
          <div className="quickview-image-wrapper">
            <img src={primaryImage} alt={product.name} className="quickview-img" />
          </div>
          <div className="quickview-details">
            <span className="quickview-brand">{product.brand}</span>
            <h2 className="quickview-title">{product.name}</h2>
            <div className="quickview-rating">
              <Rating value={product.rating || 4.5} count={product.reviewCount || 0} />
            </div>

            <div className="quickview-prices">
              <span className="quickview-price">{formatCurrency(currentPrice)}</span>
              {hasDiscount && (
                <span className="quickview-original-price">{formatCurrency(product.price)}</span>
              )}
            </div>

            <p className="quickview-description">
              {product.shortDescription || product.description?.slice(0, 140) + '...'}
            </p>

            <div className="quickview-actions">
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={(e) => {
                  handleAddToCart(e);
                  setIsQuickViewOpen(false);
                }}
                disabled={product.stock === 0}
              >
                <FaShoppingBag /> Add To Cart
              </button>

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-block"
              >
                Order / Ask on WhatsApp
              </a>

              <Link
                to={`/product/${product.slug || product._id}`}
                className="btn btn-outline btn-block"
                onClick={() => setIsQuickViewOpen(false)}
              >
                View Full Product Details →
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductCard;

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaHeart,
  FaRegHeart,
  FaShoppingBag,
  FaBolt,
  FaWhatsapp,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaCheck,
  FaShareAlt,
} from 'react-icons/fa';
import Rating from '../../components/Rating/Rating.jsx';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import { Spinner } from '../../components/Loader/Loader.jsx';
import API from '../../services/api.js';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatCurrency, formatDate } from '../../utils/formatters.js';
import { fallbackProducts } from '../../data/fallbackData.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './ProductDetails.css';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review submission state
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  useDocumentTitle(product ? product.name : 'Product Details');

  // Load product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/products/${slug}`);
        if (res.data?.success && res.data.data) {
          const prodData = res.data.data;
          setProduct(prodData);
          setSelectedImage(prodData.images?.[0] || '');

          // Fetch related
          if (prodData._id) {
            try {
              const relRes = await API.get(`/products/${prodData._id}/related`);
              if (relRes.data?.success) setRelatedProducts(relRes.data.data);
            } catch {
              setRelatedProducts(fallbackProducts.filter((p) => p.slug !== slug).slice(0, 4));
            }

            // Fetch reviews
            try {
              const revRes = await API.get(`/products/${prodData._id}/reviews`);
              if (revRes.data?.success) setReviews(revRes.data.data);
            } catch {
              setReviews([]);
            }
          }

          // Save to Recently Viewed
          try {
            const stored = JSON.parse(localStorage.getItem('rashid_recently_viewed') || '[]');
            const filtered = stored.filter((item) => item.slug !== prodData.slug);
            const updated = [
              {
                _id: prodData._id,
                name: prodData.name,
                slug: prodData.slug,
                price: prodData.price,
                discountPrice: prodData.discountPrice,
                images: prodData.images,
                brand: prodData.brand,
                rating: prodData.rating,
              },
              ...filtered,
            ].slice(0, 6);
            localStorage.setItem('rashid_recently_viewed', JSON.stringify(updated));
            setRecentlyViewed(updated.filter((item) => item.slug !== prodData.slug));
          } catch (e) {
            // ignore
          }
        } else {
          throw new Error('Product not found');
        }
      } catch (err) {
        // Fallback to static data
        const found = fallbackProducts.find((p) => p.slug === slug || p._id === slug);
        if (found) {
          setProduct(found);
          setSelectedImage(found.images?.[0] || '');
          setRelatedProducts(fallbackProducts.filter((p) => p.slug !== found.slug).slice(0, 4));
        } else {
          setError('Product not found. It may have been relocated or removed.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="container py-5">
        <Spinner size="large" text="Loading product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container product-error-container">
        <h2>Product Not Found</h2>
        <p>{error || "We couldn't find the product you're looking for."}</p>
        <Link to="/shop" className="btn btn-primary">
          Back to Shop Catalog
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  const isFavorited = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const getWhatsAppMessage = () => {
    const text = `Hello E-Commerce! I want to order / inquire about:
*Product*: ${product.name}
*Quantity*: ${quantity}
*Price*: ${formatCurrency(currentPrice)} (Total: ${formatCurrency(currentPrice * quantity)})
*SKU*: ${product.sku || 'N/A'}`;
    return `https://wa.me/923347784456?text=${encodeURIComponent(text)}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} at E-Commerce`,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (!newComment.trim()) {
      setReviewMessage({ type: 'error', text: 'Please write a review comment.' });
      return;
    }

    setSubmittingReview(true);
    setReviewMessage(null);

    try {
      const res = await API.post(`/products/${product._id}/reviews`, {
        rating: newRating,
        comment: newComment,
      });

      if (res.data?.success) {
        setReviews([res.data.data, ...reviews]);
        setNewComment('');
        setReviewMessage({ type: 'success', text: 'Your review was posted successfully!' });
      }
    } catch (err) {
      setReviewMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to submit review.',
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="product-details-page container animate-fade-in">
      {/* Breadcrumb Navigation */}
      <nav className="product-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        {product.category?.name && (
          <>
            <Link to={`/shop?category=${product.category.slug || product.category}`}>{product.category.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      {/* Main Two-Column Product Presentation */}
      <div className="product-details-hero">
        {/* Left: Gallery & Zoom Preview */}
        <div className="product-gallery">
          <div className="gallery-main-frame">
            <img src={selectedImage} alt={product.name} className="gallery-main-image" />
            {hasDiscount && (
              <span className="badge badge-discount gallery-badge">
                -{product.discountPercentage || Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="gallery-thumbnails">
              {product.images.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  className={`thumbnail-btn ${selectedImage === img ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Commerce Controls */}
        <div className="product-info-panel">
          <div className="panel-header">
            <span className="product-brand-tag">{product.brand}</span>
            <div className="panel-top-actions">
              <button
                type="button"
                className="panel-icon-btn"
                onClick={handleShare}
                title="Share Product"
                aria-label="Share Product"
              >
                <FaShareAlt />
              </button>
              <button
                type="button"
                className={`panel-icon-btn ${isFavorited ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
                title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
                aria-label="Wishlist toggle"
              >
                {isFavorited ? <FaHeart className="text-danger" /> : <FaRegHeart />}
              </button>
            </div>
          </div>

          <h1 className="product-detail-title">{product.name}</h1>

          {/* Rating and SKU row */}
          <div className="product-meta-row">
            <Rating value={product.rating || 4.5} count={product.reviewCount || 0} size={15} />
            <span className="meta-sku">SKU: {product.sku}</span>
          </div>

          {/* Price Block */}
          <div className="product-price-block">
            <span className="product-current-price">{formatCurrency(currentPrice)}</span>
            {hasDiscount && (
              <>
                <span className="product-strikethrough-price">{formatCurrency(product.price)}</span>
                <span className="price-save-tag">
                  Save {formatCurrency(product.price - currentPrice)}
                </span>
              </>
            )}
          </div>

          {/* Stock Status Badge */}
          <div className="stock-status-row">
            {product.stock > 5 ? (
              <span className="stock-pill stock-in">
                <FaCheck /> In Stock ({product.stock} units available)
              </span>
            ) : product.stock > 0 ? (
              <span className="stock-pill stock-low">
                ⚠️ Low Stock - Only {product.stock} units remaining!
              </span>
            ) : (
              <span className="stock-pill stock-out">Out of Stock</span>
            )}
          </div>

          {/* Short Description */}
          <p className="product-short-desc">
            {product.shortDescription || product.description?.slice(0, 220) + '...'}
          </p>

          {/* Quantity Selector */}
          <div className="quantity-group">
            <span className="quantity-label">Quantity:</span>
            <div className="quantity-counter">
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="product-actions-group">
            <button
              type="button"
              className="btn btn-primary btn-lg btn-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <FaShoppingBag /> Add to Cart
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-lg btn-buy"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              <FaBolt /> Buy Now
            </button>

            {/* WhatsApp Integration with prefilled message */}
            <a
              href={getWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg btn-whatsapp-order"
            >
              <FaWhatsapp /> Order / Ask on WhatsApp
            </a>
          </div>

          {/* Guarantee Badges */}
          <div className="product-perks-box">
            <div className="perk-item">
              <FaTruck />
              <span>Free Delivery on orders above $75</span>
            </div>
            <div className="perk-item">
              <FaUndo />
              <span>30-Day Hassle-Free Returns</span>
            </div>
            <div className="perk-item">
              <FaShieldAlt />
              <span>Original &amp; Verified Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications, Description, Shipping */}
      <section className="product-tabs-section">
        <div className="tabs-header">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Detailed Description
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Technical Specifications
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping &amp; Returns
          </button>
        </div>

        <div className="tab-content card">
          {activeTab === 'description' && (
            <div className="tab-pane animate-fade-in">
              <h3>About {product.name}</h3>
              <p className="tab-description-text">{product.description}</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="tab-pane animate-fade-in">
              <h3>Technical Specifications</h3>
              {product.specifications && product.specifications.length > 0 ? (
                <table className="specs-table">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr key={i}>
                        <td className="spec-title">{spec.title}</td>
                        <td className="spec-value">{spec.value}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="spec-title">Brand / Manufacturer</td>
                      <td className="spec-value">{product.brand}</td>
                    </tr>
                    <tr>
                      <td className="spec-title">SKU Identifier</td>
                      <td className="spec-value">{product.sku}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p>Standard retail manufacturer specifications apply.</p>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="tab-pane animate-fade-in">
              <h3>Delivery &amp; Customer Protection</h3>
              <p>
                All orders are packed securely and dispatched from our local fulfillment center.
                Standard domestic delivery arrives in <strong>2 to 4 business days</strong>.
              </p>
              <ul>
                <li>Free domestic delivery applies automatically for cart orders above $75.</li>
                <li>Cash on Delivery payment is inspected upon hand-off.</li>
                <li>Hassle-free 30-day exchange or refund if the product is in its original box.</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="product-reviews-section">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">CUSTOMER FEEDBACK</span>
            <h2 className="section-title">Verified Reviews</h2>
          </div>
        </div>

        <div className="reviews-layout">
          {/* Left Review Summary & Form */}
          <div className="review-summary-card card">
            <h3>Leave a Customer Review</h3>
            <p className="summary-desc">Share your genuine experience with this product.</p>

            {user ? (
              <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="form-group">
                  <label className="form-label">Your Rating</label>
                  <Rating value={newRating} interactive={true} onRate={setNewRating} size={22} />
                </div>

                <div className="form-group">
                  <label className="form-label">Review Comment</label>
                  <textarea
                    className="form-textarea"
                    rows="4"
                    placeholder="What did you think of the build quality, performance, and value?"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  ></textarea>
                </div>

                {reviewMessage && (
                  <div className={`review-alert ${reviewMessage.type}`}>
                    {reviewMessage.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                </button>
              </form>
            ) : (
              <div className="review-auth-prompt">
                <p>Please sign in to write an authenticated review.</p>
                <Link to="/login" className="btn btn-primary btn-sm">
                  Sign In to Review
                </Link>
              </div>
            )}
          </div>

          {/* Right Review Comments List */}
          <div className="reviews-list-container">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev._id} className="review-item-card card">
                  <div className="review-item-header">
                    <div>
                      <strong className="reviewer-name">{rev.user?.name || 'Verified Customer'}</strong>
                      <span className="review-date">{formatDate(rev.createdAt)}</span>
                    </div>
                    <Rating value={rev.rating} size={14} />
                  </div>
                  <p className="review-comment-body">{rev.comment}</p>
                </div>
              ))
            ) : (
              <div className="reviews-empty card">
                <p>No customer reviews yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="home-section mt-5">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">CURATED RECOMMENDATIONS</span>
              <h2 className="section-title">Related Products</h2>
            </div>
            <Link to="/shop" className="section-link">
              Explore More →
            </Link>
          </div>
          <div className="products-grid-wrapper">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="home-section mt-4">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">YOUR BROWSING HISTORY</span>
              <h2 className="section-title">Recently Viewed</h2>
            </div>
          </div>
          <div className="products-grid-wrapper">
            {recentlyViewed.slice(0, 4).map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;

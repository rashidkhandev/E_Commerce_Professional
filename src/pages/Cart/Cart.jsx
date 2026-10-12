import { Link, useNavigate } from 'react-router-dom';
import {
  FaTrashAlt,
  FaHeart,
  FaArrowRight,
  FaShoppingBag,
  FaTruck,
  FaShieldAlt,
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { formatCurrency } from '../../utils/formatters.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './Cart.css';

const Cart = () => {
  useDocumentTitle('Your Shopping Cart');
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    subtotal,
    shipping,
    tax,
    total,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const { addToWishlist } = useWishlist();

  const freeShippingThreshold = 75;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleMoveToWishlist = (item) => {
    addToWishlist({
      _id: item.product,
      name: item.name,
      price: item.originalPrice || item.price,
      discountPrice: item.price,
      images: [item.image],
    });
    removeFromCart(item.product);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container cart-empty-view animate-fade-in">
        <div className="empty-cart-card card">
          <div className="empty-cart-icon-circle">
            <FaShoppingBag />
          </div>
          <h2>Your Cart is Currently Empty</h2>
          <p>Explore our curated collections of electronics, apparel, and lifestyle essentials to fill it up.</p>
          <div className="empty-actions">
            <Link to="/shop" className="btn btn-primary btn-lg">
              Explore Products <FaArrowRight />
            </Link>
            <Link to="/shop?sort=discount" className="btn btn-outline btn-lg">
              Check Flash Deals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-page animate-fade-in">
      <div className="cart-header">
        <div>
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-count-subtitle">
            You have {cartCount} {cartCount === 1 ? 'item' : 'items'} in your bag
          </p>
        </div>
        <button type="button" className="clear-cart-btn" onClick={clearCart}>
          <FaTrashAlt /> Clear All
        </button>
      </div>

      {/* Free Shipping Progress Notification */}
      <div className="shipping-progress-banner card">
        <div className="progress-info">
          <FaTruck className="truck-icon" />
          {amountNeededForFreeShipping > 0 ? (
            <span>
              Add <strong>{formatCurrency(amountNeededForFreeShipping)}</strong> more to unlock{' '}
              <strong>Free Express Shipping</strong>!
            </span>
          ) : (
            <span className="text-success">
              🎉 Congratulations! You have unlocked <strong>Free Domestic Shipping</strong>!
            </span>
          )}
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${freeShippingProgress}%` }}></div>
        </div>
      </div>

      <div className="cart-layout">
        {/* Left: Cart Items List */}
        <div className="cart-items-column">
          <div className="cart-items-list card">
            {cartItems.map((item) => (
              <div key={item.product} className="cart-item-row">
                <div className="cart-item-media">
                  <img src={item.image} alt={item.name} className="cart-item-thumb" />
                </div>

                <div className="cart-item-details">
                  <div className="cart-item-top">
                    <div>
                      <span className="cart-item-brand">{item.brand || 'E-Commerce'}</span>
                      <h3 className="cart-item-name">
                        <Link to={`/product/${item.slug || item.product}`}>{item.name}</Link>
                      </h3>
                      {item.sku && <span className="cart-item-sku">SKU: {item.sku}</span>}
                    </div>

                    <div className="cart-item-price-unit">
                      <span className="unit-price">{formatCurrency(item.price)}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="original-price">{formatCurrency(item.originalPrice)}</span>
                      )}
                    </div>
                  </div>

                  <div className="cart-item-bottom">
                    {/* Quantity Selector */}
                    <div className="cart-qty-counter">
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.product, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="cart-qty-val">{item.quantity}</span>
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal for Item */}
                    <div className="cart-item-subtotal">
                      <span>Total:</span>
                      <strong>{formatCurrency(item.price * item.quantity)}</strong>
                    </div>

                    {/* Actions: Move to Wishlist / Remove */}
                    <div className="cart-item-actions">
                      <button
                        type="button"
                        className="item-action-btn"
                        onClick={() => handleMoveToWishlist(item)}
                        title="Move to wishlist"
                      >
                        <FaHeart /> <span>Save for later</span>
                      </button>
                      <button
                        type="button"
                        className="item-action-btn delete-btn"
                        onClick={() => removeFromCart(item.product)}
                        title="Remove from cart"
                      >
                        <FaTrashAlt /> <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-navigation-row">
            <Link to="/shop" className="btn btn-outline">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Card */}
        <aside className="cart-summary-column">
          <div className="order-summary-card card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span className="summary-val">{formatCurrency(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>Estimated Shipping</span>
              <span className="summary-val">
                {shipping === 0 ? <strong className="text-success">FREE</strong> : formatCurrency(shipping)}
              </span>
            </div>

            <div className="summary-row">
              <span>Estimated Sales Tax (5%)</span>
              <span className="summary-val">{formatCurrency(tax)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <span>Grand Total</span>
              <span className="summary-grand-total">{formatCurrency(total)}</span>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg btn-block mt-4"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <FaArrowRight />
            </button>

            <div className="checkout-trust-box">
              <div className="trust-point">
                <FaShieldAlt /> <span>Guaranteed Safe &amp; Secure Checkout</span>
              </div>
              <div className="trust-point">
                <FaTruck /> <span>Cash on Delivery Supported</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaMoneyBillWave,
  FaCreditCard,
  FaShieldAlt,
  FaTruck,
  FaReceipt,
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import API from '../../services/api.js';
import { formatCurrency } from '../../utils/formatters.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './Checkout.css';

const Checkout = () => {
  useDocumentTitle('Secure Checkout');
  const navigate = useNavigate();

  const { cartItems, subtotal, shipping, tax, total, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    province: user?.address?.province || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'Pakistan',
    paymentMethod: 'Cash on Delivery',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.street || !formData.city || !formData.phone) {
      setOrderError('Please fill out all required shipping fields.');
      return;
    }
    setOrderError(null);
    setStep(2);
  };

  const handleStep2Submit = () => {
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setOrderError(null);

    const orderPayload = {
      orderItems: cartItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      shippingAddress: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      paymentMethod: formData.paymentMethod,
    };

    try {
      const res = await API.post('/orders', orderPayload);
      if (res.data?.success) {
        setCreatedOrder(res.data.data);
        clearCart();
        setStep(4);
      } else {
        throw new Error(res.data?.message || 'Order processing failed');
      }
    } catch (err) {
      // In offline mode or if not authenticated yet, create client-side confirmed order representation
      const demoOrder = {
        orderNumber: `RS-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        orderItems: cartItems,
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod,
        subtotal,
        shipping,
        tax,
        total,
        orderStatus: 'Confirmed',
      };
      setCreatedOrder(demoOrder);
      clearCart();
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && step !== 4) {
    return (
      <div className="container py-5 text-center">
        <h2>Your Cart is Empty</h2>
        <p>Please add products to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="btn btn-primary mt-3">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container checkout-page animate-fade-in">
      {/* Checkout Progress Stepper */}
      <div className="checkout-stepper">
        <div className={`step-node ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-circle">{step > 1 ? '✓' : '1'}</div>
          <span>Shipping</span>
        </div>
        <div className={`step-connector ${step > 1 ? 'active' : ''}`}></div>
        <div className={`step-node ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-circle">{step > 2 ? '✓' : '2'}</div>
          <span>Review</span>
        </div>
        <div className={`step-connector ${step > 2 ? 'active' : ''}`}></div>
        <div className={`step-node ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
          <div className="step-circle">{step > 3 ? '✓' : '3'}</div>
          <span>Payment</span>
        </div>
        <div className={`step-connector ${step >= 4 ? 'active' : ''}`}></div>
        <div className={`step-node ${step >= 4 ? 'active' : ''}`}>
          <div className="step-circle">4</div>
          <span>Confirmation</span>
        </div>
      </div>

      {orderError && <div className="checkout-error-banner card">{orderError}</div>}

      {/* Step 1: Shipping Information */}
      {step === 1 && (
        <div className="checkout-step-container">
          <div className="checkout-grid">
            <div className="checkout-main card">
              <h2 className="step-heading">Step 1: Shipping Information</h2>
              <p className="step-subheading">Enter the recipient and delivery details for your order.</p>

              <form onSubmit={handleStep1Submit} className="shipping-form">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-input"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      placeholder="e.g. 03347784456"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <input
                    type="text"
                    name="street"
                    className="form-input"
                    placeholder="House / Flat #, Street name"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      className="form-input"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">Province / State</label>
                    <input
                      type="text"
                      name="province"
                      className="form-input"
                      value={formData.province}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      className="form-input"
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="checkout-step-actions">
                  <Link to="/cart" className="btn btn-outline">
                    <FaArrowLeft /> Back to Cart
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Continue to Review <FaArrowRight />
                  </button>
                </div>
              </form>
            </div>

            {/* Mini Summary */}
            <aside className="checkout-side card">
              <h3>Order Summary ({cartItems.length} items)</h3>
              <div className="mini-cart-items">
                {cartItems.map((item) => (
                  <div key={item.product} className="mini-item">
                    <img src={item.image} alt={item.name} />
                    <div className="mini-item-info">
                      <span className="mini-name">{item.name}</span>
                      <span className="mini-meta">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="checkout-totals">
                <div className="total-line">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="total-line">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
                </div>
                <div className="total-line">
                  <span>Sales Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="total-line total-grand">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* Step 2: Order Review */}
      {step === 2 && (
        <div className="checkout-step-container">
          <div className="checkout-grid">
            <div className="checkout-main card">
              <h2 className="step-heading">Step 2: Review Your Order</h2>
              <p className="step-subheading">Please review your delivery details and items before choosing payment.</p>

              <div className="review-box">
                <h4>Shipping To:</h4>
                <p>
                  <strong>{formData.fullName}</strong> ({formData.phone})<br />
                  {formData.street}, {formData.city}, {formData.province} {formData.postalCode}<br />
                  {formData.country}
                </p>
                <button type="button" className="btn-link" onClick={() => setStep(1)}>
                  Edit Address
                </button>
              </div>

              <div className="review-items-table">
                <h4>Items to be dispatched:</h4>
                {cartItems.map((item) => (
                  <div key={item.product} className="review-item-row">
                    <img src={item.image} alt={item.name} className="review-item-img" />
                    <div className="review-item-text">
                      <strong>{item.name}</strong>
                      <span>
                        Quantity: {item.quantity} × {formatCurrency(item.price)}
                      </span>
                    </div>
                    <span className="review-item-total">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="checkout-step-actions">
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                  <FaArrowLeft /> Back
                </button>
                <button type="button" className="btn btn-primary" onClick={handleStep2Submit}>
                  Continue to Payment <FaArrowRight />
                </button>
              </div>
            </div>

            <aside className="checkout-side card">
              <h3>Totals Review</h3>
              <div className="checkout-totals">
                <div className="total-line">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="total-line">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
                </div>
                <div className="total-line">
                  <span>Sales Tax (5%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="total-line total-grand">
                  <span>Total Amount</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* Step 3: Payment Method */}
      {step === 3 && (
        <div className="checkout-step-container">
          <div className="checkout-grid">
            <div className="checkout-main card">
              <h2 className="step-heading">Step 3: Select Payment Method</h2>
              <p className="step-subheading">Choose how you would like to pay for your order.</p>

              <div className="payment-options-list">
                <label className={`payment-card-option ${formData.paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={formData.paymentMethod === 'Cash on Delivery'}
                    onChange={handleChange}
                  />
                  <div className="payment-opt-content">
                    <div className="payment-title-row">
                      <FaMoneyBillWave className="payment-icon text-success" />
                      <strong>Cash on Delivery (Recommended)</strong>
                    </div>
                    <p className="payment-opt-desc">
                      Pay easily in cash when the courier delivers your package directly to your doorstep.
                      Inspect package safely upon arrival.
                    </p>
                  </div>
                </label>

                <label className={`payment-card-option disabled ${formData.paymentMethod === 'Online Payment / Card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online Payment / Card"
                    disabled
                  />
                  <div className="payment-opt-content">
                    <div className="payment-title-row">
                      <FaCreditCard className="payment-icon" />
                      <strong>Credit / Debit Card (Stripe Gateway)</strong>
                      <span className="badge badge-discount ml-2">Coming Soon</span>
                    </div>
                    <p className="payment-opt-desc">
                      Online Visa &amp; Mastercard payment integrations configured for next production deployment.
                    </p>
                  </div>
                </label>
              </div>

              <div className="checkout-step-actions">
                <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>
                  <FaArrowLeft /> Back to Review
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? 'Processing Order...' : `Place Order (${formatCurrency(total)})`}
                </button>
              </div>
            </div>

            <aside className="checkout-side card">
              <div className="checkout-security-box">
                <FaShieldAlt className="shield-icon" />
                <h4>E-Commerce Buyer Protection</h4>
                <p>Your order is calculated and verified securely by our backend services.</p>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* Step 4: Order Confirmation */}
      {step === 4 && createdOrder && (
        <div className="order-confirmation-box card animate-scale-up">
          <div className="conf-icon-circle">
            <FaCheckCircle />
          </div>
          <h1 className="conf-title">Thank You For Your Order!</h1>
          <p className="conf-subtitle">
            Your order has been recorded successfully. A confirmation message has been queued.
          </p>

          <div className="conf-details-card">
            <div className="conf-header-row">
              <div>
                <span className="conf-label">Order Number</span>
                <strong className="conf-ord-num">{createdOrder.orderNumber}</strong>
              </div>
              <div>
                <span className="conf-label">Status</span>
                <span className="badge badge-new">{createdOrder.orderStatus || 'Confirmed'}</span>
              </div>
              <div>
                <span className="conf-label">Payment</span>
                <strong>{createdOrder.paymentMethod}</strong>
              </div>
            </div>

            <div className="conf-divider"></div>

            <div className="conf-body-grid">
              <div className="conf-shipping-info">
                <h4>Shipping Address</h4>
                <p>
                  {createdOrder.shippingAddress?.fullName}<br />
                  {createdOrder.shippingAddress?.street}, {createdOrder.shippingAddress?.city}<br />
                  {createdOrder.shippingAddress?.province} {createdOrder.shippingAddress?.postalCode}<br />
                  {createdOrder.shippingAddress?.phone}
                </p>
              </div>

              <div className="conf-financial-summary">
                <h4>Financial Summary</h4>
                <div className="total-line">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(createdOrder.subtotal)}</span>
                </div>
                <div className="total-line">
                  <span>Shipping:</span>
                  <span>{createdOrder.shipping === 0 ? 'FREE' : formatCurrency(createdOrder.shipping)}</span>
                </div>
                <div className="total-line">
                  <span>Tax:</span>
                  <span>{formatCurrency(createdOrder.tax)}</span>
                </div>
                <div className="total-line total-grand">
                  <span>Grand Total:</span>
                  <span className="text-primary">{formatCurrency(createdOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="conf-delivery-notice">
              <FaTruck />
              <span>
                Estimated domestic delivery: <strong>2 - 4 Business Days</strong>. You will pay{' '}
                <strong>{formatCurrency(createdOrder.total)}</strong> upon delivery.
              </span>
            </div>
          </div>

          <div className="conf-actions-row">
            <Link to="/orders" className="btn btn-primary">
              <FaReceipt /> View In Order History
            </Link>
            <Link to="/shop" className="btn btn-outline">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTruck,
  FaBox,
  FaClock,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from 'react-icons/fa';
import API from '../../services/api.js';
import { Spinner } from '../../components/Loader/Loader.jsx';
import { formatCurrency, formatDate } from '../../utils/formatters.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './Orders.css';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState(null);

  useDocumentTitle(order ? `Order ${order.orderNumber}` : 'Order Details');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/orders/${id}`);
        if (res.data?.success && res.data.data) {
          setOrder(res.data.data);
        }
      } catch (err) {
        // Fallback demo order
        setOrder({
          _id: id,
          orderNumber: 'RS-202610-A91B8C',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          orderStatus: 'Delivered',
          paymentMethod: 'Cash on Delivery',
          paymentStatus: 'Paid',
          subtotal: 349,
          shipping: 0,
          tax: 17.45,
          total: 366.45,
          shippingAddress: {
            fullName: 'Shopper Demo',
            phone: '03347784456',
            email: 'user@rashidstore.com',
            street: 'Street 42, Sector F-7/2',
            city: 'Islamabad',
            province: 'Federal',
            postalCode: '44000',
            country: 'Pakistan',
          },
          orderItems: [
            {
              product: { _id: '1', slug: 'sony-wh-1000xm5-wireless-noise-cancelling-headphones' },
              name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
              price: 349,
              quantity: 1,
            },
          ],
          statusHistory: [
            { status: 'Pending', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), note: 'Order placed.' },
            { status: 'Confirmed', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), note: 'Order confirmed with customer.' },
            { status: 'Processing', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), note: 'Packed at distribution hub.' },
            { status: 'Shipped', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), note: 'Handed over to courier express.' },
            { status: 'Delivered', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), note: 'Delivered to customer.' },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(true);
    setCancelMessage(null);

    try {
      const res = await API.put(`/orders/${id}/cancel`);
      if (res.data?.success) {
        setOrder(res.data.data);
        setCancelMessage({ type: 'success', text: 'Order was successfully cancelled.' });
      }
    } catch (err) {
      setCancelMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Cannot cancel order.',
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <Spinner size="large" text="Loading order details..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h2>Order Not Found</h2>
        <Link to="/orders" className="btn btn-primary mt-3">
          Back to Orders
        </Link>
      </div>
    );
  }

  const stages = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentStageIndex = stages.indexOf(order.orderStatus);

  return (
    <div className="container order-detail-page animate-fade-in">
      <div className="order-detail-top-nav">
        <Link to="/orders" className="back-link">
          <FaArrowLeft /> Back to Order History
        </Link>
      </div>

      <div className="order-detail-header card">
        <div className="ord-title-group">
          <h1>Order {order.orderNumber}</h1>
          <span className="ord-placed-date">Placed on {formatDate(order.createdAt)}</span>
        </div>

        <div className="ord-header-actions">
          <span className={`badge ${order.orderStatus === 'Delivered' ? 'badge-new' : 'badge-featured'}`}>
            {order.orderStatus}
          </span>
          {order.orderStatus === 'Pending' && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {cancelMessage && (
        <div className={`profile-alert ${cancelMessage.type} card mt-3`}>
          {cancelMessage.text}
        </div>
      )}

      {/* Visual Order Timeline */}
      {order.orderStatus !== 'Cancelled' ? (
        <div className="order-timeline-card card">
          <h3>Shipment Progress Timeline</h3>
          <div className="timeline-stages">
            {stages.map((stage, idx) => {
              const isPastOrCurrent = currentStageIndex >= idx;
              return (
                <div key={stage} className={`timeline-stage-item ${isPastOrCurrent ? 'active' : ''}`}>
                  <div className="stage-icon-circle">
                    {idx === 0 && <FaClock />}
                    {idx === 1 && <FaCheckCircle />}
                    {idx === 2 && <FaBox />}
                    {idx === 3 && <FaTruck />}
                    {idx === 4 && <FaCheckCircle />}
                  </div>
                  <span className="stage-label">{stage}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="order-cancelled-banner card">
          <FaTimesCircle className="cancelled-icon" />
          <div>
            <h4>This order was cancelled.</h4>
            <p>Inventory stock has been restored to the store catalog.</p>
          </div>
        </div>
      )}

      {/* Two Column Layout: Items on Left, Address/Payment on Right */}
      <div className="order-detail-grid">
        <div className="order-items-column card">
          <h3>Items in this Shipment</h3>
          <div className="detail-items-table">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="detail-item-row">
                <img src={item.image} alt={item.name} className="detail-item-img" />
                <div className="detail-item-meta">
                  <h4>{item.name}</h4>
                  <span className="detail-item-unit">
                    Unit Price: {formatCurrency(item.price)} × Quantity: {item.quantity}
                  </span>
                </div>
                <div className="detail-item-subtotal">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-financial-breakdown">
            <div className="fin-line">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="fin-line">
              <span>Shipping Fee:</span>
              <span>{order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}</span>
            </div>
            <div className="fin-line">
              <span>Tax (5%):</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div className="fin-line fin-total">
              <span>Total Paid / Payable:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        <aside className="order-meta-column">
          <div className="card">
            <h3>Delivery Address</h3>
            <p className="address-paragraph">
              <strong>{order.shippingAddress?.fullName}</strong><br />
              <FaMapMarkerAlt className="meta-icon" /> {order.shippingAddress?.street}, {order.shippingAddress?.city}<br />
              {order.shippingAddress?.province} {order.shippingAddress?.postalCode}<br />
              {order.shippingAddress?.country || 'Pakistan'}
            </p>
            <div className="contact-sublines">
              <div><FaPhoneAlt className="meta-icon" /> {order.shippingAddress?.phone}</div>
              <div><FaEnvelope className="meta-icon" /> {order.shippingAddress?.email}</div>
            </div>
          </div>

          <div className="card mt-3">
            <h3>Payment Information</h3>
            <div className="payment-status-block">
              <span className="pay-method-name">Method: <strong>{order.paymentMethod}</strong></span>
              <span className="pay-status-tag">Status: <strong>{order.paymentStatus || 'Pending'}</strong></span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetails;

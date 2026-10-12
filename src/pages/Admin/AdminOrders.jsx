import { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaCheck } from 'react-icons/fa';
import Modal from '../../components/Modal/Modal.jsx';
import { Spinner } from '../../components/Loader/Loader.jsx';
import API from '../../services/api.js';
import { formatCurrency, formatDate } from '../../utils/formatters.js';
import './Admin.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectOrder, setInspectOrder] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);

      const res = await API.get(`/admin/orders?${params.toString()}`);
      if (res.data?.success && res.data.data) {
        setOrders(res.data.data);
      }
    } catch (err) {
      // Fallback demo orders
      setOrders([
        {
          _id: 'ord-1',
          orderNumber: 'RS-202610-A91B8C',
          user: { name: 'Muhammad Rashid', email: 'admin@rashidstore.com' },
          shippingAddress: { fullName: 'Shopper Demo', phone: '03347784456', city: 'Islamabad' },
          createdAt: new Date().toISOString(),
          orderStatus: 'Delivered',
          paymentStatus: 'Paid',
          paymentMethod: 'Cash on Delivery',
          total: 366.45,
          orderItems: [{ name: 'Sony WH-1000XM5', price: 349, quantity: 1 }],
        },
        {
          _id: 'ord-2',
          orderNumber: 'RS-202610-C73E4D',
          user: { name: 'Customer User', email: 'user@rashidstore.com' },
          shippingAddress: { fullName: 'Customer User', phone: '03001234567', city: 'Rawalpindi' },
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          orderStatus: 'Processing',
          paymentStatus: 'Pending',
          paymentMethod: 'Cash on Delivery',
          total: 268.8,
          orderItems: [{ name: 'Nike Air Max 270', price: 128, quantity: 2 }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await API.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.data?.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        setAlertMsg({ type: 'success', text: `Order updated to ${newStatus}.` });
        setTimeout(() => setAlertMsg(null), 3000);
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to update order status.' });
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      const res = await API.put(`/admin/orders/${orderId}/status`, { paymentStatus: newPaymentStatus });
      if (res.data?.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o))
        );
        setAlertMsg({ type: 'success', text: `Payment status updated to ${newPaymentStatus}.` });
        setTimeout(() => setAlertMsg(null), 3000);
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to update payment status.' });
    }
  };

  return (
    <div className="admin-orders-view animate-fade-in">
      <div className="admin-actions-bar flex-between mb-4 flex-wrap gap-3">
        <div className="admin-search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by order #, customer name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
            style={{ paddingLeft: '2.5rem', width: '320px' }}
          />
        </div>

        <div className="status-filter-pills flex gap-2">
          {['all', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(
            (st) => (
              <button
                key={st}
                type="button"
                className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setStatusFilter(st)}
              >
                {st === 'all' ? 'All Orders' : st}
              </button>
            )
          )}
        </div>
      </div>

      {alertMsg && (
        <div className={`profile-alert ${alertMsg.type} card mb-4`}>
          {alertMsg.text}
        </div>
      )}

      {loading ? (
        <Spinner size="medium" text="Loading customer orders..." />
      ) : (
        <div className="admin-table-wrapper card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord._id}>
                  <td>
                    <strong>{ord.orderNumber}</strong>
                  </td>
                  <td>
                    <div>
                      <strong>{ord.shippingAddress?.fullName || ord.user?.name}</strong>
                      <span className="text-muted block" style={{ fontSize: '0.75rem' }}>
                        {ord.shippingAddress?.city} • {ord.shippingAddress?.phone}
                      </span>
                    </div>
                  </td>
                  <td>{formatDate(ord.createdAt)}</td>
                  <td>
                    <strong>{formatCurrency(ord.total)}</strong>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', width: 'auto' }}
                      value={ord.paymentStatus || 'Pending'}
                      onChange={(e) => handlePaymentStatusChange(ord._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', width: 'auto' }}
                      value={ord.orderStatus}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="table-action-icon-btn"
                      onClick={() => setInspectOrder(ord)}
                      title="Inspect Order Details"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inspect Order Modal */}
      <Modal
        isOpen={Boolean(inspectOrder)}
        onClose={() => setInspectOrder(null)}
        title={`Order Details: ${inspectOrder?.orderNumber}`}
        maxWidth="640px"
      >
        {inspectOrder && (
          <div className="admin-order-inspector">
            <div className="inspector-summary-grid mb-3">
              <div>
                <span className="text-muted block font-semibold text-xs">Customer Name:</span>
                <strong>{inspectOrder.shippingAddress?.fullName}</strong>
              </div>
              <div>
                <span className="text-muted block font-semibold text-xs">Contact Phone:</span>
                <span>{inspectOrder.shippingAddress?.phone}</span>
              </div>
              <div>
                <span className="text-muted block font-semibold text-xs">Delivery Address:</span>
                <span>
                  {inspectOrder.shippingAddress?.street}, {inspectOrder.shippingAddress?.city}
                </span>
              </div>
              <div>
                <span className="text-muted block font-semibold text-xs">Payment Method:</span>
                <span>{inspectOrder.paymentMethod}</span>
              </div>
            </div>

            <h4>Order Items:</h4>
            <div className="inspector-items-list mb-3">
              {inspectOrder.orderItems?.map((it, idx) => (
                <div key={idx} className="flex-between py-2 border-b">
                  <span>
                    {it.name} (x{it.quantity})
                  </span>
                  <strong>{formatCurrency(it.price * it.quantity)}</strong>
                </div>
              ))}
            </div>

            <div className="flex-between pt-2">
              <span className="font-bold">Total Recorded:</span>
              <strong className="text-xl text-primary">{formatCurrency(inspectOrder.total)}</strong>
            </div>

            <div className="checkout-step-actions mt-4">
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => setInspectOrder(null)}
              >
                Close Inspector
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;

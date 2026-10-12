import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './Policies.css';

const ShippingPolicy = () => {
  useDocumentTitle('Shipping Policy');

  return (
    <div className="container policy-page animate-fade-in">
      <div className="policy-card card">
        <header className="policy-header">
          <span className="policy-badge">FULFILLMENT</span>
          <h1 className="policy-title">Shipping &amp; Delivery Policy</h1>
          <span className="policy-updated">Last Updated: October 2026</span>
        </header>

        <div className="policy-body">
          <h2>1. Processing Times</h2>
          <p>
            Orders are reviewed and prepared at our fulfillment center within 24 hours of placement on business days.
          </p>

          <h2>2. Shipping Rates &amp; Free Delivery</h2>
          <ul>
            <li>Orders over <strong>$75</strong> automatically qualify for <strong>Free Express Shipping</strong>.</li>
            <li>Standard flat-rate shipping for orders under $75 is <strong>$10.00</strong>.</li>
          </ul>

          <h2>3. Estimated Delivery Timelines</h2>
          <p>
            Domestic deliveries typically arrive within <strong>2 to 4 business days</strong>. Remote territories may require up to 6 business days.
          </p>

          <h2>4. Tracking &amp; Inquiries</h2>
          <p>
            Customers can monitor delivery progress in real time via their <a href="/orders">Order History</a> or inquire via WhatsApp at 03347784456.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;

import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './Policies.css';

const ReturnPolicy = () => {
  useDocumentTitle('Return & Refund Policy');

  return (
    <div className="container policy-page animate-fade-in">
      <div className="policy-card card">
        <header className="policy-header">
          <span className="policy-badge">CUSTOMER SATISFACTION</span>
          <h1 className="policy-title">Return &amp; Refund Policy</h1>
          <span className="policy-updated">Last Updated: October 2026</span>
        </header>

        <div className="policy-body">
          <h2>1. 30-Day Hassle-Free Returns</h2>
          <p>
            At E-Commerce, customer satisfaction is our top priority. If you are not satisfied with your purchase,
            you may initiate a return within <strong>30 days</strong> of receiving your package.
          </p>

          <h2>2. Eligibility Criteria</h2>
          <ul>
            <li>Items must be unused, in the same pristine condition as received.</li>
            <li>Original packaging, manufacturer seals, and all enclosed accessories must be included.</li>
            <li>Personal care products with broken hygienic seals are non-returnable.</li>
          </ul>

          <h2>3. Initiating a Return</h2>
          <p>
            To initiate a return or exchange, message our customer support team directly on WhatsApp at{' '}
            <strong>03347784456</strong> or email <a href="mailto:rashidwazir093@gmail.com">rashidwazir093@gmail.com</a>{' '}
            with your order number.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;

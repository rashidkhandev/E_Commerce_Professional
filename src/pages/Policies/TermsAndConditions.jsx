import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './Policies.css';

const TermsAndConditions = () => {
  useDocumentTitle('Terms & Conditions');

  return (
    <div className="container policy-page animate-fade-in">
      <div className="policy-card card">
        <header className="policy-header">
          <span className="policy-badge">STORE AGREEMENT</span>
          <h1 className="policy-title">Terms &amp; Conditions</h1>
          <span className="policy-updated">Last Updated: October 2026</span>
        </header>

        <div className="policy-disclaimer">
          <strong>Notice:</strong> This terms agreement governs standard usage of the E-Commerce platform and commercial showcase.
        </div>

        <div className="policy-body">
          <h2>1. Platform Usage</h2>
          <p>
            By accessing or purchasing from E-Commerce, you agree to comply with these terms. The platform
            is designed for customers to browse verified products and manage retail purchases securely.
          </p>

          <h2>2. Pricing &amp; Order Accuracy</h2>
          <p>
            Product prices are displayed in USD. All item totals, taxes, and shipping rates are verified and
            recalculated authoritatively on the server during checkout to ensure accuracy.
          </p>

          <h2>3. Payment &amp; Cash on Delivery</h2>
          <p>
            For Cash on Delivery (COD) orders, customers are expected to provide exact payment upon delivery
            handoff by the courier partner.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            Platform architecture, custom CSS stylesheets, and design implementations are authored by
            Muhammad Rashid (MERN Stack Developer).
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;

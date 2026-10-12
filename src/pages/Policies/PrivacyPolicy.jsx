import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './Policies.css';

const PrivacyPolicy = () => {
  useDocumentTitle('Privacy Policy');

  return (
    <div className="container policy-page animate-fade-in">
      <div className="policy-card card">
        <header className="policy-header">
          <span className="policy-badge">LEGAL &amp; COMPLIANCE</span>
          <h1 className="policy-title">Privacy Policy</h1>
          <span className="policy-updated">Last Updated: October 2026</span>
        </header>

        <div className="policy-disclaimer">
          <strong>Notice:</strong> This privacy document serves as an editable template for E-Commerce.
          It does not constitute formal legal counsel and can be tailored by the store owner for specific local jurisdictions.
        </div>

        <div className="policy-body">
          <p>
            Welcome to <strong>E-Commerce</strong>. We respect your privacy and are committed to protecting
            the personal data you share with us. This policy describes how your information is gathered, utilized,
            and shielded across our platform.
          </p>

          <h2>1. Information We Collect</h2>
          <p>When you register, place an order, or browse our store, we may collect:</p>
          <ul>
            <li>Personal Identifiers: Full name, email address, contact telephone number.</li>
            <li>Shipping Details: Street address, city, postal code, and country.</li>
            <li>Order Records: Items purchased, order amounts, and payment method selection.</li>
            <li>Technical Data: Browser type, session cookies, and IP address for security.</li>
          </ul>

          <h2>2. How We Use Your Data</h2>
          <p>The information we collect is utilized exclusively for:</p>
          <ul>
            <li>Processing and fulfilling your purchases and courier delivery.</li>
            <li>Verifying authentication sessions and guarding against fraudulent activity.</li>
            <li>Providing order notifications, customer care, and WhatsApp assistance.</li>
            <li>Improving store navigation, catalog responsiveness, and user experience.</li>
          </ul>

          <h2>3. Data Protection &amp; Security</h2>
          <p>
            Passwords are encrypted using industry-standard bcrypt hashing algorithms and are never stored in readable text.
            Authentication sessions leverage secure HTTP-only cookies and cryptographic JWT signatures.
          </p>

          <h2>4. Contact Us</h2>
          <p>
            For privacy inquiries, data modification requests, or account removal, contact Muhammad Rashid at{' '}
            <a href="mailto:rashidwazir093@gmail.com">rashidwazir093@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

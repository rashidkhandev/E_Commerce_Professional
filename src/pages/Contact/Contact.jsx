import { useState } from 'react';
import {
  FaEnvelope,
  FaWhatsapp,
  FaPhoneAlt,
  FaGithub,
  FaLinkedin,
  FaPaperPlane,
  FaInfoCircle,
} from 'react-icons/fa';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './Contact.css';

const Contact = () => {
  useDocumentTitle('Contact & Customer Support');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const getDirectWhatsAppUrl = () => {
    const text = `Hello Muhammad Rashid!
Inquiry from E-Commerce:
Name: ${formData.name || 'Guest'}
Subject: ${formData.subject || 'Store Question'}
Message: ${formData.message || 'I have an inquiry regarding your platform.'}`;
    return `https://wa.me/923347784456?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="container contact-page animate-fade-in">
      <div className="contact-header">
        <span className="contact-badge">GET IN TOUCH</span>
        <h1 className="contact-title">Contact &amp; Customer Support</h1>
        <p className="contact-subtitle">
          Have inquiries about an order, custom development, or store features? Reach out directly.
        </p>
      </div>

      <div className="contact-layout">
        {/* Left: Contact Information Cards */}
        <aside className="contact-info-column">
          <div className="contact-card card">
            <h3>Developer &amp; Support Contact</h3>
            <p className="contact-lead-desc">
              Direct communication channels for E-Commerce. Managed by Muhammad Rashid.
            </p>

            <div className="contact-methods-list">
              <a href="mailto:rashidwazir093@gmail.com" className="method-item">
                <div className="method-icon-box">
                  <FaEnvelope />
                </div>
                <div>
                  <span className="method-label">Official Email</span>
                  <strong className="method-val">rashidwazir093@gmail.com</strong>
                </div>
              </a>

              <a
                href="https://wa.me/923347784456"
                target="_blank"
                rel="noopener noreferrer"
                className="method-item whatsapp-method"
              >
                <div className="method-icon-box whatsapp">
                  <FaWhatsapp />
                </div>
                <div>
                  <span className="method-label">Direct WhatsApp</span>
                  <strong className="method-val">03347784456 (+92 334 7784456)</strong>
                </div>
              </a>

              <div className="method-item">
                <div className="method-icon-box">
                  <FaPhoneAlt />
                </div>
                <div>
                  <span className="method-label">Phone Hotline</span>
                  <strong className="method-val">+92 334 7784456</strong>
                </div>
              </div>
            </div>

            <div className="contact-social-section">
              <h4>Developer Profiles</h4>
              <div className="contact-social-links">
                <a
                  href="https://github.com/rashidkhandevlink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-profile-pill"
                >
                  <FaGithub /> GitHub: rashidkhandevlink
                </a>
                <a
                  href="https://www.linkedin.com/in/rashid-wazir-272a06420/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-profile-pill"
                >
                  <FaLinkedin /> LinkedIn: Rashid Wazir
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Right: Contact Form */}
        <main className="contact-form-column card">
          <h2>Send a Message</h2>
          <p className="form-helper-text">
            Fill out the form below. You can also send the drafted inquiry directly to WhatsApp.
          </p>

          {!formSubmitted ? (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Muhammad Rashid"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label className="form-label">Your Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Order inquiry, feature feedback, or question"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message Details *</label>
                <textarea
                  className="form-textarea"
                  rows="5"
                  placeholder="How can we assist you today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="contact-actions-row">
                <button type="submit" className="btn btn-primary btn-lg">
                  <FaPaperPlane /> Prepare Inquiry
                </button>

                <a
                  href={getDirectWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-lg"
                >
                  <FaWhatsapp /> Send via WhatsApp
                </a>
              </div>
            </form>
          ) : (
            <div className="contact-success-box animate-fade-in">
              <div className="success-icon-box">✓</div>
              <h3>Message Formatted Successfully</h3>
              <p>
                To deliver your message immediately to Muhammad Rashid without third-party email delay,
                you can launch your email client or WhatsApp below:
              </p>

              <div className="direct-deliver-buttons">
                <a
                  href={`mailto:rashidwazir093@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`}
                  className="btn btn-primary"
                >
                  <FaEnvelope /> Open in Email App
                </a>

                <a
                  href={getDirectWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <FaWhatsapp /> Send to WhatsApp (+92 334 7784456)
                </a>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setFormSubmitted(false)}
                >
                  Write Another Message
                </button>
              </div>
            </div>
          )}

          <div className="email-transparency-note">
            <FaInfoCircle />
            <span>
              Transparency notice: Because external SMTP credentials (such as SendGrid or AWS SES) are configured
              via environment variables in production, this form allows instant direct dispatch to WhatsApp and email.
            </span>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Contact;

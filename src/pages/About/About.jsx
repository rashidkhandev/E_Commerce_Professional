import { Link } from 'react-router-dom';
import {
  FaGithub,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
  FaCode,
  FaDatabase,
  FaServer,
  FaLayerGroup,
  FaShieldAlt,
} from 'react-icons/fa';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './About.css';

const About = () => {
  useDocumentTitle('About Store & Lead Developer');

  return (
    <div className="container about-page animate-fade-in">
      <div className="about-hero">
        <span className="about-badge">E-COMMERCE PLATFORM</span>
        <h1 className="about-headline">Engineered for Modern Commerce</h1>
        <p className="about-subheading">
          E-Commerce is a modern platform designed to provide customers with a simple,
          reliable and enjoyable online shopping experience.
        </p>
      </div>

      {/* Developer Spotlight Card */}
      <div className="developer-spotlight card">
        <div className="developer-avatar-wrapper">
          <div className="dev-initials-avatar">MR</div>
        </div>

        <div className="developer-info-text">
          <span className="dev-kicker">ARCHITECT &amp; LEAD DEVELOPER</span>
          <h2>Muhammad Rashid</h2>
          <p className="dev-role-label">Full Stack MERN Developer • Software Architect</p>
          <p className="dev-bio-text">
            Specializing in building scalable, production-grade web applications utilizing React.js,
            Node.js, Express.js, and MongoDB. This platform showcases end-to-end commercial e-commerce
            architecture, including tamper-proof order calculation, responsive custom CSS styling,
            role-based access control, and intuitive UI/UX design.
          </p>

          <div className="dev-social-strip">
            <a
              href="https://github.com/rashidkhandevlink"
              target="_blank"
              rel="noopener noreferrer"
              className="dev-link-btn"
            >
              <FaGithub /> GitHub: rashidkhandevlink
            </a>
            <a
              href="https://www.linkedin.com/in/rashid-wazir-272a06420/"
              target="_blank"
              rel="noopener noreferrer"
              className="dev-link-btn"
            >
              <FaLinkedin /> LinkedIn: Rashid Wazir
            </a>
            <a
              href="https://wa.me/923347784456"
              target="_blank"
              rel="noopener noreferrer"
              className="dev-link-btn whatsapp"
            >
              <FaWhatsapp /> WhatsApp: 03347784456
            </a>
            <a href="mailto:rashidwazir093@gmail.com" className="dev-link-btn">
              <FaEnvelope /> rashidwazir093@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <section className="tech-stack-section">
        <div className="section-header text-center-header">
          <span className="section-eyebrow">ENGINEERING FOUNDATION</span>
          <h2 className="section-title">Technical Architecture &amp; Stack</h2>
        </div>

        <div className="tech-grid">
          <div className="tech-card card">
            <div className="tech-icon-box">
              <FaCode />
            </div>
            <h3>Modern React Frontend</h3>
            <p>
              Built with Vite, React 19, Context API state management, debounced search, custom CSS design
              system with variables, and responsive layout without heavy utility frameworks.
            </p>
          </div>

          <div className="tech-card card">
            <div className="tech-icon-box">
              <FaServer />
            </div>
            <h3>Robust Express API</h3>
            <p>
              RESTful architecture with modular routers, controllers, validation middleware, rate limiting,
              Helmet security headers, and centralized error handling.
            </p>
          </div>

          <div className="tech-card card">
            <div className="tech-icon-box">
              <FaDatabase />
            </div>
            <h3>Mongoose &amp; MongoDB</h3>
            <p>
              Indexed document schemas for Users, Products, Categories, Orders, and Reviews with auto-calculated
              ratings, unique SKU constraints, and transaction safety.
            </p>
          </div>

          <div className="tech-card card">
            <div className="tech-icon-box">
              <FaShieldAlt />
            </div>
            <h3>Security &amp; Auth</h3>
            <p>
              Bcryptjs password hashing, JSON Web Tokens with HTTP-only cookies, role-based protection
              for customer and administrator routes, and server-side price recalculation.
            </p>
          </div>
        </div>
      </section>

      <div className="about-cta-card card">
        <h2>Experience E-Commerce Today</h2>
        <p>Browse our catalog, test cart operations, and explore the admin control dashboard.</p>
        <div className="flex-center gap-3 mt-3">
          <Link to="/shop" className="btn btn-primary btn-lg">
            Shop Catalog
          </Link>
          <Link to="/contact" className="btn btn-outline btn-lg">
            Contact Developer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;

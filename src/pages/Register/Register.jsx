import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhoneAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import '../Login/Login.css';

const Register = () => {
  useDocumentTitle('Create Account');
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword } = formData;

    if (!name || !email || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await register(name, email, password, phone);
    setLoading(false);

    if (res.success) {
      navigate('/shop');
    } else {
      setErrorMsg(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="container auth-page animate-fade-in">
      <div className="auth-card card" style={{ maxWidth: '480px' }}>
        <div className="auth-header">
          <div className="auth-logo-badge">E</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join E-Commerce for a seamless shopping experience</p>
        </div>

        {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div className="auth-input-wrapper">
              <FaUser className="auth-input-icon" />
              <input
                type="text"
                name="name"
                className="form-input auth-input"
                placeholder="Muhammad Rashid"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div className="auth-input-wrapper">
              <FaEnvelope className="auth-input-icon" />
              <input
                type="email"
                name="email"
                className="form-input auth-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="auth-input-wrapper">
              <FaPhoneAlt className="auth-input-icon" />
              <input
                type="tel"
                name="phone"
                className="form-input auth-input"
                placeholder="e.g. 03347784456"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password * (min 6 characters)</label>
            <div className="auth-input-wrapper">
              <FaLock className="auth-input-icon" />
              <input
                type="password"
                name="password"
                className="form-input auth-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <div className="auth-input-wrapper">
              <FaLock className="auth-input-icon" />
              <input
                type="password"
                name="confirmPassword"
                className="form-input auth-input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg mt-3" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

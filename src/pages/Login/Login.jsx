import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaLock, FaEnvelope, FaShieldAlt, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './Login.css';

const Login = () => {
  useDocumentTitle('Sign In');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setErrorMsg(res.message || 'Invalid credentials.');
    }
  };

  // Quick fill demo buttons
  const fillAdmin = () => {
    setEmail('admin@rashidstore.com');
    setPassword('Admin@123456');
    setErrorMsg('');
  };

  const fillCustomer = () => {
    setEmail('user@rashidstore.com');
    setPassword('User@123456');
    setErrorMsg('');
  };

  return (
    <div className="container auth-page animate-fade-in">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="auth-logo-badge">E</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your E-Commerce account</p>
        </div>

        {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="auth-input-wrapper">
              <FaEnvelope className="auth-input-icon" />
              <input
                type="email"
                className="form-input auth-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="flex-between">
              <label className="form-label">Password</label>
            </div>
            <div className="auth-input-wrapper">
              <FaLock className="auth-input-icon" />
              <input
                type="password"
                className="form-input auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg mt-3" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Fast-Fill Box */}
        <div className="demo-credentials-box">
          <span className="demo-box-label">Quick Demo Access</span>
          <div className="demo-btns-row">
            <button type="button" className="btn btn-outline btn-sm flex-1" onClick={fillAdmin}>
              <FaShieldAlt /> Demo Admin
            </button>
            <button type="button" className="btn btn-outline btn-sm flex-1" onClick={fillCustomer}>
              <FaUser /> Demo Customer
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Don&rsquo;t have an account? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

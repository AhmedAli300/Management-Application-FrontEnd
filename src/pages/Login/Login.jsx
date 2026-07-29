import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password.');
      return;
    }

    const result = await login(email.trim(), password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="container py-5 min-vh-80 d-flex align-items-center justify-content-center">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
          <div className="card shadow-lg border-0 rounded-4 animate-scale-in">
            <div className="card-body p-4 p-sm-5">
              <div className="text-center mb-4">
                <div className="brand-logo bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-2">
                  <i className="bi bi-kanban-fill fs-3"></i>
                </div>
                <h4 className="fw-bold text-dark mb-1">Welcome Back</h4>
                <p className="text-muted small">Log in to manage your projects & tasks</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label fw-semibold small">
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      autoComplete="email"
                      className="form-control bg-light border-start-0"
                      id="loginEmail"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="loginPassword" className="form-label fw-semibold small">
                    Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className="form-control bg-light border-start-0 border-end-0"
                      id="loginPassword"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-light border border-start-0 text-muted"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-semibold mb-3 shadow-sm hover-scale"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    'Log In'
                  )}
                </button>

                <div className="text-center text-muted small">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                    Register here
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

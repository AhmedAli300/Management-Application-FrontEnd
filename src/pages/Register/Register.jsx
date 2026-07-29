import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('member');

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error('All fields are required.');
      return;
    }

    if (password.length < 4) {
      toast.error('Password must be at least 4 characters long.');
      return;
    }

    const result = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      role
    });

    if (result.success) {
      toast.success('Account created successfully! Please log in.');
      navigate('/login');
    } else {
      toast.error(result.message || 'Registration failed.');
    }
  };

  return (
    <div className="container py-5 min-vh-80 d-flex align-items-center justify-content-center">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
          <div className="card shadow-lg border-0 rounded-4 animate-scale-in">
            <div className="card-body p-4 p-sm-5">
              <div className="text-center mb-4">
                <div className="brand-logo bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-2">
                  <i className="bi bi-person-plus-fill fs-3"></i>
                </div>
                <h4 className="fw-bold text-dark mb-1">Create an Account</h4>
                <p className="text-muted small">Join TeamTask to manage your team projects</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="regName" className="form-label fw-semibold small">
                    Full Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-person text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control bg-light border-start-0"
                      id="regName"
                      placeholder="Ahmed Ali"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="regEmail" className="form-label fw-semibold small">
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
                      id="regEmail"
                      placeholder="user1234@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="regPassword" className="form-label fw-semibold small">
                    Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="form-control bg-light border-start-0 border-end-0"
                      id="regPassword"
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

                <div className="mb-4">
                  <label className="form-label fw-semibold small">Account Role</label>
                  <div className="d-flex gap-3">
                    <div className="form-check flex-grow-1 border rounded p-2 px-3 bg-light">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="userRole"
                        id="roleMember"
                        value="member"
                        checked={role === 'member'}
                        onChange={(e) => setRole(e.target.value)}
                      />
                      <label className="form-check-input-label fw-medium small" htmlFor="roleMember">
                        Member
                      </label>
                    </div>

                    <div className="form-check flex-grow-1 border rounded p-2 px-3 bg-light">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="userRole"
                        id="roleAdmin"
                        value="admin"
                        checked={role === 'admin'}
                        onChange={(e) => setRole(e.target.value)}
                      />
                      <label className="form-check-input-label fw-medium small" htmlFor="roleAdmin">
                        Admin
                      </label>
                    </div>
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
                      Registering...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <div className="text-center text-muted small">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                    Log in here
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

export default Register;

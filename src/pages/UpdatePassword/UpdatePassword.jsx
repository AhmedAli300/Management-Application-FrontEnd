import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import './UpdatePassword.css';

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { updatePassword, loading } = useAuth();
  const navigate = useNavigate();

  // Calculate password strength indicator
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-secondary' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-danger' };
    if (score <= 4) return { score, label: 'Medium', color: 'bg-warning' };
    return { score, label: 'Strong', color: 'bg-success' };
  };

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error('Please enter your current password.');
      return;
    }

    if (!newPassword) {
      toast.error('Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      toast.error('New password must be different from your current password.');
      return;
    }

    const result = await updatePassword(currentPassword, newPassword);

    if (result.success) {
      toast.success(result.message || 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      toast.error(result.message || 'Failed to update password.');
    }
  };

  return (
    <div className="container py-5 min-vh-80 d-flex align-items-center justify-content-center">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
          <div className="card shadow-lg border-0 rounded-4 animate-update-card">
            <div className="card-body p-4 p-sm-5">
              <div className="text-center mb-4">
                <div className="brand-icon-wrapper rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                  <i className="bi bi-shield-lock-fill fs-3"></i>
                </div>
                <h4 className="fw-bold text-dark mb-1">Update Password</h4>
                <p className="text-muted small mb-0">Ensure your account remains secure with a strong password</p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Current Password */}
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label fw-semibold small">
                    Current Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-key text-muted"></i>
                    </span>
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      autoComplete="current-password"
                      className="form-control bg-light border-start-0 border-end-0"
                      id="currentPassword"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-light border border-start-0 text-muted"
                      onClick={() => setShowCurrent(!showCurrent)}
                      title={showCurrent ? 'Hide Password' : 'Show Password'}
                    >
                      <i className={`bi ${showCurrent ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label fw-semibold small">
                    New Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type={showNew ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="form-control bg-light border-start-0 border-end-0"
                      id="newPassword"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-light border border-start-0 text-muted"
                      onClick={() => setShowNew(!showNew)}
                      title={showNew ? 'Hide Password' : 'Show Password'}
                    >
                      <i className={`bi ${showNew ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>

                  {/* Password strength bar */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small text-muted">Strength:</span>
                        <span className={`badge ${strength.color} text-capitalize`}>{strength.label}</span>
                      </div>
                      <div className="progress password-strength-bar" style={{ height: '5px' }}>
                        <div
                          className={`progress-bar ${strength.color}`}
                          role="progressbar"
                          style={{ width: `${(strength.score / 5) * 100}%` }}
                          aria-valuenow={(strength.score / 5) * 100}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label fw-semibold small">
                    Confirm New Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-check2-circle text-muted"></i>
                    </span>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="form-control bg-light border-start-0 border-end-0"
                      id="confirmPassword"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-light border border-start-0 text-muted"
                      onClick={() => setShowConfirm(!showConfirm)}
                      title={showConfirm ? 'Hide Password' : 'Show Password'}
                    >
                      <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <small className="text-danger mt-1 d-block">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      Passwords do not match
                    </small>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-semibold mb-3 shadow-sm hover-scale d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-right-circle-fill"></i> Update Password
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;

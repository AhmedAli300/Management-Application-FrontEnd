import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm custom-navbar">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
          <i className="bi bi-kanban-fill text-primary fs-4"></i>
          <span>TeamTask</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center gap-1" to="/dashboard">
                    <i className="bi bi-grid-fill"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center gap-1" to="/update-password">
                    <i className="bi bi-shield-lock-fill text-info"></i> Update Password
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="user-profile d-flex align-items-center gap-2 text-light">
                  <div className="avatar text-white rounded-circle d-flex align-items-center justify-content-center fw-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="d-none d-sm-block text-start lh-1">
                    <span className="fw-semibold d-block text-truncate max-w-150">{user?.name || user?.email}</span>
                    <small className="badge bg-secondary text-uppercase">{user?.role || 'member'}</small>
                  </div>
                </div>

                <button
                  className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 hover-scale"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm px-3">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm px-3">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

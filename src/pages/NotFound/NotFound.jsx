import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="container py-5 min-vh-80 d-flex align-items-center justify-content-center text-center">
      <div className="card border-0 shadow-sm p-5 rounded-4 animate-scale-in max-w-500">
        <h1 className="display-1 fw-bold text-primary mb-2">404</h1>
        <h4 className="fw-bold text-dark mb-2">Page Not Found</h4>
        <p className="text-muted small mb-4">
          The page you are looking for might have been removed, renamed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary px-4 fw-semibold shadow-sm hover-scale">
          <i className="bi bi-house-door me-2"></i> Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

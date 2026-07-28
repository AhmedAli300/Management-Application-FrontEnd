import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5 min-vh-25">
      <div className="spinner-border text-primary custom-spinner" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted fw-semibold small animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;

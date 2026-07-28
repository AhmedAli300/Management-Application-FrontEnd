import './ConfirmModal.css';

const ConfirmModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop-custom" onClick={handleBackdropClick}>
      <div className="modal-dialog-custom modal-dialog-centered modal-sm w-100 px-3">
        <div className="card shadow-lg border-0 rounded-4 animate-scale-in">
          <div className="card-body p-4 text-center">
            <div className={`icon-circle bg-${variant}-subtle text-${variant} rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}>
              <i className="bi bi-exclamation-triangle-fill fs-3"></i>
            </div>

            <h5 className="fw-bold text-dark mb-2">{title}</h5>
            <p className="text-muted small mb-4">{message}</p>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-light flex-grow-1 fw-semibold"
                onClick={() => typeof onClose === 'function' && onClose()}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className={`btn btn-${variant} flex-grow-1 fw-semibold shadow-sm`}
                onClick={() => {
                  if (typeof onConfirm === 'function') onConfirm();
                  if (typeof onClose === 'function') onClose();
                }}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

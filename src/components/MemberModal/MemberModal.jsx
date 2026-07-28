import { useState } from 'react';
import { toast } from 'react-hot-toast';
import './MemberModal.css';

const MemberModal = ({ isOpen, project, onClose, onAddMember, onRemoveMember }) => {
  const [email, setEmail] = useState('');

  if (!isOpen || !project) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Member email is required');
      return;
    }
    onAddMember(project._id, email.trim());
    setEmail('');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop-custom d-flex align-items-center justify-content-center" onClick={handleBackdropClick}>
      <div className="modal-dialog-custom modal-dialog-centered modal-md w-100">
        <div className="card shadow-lg border-0 rounded-4 animate-scale-in w-100">
          <div className="card-header bg-dark text-white d-flex align-items-center justify-content-between  rounded-top-4">
            <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-people-fill text-primary"></i> Project Members
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="card-body p-4">
            <h6 className="fw-semibold text-secondary mb-3">Add New Member</h6>
            <form onSubmit={handleAdd} className="mb-4">
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="enter.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="btn btn-primary px-3 fw-semibold">
                  <i className="bi bi-person-plus-fill me-1"></i> Add
                </button>
              </div>
            </form>

            <hr />

            <h6 className="fw-semibold text-secondary mb-3">Current Members ({project.members?.length || 0})</h6>
            <div className="member-list max-h-200 overflow-auto border rounded p-2">
              {project.members && project.members.length > 0 ? (
                project.members.map((member) => (
                  <div
                    key={member._id || member}
                    className="d-flex align-items-center justify-content-between p-2 border-bottom last-border-0"
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div className="avatar-sm bg-secondary-subtle text-secondary rounded-circle d-flex align-items-center justify-content-center fw-bold small">
                        {member.name ? member.name.charAt(0).toUpperCase() : 'M'}
                      </div>
                      <div>
                        <div className="fw-semibold small">{member.name || member.email || 'Member'}</div>
                        <div className="text-muted extra-small">{member.email}</div>
                      </div>
                    </div>

                    <button
                      className="btn btn-outline-danger btn-sm p-1 px-2"
                      title="Remove Member"
                      onClick={() => onRemoveMember(project._id, member._id || member)}
                    >
                      <i className="bi bi-person-x"></i>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted small py-3 mb-0">No members added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberModal;

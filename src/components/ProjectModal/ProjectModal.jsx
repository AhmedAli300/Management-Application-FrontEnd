import { useState } from 'react';
import { toast } from 'react-hot-toast';
import './ProjectModal.css';

const ProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Project name is required');
      return;
    }
    onSubmit({ name: name.trim(), description: description.trim() });
    setName('');
    setDescription('');
    onClose();
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
          <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between rounded-top-4">
            <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-folder-plus"></i> Create New Project
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit} className="card-body">
            <div className="mb-3">
              <label htmlFor="projectName" className="form-label fw-semibold">
                Project Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="projectName"
                placeholder="e.g. Website Redesign"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label htmlFor="projectDescription" className="form-label fw-semibold">
                Description
              </label>
              <textarea
                className="form-control"
                id="projectDescription"
                rows="3"
                placeholder="Brief summary of the project goal..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="d-flex align-items-center justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-4 fw-semibold shadow-sm hover-scale">
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

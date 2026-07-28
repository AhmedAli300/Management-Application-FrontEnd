import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import './TaskModal.css';

const TaskModal = ({ isOpen, taskToEdit, members = [], onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status || 'To Do');
      setPriority(taskToEdit.priority || 'Medium');
      setDueDate(taskToEdit.dueDate ? taskToEdit.dueDate.split('T')[0] : '');
      setAssignee(taskToEdit.assignee?._id || taskToEdit.assignee || '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('To Do');
      setPriority('Medium');
      setDueDate('');
      setAssignee('');
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || null,
      assignee: assignee || null
    });
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop-custom d-flex align-items-center justify-content-center" onClick={handleBackdropClick}>
      <div className="modal-dialog-custom modal-dialog-centered modal-lg w-100 px-3">
        <div className="card shadow-lg border-0 rounded-4 animate-scale-in">
          <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between py-3 px-4 rounded-top-4">
            <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-file-earmark-plus"></i> {taskToEdit ? 'Edit Task' : 'Create New Task'}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit} className="card-body p-4">
            <div className="mb-3">
              <label htmlFor="taskTitle" className="form-label fw-semibold">
                Task Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="taskTitle"
                placeholder="e.g. Implement login API"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="mb-3">
              <label htmlFor="taskDesc" className="form-label fw-semibold">
                Description
              </label>
              <textarea
                className="form-control"
                id="taskDesc"
                rows="3"
                placeholder="Detailed instructions or context..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">Status</label>
                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">Priority</label>
                <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Assignee</label>
              <select className="form-select" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member._id || member} value={member._id || member}>
                    {member.name || member.email || 'Member'} ({member.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex align-items-center justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-4 fw-semibold shadow-sm hover-scale">
                {taskToEdit ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;

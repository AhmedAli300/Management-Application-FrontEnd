import './TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-danger text-white';
      case 'Medium':
        return 'bg-warning text-dark';
      case 'Low':
        return 'bg-info text-dark';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <div className="card shadow-sm border-0 mb-3 task-card rounded-3 animate-fade-in">
      <div className="card-body p-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className={`badge ${getPriorityBadgeClass(task.priority)} fw-medium rounded-pill px-2 py-1`}>
            {task.priority || 'Medium'}
          </span>

          <div className="dropdown">
            <button
              className="btn btn-link text-muted p-0 border-0 dropdown-toggle-no-caret"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-three-dots-vertical"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
              <li>
                <button className="dropdown-item small" onClick={() => onEdit(task)}>
                  <i className="bi bi-pencil me-2 text-primary"></i> Edit Task
                </button>
              </li>
              <li>
                <button className="dropdown-item small text-danger" onClick={() => onDelete(task._id)}>
                  <i className="bi bi-trash me-2"></i> Delete Task
                </button>
              </li>
            </ul>
          </div>
        </div>

        <h6 className="fw-bold text-dark mb-1">{task.title}</h6>
        {task.description && <p className="text-muted small mb-3 task-desc">{task.description}</p>}

        <div className="d-flex align-items-center justify-content-between border-top pt-2 mt-2 extra-small text-secondary">
          <div className="d-flex align-items-center gap-1" title={task.assignee?.email || 'Unassigned'}>
            <i className="bi bi-person-circle"></i>
            <span className="text-truncate max-w-100">{task.assignee?.name || task.assignee?.email || 'Unassigned'}</span>
          </div>

          {task.dueDate && (
            <div className="d-flex align-items-center gap-1" title="Due Date">
              <i className="bi bi-clock"></i>
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="mt-2 pt-2 border-top d-flex gap-1">
          {task.status !== 'To Do' && (
            <button
              className="btn btn-outline-secondary btn-xs flex-grow-1"
              onClick={() => onStatusChange(task._id, 'To Do')}
            >
              &larr; To Do
            </button>
          )}
          {task.status !== 'In Progress' && (
            <button
              className="btn btn-outline-primary btn-xs flex-grow-1"
              onClick={() => onStatusChange(task._id, 'In Progress')}
            >
              In Progress
            </button>
          )}
          {task.status !== 'Done' && (
            <button
              className="btn btn-outline-success btn-xs flex-grow-1"
              onClick={() => onStatusChange(task._id, 'Done')}
            >
              Done &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

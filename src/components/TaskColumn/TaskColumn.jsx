import TaskCard from '../TaskCard/TaskCard';
import './TaskColumn.css';

const TaskColumn = ({ title, status, tasks, onEditTask, onDeleteTask, onStatusChange }) => {
  const getHeaderColor = (statusName) => {
    switch (statusName) {
      case 'To Do':
        return 'border-warning text-warning-emphasis bg-warning-subtle';
      case 'In Progress':
        return 'border-primary text-primary-emphasis bg-primary-subtle';
      case 'Done':
        return 'border-success text-success-emphasis bg-success-subtle';
      default:
        return 'border-secondary text-secondary-emphasis bg-secondary-subtle';
    }
  };

  const getIcon = (statusName) => {
    switch (statusName) {
      case 'To Do':
        return 'bi-list-task';
      case 'In Progress':
        return 'bi-hourglass-split';
      case 'Done':
        return 'bi-check2-circle';
      default:
        return 'bi-columns';
    }
  };

  return (
    <div className="col-12 col-lg-4 mb-4">
      <div className="card border-0 shadow-sm rounded-4 h-100 column-card bg-light-subtle">
        <div className={`card-header border-start border-4 py-3 px-3 rounded-top-4 d-flex align-items-center justify-content-between ${getHeaderColor(status)}`}>
          <div className="d-flex align-items-center gap-2 fw-bold">
            <i className={`bi ${getIcon(status)} fs-5`}></i>
            <span>{title}</span>
          </div>
          <span className="badge bg-white text-dark shadow-sm rounded-circle px-2 py-1 fs-6">
            {tasks.length}
          </span>
        </div>

        <div className="card-body p-3 column-body overflow-auto">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStatusChange={onStatusChange}
              />
            ))
          ) : (
            <div className="text-center py-5 text-muted empty-state">
              <i className={`bi ${getIcon(status)} fs-1 opacity-25 d-block mb-2`}></i>
              <p className="small mb-0">No tasks in {title}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskColumn;

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProjectCard.css';

const ProjectCard = ({ project, onDelete, onManageMembers }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isCreator =
    project.creator?._id === user?.id ||
    project.creator === user?.id ||
    project.creator?.id === user?.id;
  const isAdmin = user?.role === 'admin';
  const canManage = isCreator || isAdmin;

  const handleCardClick = () => {
    navigate(`/project/${project._id}`);
  };

  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm border-0 project-card position-relative">
        <div className="card-body d-flex flex-column p-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1 rounded">
              <i className="bi bi-folder-fill me-1"></i> Project
            </span>

            {canManage ? (
              <span className="badge bg-success-subtle text-success fw-medium">
                <i className="bi bi-shield-check me-1"></i> Owner
              </span>
            ) : (
              <span className="badge bg-info-subtle text-info fw-medium">
                <i className="bi bi-person-fill me-1"></i> Member
              </span>
            )}
          </div>

          <h5 className="card-title fw-bold text-dark text-truncate mb-2" title={project.name}>
            {project.name}
          </h5>

          <p className="card-text text-muted small flex-grow-1 line-clamp-3">
            {project.description || 'No description provided.'}
          </p>

          <div className="border-top pt-3 mt-3 d-flex align-items-center justify-content-between text-muted extra-small">
            <span>
              <i className="bi bi-people me-1"></i>
              {(project.members?.length || 0) + 1} Members
            </span>
            <span>
              <i className="bi bi-calendar3 me-1"></i>
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="d-flex align-items-center justify-content-between gap-2 mt-3">
            <button
              className="btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              onClick={handleCardClick}
            >
              <i className="bi bi-kanban"></i> Open Board
            </button>

            {canManage && (
              <>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  title="Manage Members"
                  onClick={() => onManageMembers(project)}
                >
                  <i className="bi bi-person-plus-fill"></i>
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  title="Delete Project"
                  onClick={() => onDelete(project._id)}
                >
                  <i className="bi bi-trash-fill"></i>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

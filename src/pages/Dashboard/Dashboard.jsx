import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { projectService } from '../../services/projectService';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import ProjectModal from '../../components/ProjectModal/ProjectModal';
import MemberModal from '../../components/MemberModal/MemberModal';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const { socket } = useSocket();
  const { user } = useAuth();

  const fetchProjects = async (searchQuery = '') => {
    try {
      setLoading(true);
      const res = await projectService.getProjects(searchQuery);
      setProjects(res.data || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || 'Failed to fetch projects.');
    }
  };

  useEffect(() => {
    fetchProjects(search);
  }, [search]);

  // Real-Time Socket.IO Listener for Projects
  useEffect(() => {
    if (socket) {
      const handleProjectCreated = (newProject) => {
        const isCreator = newProject.creator?._id === user?.id || newProject.creator === user?.id;
        const isMember = newProject.members?.some((m) => (m._id || m) === user?.id);
        const isAdmin = user?.role === 'admin';

        if (isCreator || isMember || isAdmin) {
          setProjects((prev) => [newProject, ...prev.filter((p) => p._id !== newProject._id)]);
          if (!isCreator) {
            toast.success(`You were added to project "${newProject.name}"!`);
          }
        }
      };

      const handleProjectUpdated = (updatedProject) => {
        const isCreator = updatedProject.creator?._id === user?.id || updatedProject.creator === user?.id;
        const isMember = updatedProject.members?.some((m) => (m._id || m) === user?.id);
        const isAdmin = user?.role === 'admin';

        if (isCreator || isMember || isAdmin) {
          setProjects((prev) =>
            prev.some((p) => p._id === updatedProject._id)
              ? prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
              : [updatedProject, ...prev]
          );
        } else {
          setProjects((prev) => prev.filter((p) => p._id !== updatedProject._id));
        }

        if (selectedProject && selectedProject._id === updatedProject._id) {
          setSelectedProject(updatedProject);
        }
      };

      const handleProjectDeleted = (deletedId) => {
        setProjects((prev) => prev.filter((p) => p._id !== deletedId));
        if (selectedProject && selectedProject._id === deletedId) {
          setIsMemberModalOpen(false);
          setSelectedProject(null);
        }
      };

      socket.on('project:created', handleProjectCreated);
      socket.on('project:updated', handleProjectUpdated);
      socket.on('project:deleted', handleProjectDeleted);

      return () => {
        socket.off('project:created', handleProjectCreated);
        socket.off('project:updated', handleProjectUpdated);
        socket.off('project:deleted', handleProjectDeleted);
      };
    }
  }, [socket, user, selectedProject]);

  const handleCreateProject = async (projectData) => {
    try {
      await projectService.createProject(projectData);
      toast.success('Project created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project.');
    }
  };

  const promptDeleteProject = (projectId) => {
    setProjectToDelete(projectId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await projectService.deleteProject(projectToDelete);
      toast.success('Project and associated tasks deleted.');
      setProjectToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project.');
    }
  };

  const handleOpenMemberModal = (project) => {
    setSelectedProject(project);
    setIsMemberModalOpen(true);
  };

  const handleAddMember = async (projectId, email) => {
    try {
      const res = await projectService.addMember(projectId, email);
      toast.success('Member added successfully!');
      setSelectedProject(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member.');
    }
  };

  const handleRemoveMember = async (projectId, userId) => {
    try {
      const res = await projectService.removeMember(projectId, userId);
      toast.success('Member removed.');
      setSelectedProject(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member.');
    }
  };

  return (
    <div className="container py-4 min-vh-80">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 p-4 bg-dark text-white rounded-4 shadow-sm dashboard-banner">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-grid-1x2-fill text-primary"></i> Project Dashboard
          </h3>
          <p className="text-light text-opacity-75 small mb-0">
            Organize tasks, assign team members, and track real-time progress.
          </p>
        </div>

        <button
          className="btn btn-primary px-4 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 hover-scale shadow-sm"
          onClick={() => setIsProjectModalOpen(true)}
        >
          <i className="bi bi-plus-lg"></i> Create Project
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-12 col-md-6 col-lg-4 ms-auto">
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search projects by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching your projects..." />
      ) : projects.length > 0 ? (
        <div className="row g-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={promptDeleteProject}
              onManageMembers={handleOpenMemberModal}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-5 bg-light rounded-4 shadow-sm border">
          <i className="bi bi-folder-x fs-1 text-muted d-block mb-3 opacity-50"></i>
          <h5 className="fw-bold text-dark">No projects found</h5>
          <p className="text-muted small mb-3">
            {search ? 'Try adjusting your search query.' : 'Click below to create your first team project.'}
          </p>
          {!search && (
            <button className="btn btn-primary btn-sm px-3 fw-semibold" onClick={() => setIsProjectModalOpen(true)}>
              <i className="bi bi-plus-lg me-1"></i> Create Project
            </button>
          )}
        </div>
      )}

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      <MemberModal
        isOpen={isMemberModalOpen}
        project={selectedProject}
        onClose={() => setIsMemberModalOpen(false)}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Project"
        message="Are you sure you want to delete this project? All associated tasks will be permanently removed."
        confirmText="Delete Project"
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Dashboard;

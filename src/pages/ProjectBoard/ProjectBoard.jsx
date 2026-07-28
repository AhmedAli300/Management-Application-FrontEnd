import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import { useSocket } from '../../context/SocketContext';
import TaskColumn from '../../components/TaskColumn/TaskColumn';
import TaskModal from '../../components/TaskModal/TaskModal';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './ProjectBoard.css';

const ProjectBoard = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Confirm Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const { socket, joinProject, leaveProject } = useSocket();

  // Fetch Project details & Tasks
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [projRes, taskRes] = await Promise.all([
        projectService.getProjectById(projectId),
        taskService.getTasks(projectId)
      ]);
      setProject(projRes.data);
      setTasks(taskRes.data || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || 'Failed to load project details.');
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Socket.IO Real-Time Integration
  useEffect(() => {
    if (projectId) {
      joinProject(projectId);
    }

    if (socket) {
      const handleTaskCreated = (newTask) => {
        setTasks((prevTasks) => [newTask, ...prevTasks.filter((t) => t._id !== newTask._id)]);
        toast.success(`New task added: "${newTask.title}"`);
      };

      const handleTaskUpdated = (updatedTask) => {
        setTasks((prevTasks) => prevTasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
      };

      const handleTaskDeleted = (deletedTaskId) => {
        setTasks((prevTasks) => prevTasks.filter((t) => t._id !== deletedTaskId));
      };

      socket.on('task:created', handleTaskCreated);
      socket.on('task:updated', handleTaskUpdated);
      socket.on('task:deleted', handleTaskDeleted);

      return () => {
        socket.off('task:created', handleTaskCreated);
        socket.off('task:updated', handleTaskUpdated);
        socket.off('task:deleted', handleTaskDeleted);
        leaveProject(projectId);
      };
    }
  }, [socket, projectId]);

  // Memoized task filters for optimal re-render performance
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
      const matchesSearch = searchFilter
        ? task.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchFilter.toLowerCase()))
        : true;
      return matchesPriority && matchesSearch;
    });
  }, [tasks, priorityFilter, searchFilter]);

  const todoTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'To Do'), [filteredTasks]);
  const inProgressTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'In Progress'), [filteredTasks]);
  const doneTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'Done'), [filteredTasks]);

  // Task Handlers
  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskFormData) => {
    try {
      if (taskToEdit) {
        await taskService.updateTask(taskToEdit._id, taskFormData);
        toast.success('Task updated successfully.');
      } else {
        await taskService.createTask({
          ...taskFormData,
          project: projectId
        });
        toast.success('Task created successfully.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task.');
    }
  };

  const promptDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await taskService.deleteTask(taskToDelete);
      toast.success('Task deleted.');
      setTaskToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task.');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      toast.success(`Task moved to ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading task board..." />;
  }

  // Combine creator + members for task assignee dropdown
  const allMembers = [];
  if (project?.creator) {
    allMembers.push(project.creator);
  }
  if (project?.members && Array.isArray(project.members)) {
    project.members.forEach((m) => {
      if (!allMembers.some((existing) => (existing._id || existing) === (m._id || m))) {
        allMembers.push(m);
      }
    });
  }

  return (
    <div className="container-fluid px-3 px-md-4 py-4 min-vh-80">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 p-3 bg-white rounded-4 shadow-sm border">
        <div>
          <button className="btn btn-link text-decoration-none text-muted p-0 small mb-1" onClick={() => navigate('/dashboard')}>
            &larr; Back to Dashboard
          </button>
          <h3 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
            <i className="bi bi-kanban-fill text-primary"></i> {project?.name}
          </h3>
          <p className="text-muted small mb-0">{project?.description || 'No description provided.'}</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-success-subtle text-success border border-success border-opacity-25 px-2 py-1 small rounded-pill d-flex align-items-center gap-1">
            <span className="live-dot"></span> Keep Your Projects on Track
          </span>
          <button className="btn btn-primary px-3 fw-semibold d-flex align-items-center gap-1 hover-scale" onClick={handleOpenCreateModal}>
            <i className="bi bi-plus-lg"></i> Add Task
          </button>
        </div>
      </div>
      
      <div className="row g-3 mb-4 align-items-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="input-group input-group-sm shadow-sm">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search tasks..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3 ms-auto">
          <select
            className="form-select form-select-sm shadow-sm"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      <div className="row g-4">
        <TaskColumn
          title="To Do"
          status="To Do"
          tasks={todoTasks}
          onEditTask={handleOpenEditModal}
          onDeleteTask={promptDeleteTask}
          onStatusChange={handleStatusChange}
        />

        <TaskColumn
          title="In Progress"
          status="In Progress"
          tasks={inProgressTasks}
          onEditTask={handleOpenEditModal}
          onDeleteTask={promptDeleteTask}
          onStatusChange={handleStatusChange}
        />

        <TaskColumn
          title="Done"
          status="Done"
          tasks={doneTasks}
          onEditTask={handleOpenEditModal}
          onDeleteTask={promptDeleteTask}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        taskToEdit={taskToEdit}
        members={allMembers}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleSaveTask}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        confirmText="Delete Task"
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDeleteTask}
      />
    </div>
  );
};

export default ProjectBoard;

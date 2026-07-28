import api from './api';

export const projectService = {
  // Fetch user projects with optional search query
  getProjects: async (search = '') => {
    const response = await api.get('/projects', {
      params: { search }
    });
    return response.data;
  },

  // Get project details by ID
  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Create new project
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  // Update project name/description
  updateProject: async (id, projectData) => {
    const response = await api.patch(`/projects/${id}`, projectData);
    return response.data;
  },

  // Delete project
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Add member to project by email
  addMember: async (projectId, email) => {
    const response = await api.post(`/projects/${projectId}/members`, { email });
    return response.data;
  },

  // Remove member from project by user ID
  removeMember: async (projectId, userId) => {
    const response = await api.delete(`/projects/${projectId}/members`, {
      data: { userId }
    });
    return response.data;
  }
};

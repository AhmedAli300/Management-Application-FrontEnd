import api from './api';

export const taskService = {
  getTasks: async (projectId, filters = {}) => {
    const params = { project: projectId, ...filters };
    const response = await api.get('/tasks', { params });
    return response.data;
  },


  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },


  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },


  updateTask: async (id, taskData) => {
    const response = await api.patch(`/tasks/${id}`, taskData);
    return response.data;
  },


  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

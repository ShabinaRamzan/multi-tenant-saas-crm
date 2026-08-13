import axiosInstance from './axios';

export const fetchTasks = () => axiosInstance.get('/api/v1/tasks/');
export const createTask = (data) => axiosInstance.post('/api/v1/tasks/', data);
export const updateTask = (id, data) => axiosInstance.put(`/api/v1/tasks/${id}`, data);
export const deleteTask = (id) => axiosInstance.delete(`/api/v1/tasks/${id}`);
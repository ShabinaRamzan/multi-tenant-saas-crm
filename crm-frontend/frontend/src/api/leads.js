import axiosInstance from './axios';

export const fetchLeads = () => axiosInstance.get('/api/v1/leads/');
export const createLead = (data) => axiosInstance.post('/api/v1/leads/', data);
export const updateLead = (id, data) => axiosInstance.put(`/api/v1/leads/${id}`, data);
export const deleteLead = (id) => axiosInstance.delete(`/api/v1/leads/${id}`);
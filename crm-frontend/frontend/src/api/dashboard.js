import axiosInstance from './axios';

export const fetchDashboardStats = () => axiosInstance.get('/api/v1/dashboard/stats');
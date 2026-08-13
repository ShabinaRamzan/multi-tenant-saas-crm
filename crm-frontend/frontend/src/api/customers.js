import axiosInstance from './axios';

export const fetchCustomers = () => axiosInstance.get('/api/v1/customers/');
export const createCustomer = (data) => axiosInstance.post('/api/v1/customers/', data);
export const updateCustomer = (id, data) => axiosInstance.put(`/api/v1/customers/${id}`, data);
export const deleteCustomer = (id) => axiosInstance.delete(`/api/v1/customers/${id}`);
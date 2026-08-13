import axiosInstance from './axios';

export const registerUser = (payload) => axiosInstance.post('/api/v1/auth/register', payload);
export const loginUser = ({ email, password }) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    return axiosInstance.post('/api/v1/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
};

export const getCurrentUser = () => axiosInstance.get('/api/v1/users/me');
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../api/auth';
import axiosInstance from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axiosInstance.get('/api/v1/users/me');
        setUser(response.data);
      } catch (error) {
        console.error(error);
        setToken(null);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [token]);

  const login = async ({ email, password }) => {
    try {
      const response = await loginUser({ email, password });
      const accessToken = response.data.access_token;
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error) {
      const message = error?.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const value = useMemo(() => ({ token, user, loading, login, logout, setUser }), [token, user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

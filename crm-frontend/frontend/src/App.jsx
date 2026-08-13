import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import LeadsPage from './pages/LeadsPage';
import TasksPage from './pages/TasksPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
          <Route path="/leads" element={<ProtectedRoute><LeadsPage /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-soft">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-700"></div>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

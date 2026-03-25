import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-theme-bg">
        <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminRequired && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

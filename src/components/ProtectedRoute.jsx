import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { token, isAdmin } = useAuth();
  if (!token || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function InstructorRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInstructor = useAuthStore((s) => s.isInstructor);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isInstructor()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

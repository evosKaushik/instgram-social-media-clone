import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuth.store";

const ProtectedRoute = ({ children, isPublic = false }) => {
  const authUser = useAuthStore((s) => s.authUser);

  
  if (!isPublic && !authUser) {
    return <Navigate to="/login" replace />;
  }

  
  if (isPublic && authUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
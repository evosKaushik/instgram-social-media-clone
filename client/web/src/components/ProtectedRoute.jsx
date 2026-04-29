import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuth.store";

const ProtectedRoute = ({ children }) => {
  const authUser = useAuthStore((s) => s.authUser);

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

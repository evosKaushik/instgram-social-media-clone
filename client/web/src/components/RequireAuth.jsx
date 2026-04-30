import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuth.store";

export const RequireAuth = ({ children }) => {
  const authUser = useAuthStore((s) => s.authUser);

  console.log(authUser);
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

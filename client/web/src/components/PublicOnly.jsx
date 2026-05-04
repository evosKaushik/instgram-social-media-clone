import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuth.store";


export const PublicOnly = ({ children }) => {
  const authUser = useAuthStore((s) => s.authUser);



  if (authUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

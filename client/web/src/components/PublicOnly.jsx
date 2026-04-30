import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuth.store";
import { useEffect } from "react";

export const PublicOnly = ({ children }) => {
  const authUser = useAuthStore((s) => s.authUser);

  const checkAuth = useAuthStore((s) => s.checkAuth);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (authUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

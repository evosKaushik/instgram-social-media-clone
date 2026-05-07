import { useEffect } from "react";
import { useAuthStore } from "../store/useAuth.store";

export const useAuthInit = () => {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const isCheckingAuth = useAuthStore((s) => s.isCheckingAuth);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { isCheckingAuth };
};

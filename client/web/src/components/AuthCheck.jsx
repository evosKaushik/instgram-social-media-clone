import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuth.store";

const AuthCheck = ({ children, requireAuth = true }) => {
  const authUser = useAuthStore((s) => s.authUser);

  // If requires auth but user is not logged in, go to login
  if (requireAuth && !authUser) {
    return <Navigate to="/login" replace />;
  }

  // If does not require auth (e.g. login/signup) but user is logged in, go home
  if (!requireAuth && authUser) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default AuthCheck;

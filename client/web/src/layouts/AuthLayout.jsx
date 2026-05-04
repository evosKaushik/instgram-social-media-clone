import { Suspense, useEffect } from "react";
import Loader from "../components/Loader";
import { useAuthStore } from "../store/useAuth.store";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  const isCheckingAuth = useAuthStore((s) => s.isCheckingAuth);

  const checkAuth = useAuthStore((s) => s.checkAuth);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <Loader />;
  }
  return (
    <Suspense fallback={<Loader />}>
      <main className="grow overflow-y-hidden h-screen w-full md:pl-18 lg:pl-61 pb-12.5 md:pb-0  relative transition">
        <Outlet />
      </main>
    </Suspense>
  );
};

export default AuthLayout;

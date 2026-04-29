import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { useAuthStore } from "./store/useAuth.store";
import { useEffect } from "react";
import Loader from "./components/Loader";
import { Suspense } from "react";

const Layout = () => {
  const isCheckingAuth = useAuthStore((s) => s.isCheckingAuth);

  const checkAuth = useAuthStore((s) => s.checkAuth);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <Loader />;
  }
  return (
    // <main className="min-h-screen w-full">
    <Suspense fallback={<Loader />}>
      <main className="grow overflow-y-hidden h-screen w-full md:pl-18 lg:pl-61 pb-12.5 md:pb-0  relative transition">
        <Sidebar />
        <Outlet />
      </main>
    </Suspense>
  );
};

export default Layout;

import { Outlet } from "react-router-dom";
import { useAuthInit } from "../hooks/useAuthInit";
import Loader from "../components/Loader";
import { Suspense } from "react";

const RootLayout = () => {
  const { isCheckingAuth } = useAuthInit();

  if (isCheckingAuth) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Outlet />
    </Suspense>
  );
};

export default RootLayout;

import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="grow overflow-y-hidden h-screen w-full md:pl-18 lg:pl-61 pb-12.5 md:pb-0  relative transition">
      <Outlet />
    </main>
  );
};

export default AuthLayout;

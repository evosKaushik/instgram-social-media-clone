import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <main className="grow overflow-y-hidden h-screen w-full md:pl-18 lg:pl-61 pb-12.5 md:pb-0  relative transition">
      <Sidebar />
      <Outlet />
    </main>
  );
};

export default MainLayout;

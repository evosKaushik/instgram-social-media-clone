import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuthStore } from "../store/useAuth.store";
import { lazy, useState, Suspense } from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import Search from "./tabs/Search";
import Notifications from "./tabs/Notifications";

const SidebarModal = lazy(() => import("./SidebarModal.jsx"));

export default function Sidebar({ toggleCreate }) {
  const authUser = useAuthStore((s) => s.authUser);

  // 🔥 ONLY ONE STATE
  const [activeModal, setActiveModal] = useState(null);

  return (
    <>
      {/* MOBILE TOP */}
      <div className="md:hidden flex justify-between items-center px-4 py-2 border-b bg-white dark:bg-black sticky top-0 z-[60]">
        <span className="flex items-center gap-1 font-bold text-lg">
          {authUser?.username}
          <BsPatchCheckFill className="text-blue-500" size={16} />
        </span>

        <div className="flex space-x-4">
          <button onClick={() => setActiveModal("notifications")}>
            <i className="fa-regular fa-heart text-2xl"></i>
          </button>

          <NavLink to="/messages">
            <i className="fa-brands fa-facebook-messenger text-2xl"></i>
          </NavLink>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-[72px] lg:w-[244px] h-full border-r py-6 px-3 fixed left-0 top-0 bg-white dark:bg-black z-[60]">

        {/* LOGO */}
        <div className="mb-8 hidden lg:block px-4">
          <Link to="/" className="text-2xl font-serif">
            Instagram
          </Link>
        </div>

        <nav className="flex flex-col gap-1 flex-grow">

          {/* HOME */}
          <NavLink to="/" className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg">
            <i className="fa-solid fa-house text-[22px]" />
            <span className="hidden lg:block">Home</span>
          </NavLink>

          {/* SEARCH */}
          <button
            onClick={() => setActiveModal("search")}
            className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg"
          >
            <i className="fa-solid fa-magnifying-glass text-[22px]" />
            <span className="hidden lg:block">Search</span>
          </button>

          {/* EXPLORE */}
          <NavLink to="/explore" className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg">
            <i className="fa-regular fa-compass text-[22px]" />
            <span className="hidden lg:block">Explore</span>
          </NavLink>

          {/* REELS */}
          <NavLink to="/reels" className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg">
            <i className="fa-solid fa-clapperboard text-[22px]" />
            <span className="hidden lg:block">Reels</span>
          </NavLink>

          {/* MESSAGES */}
          <NavLink to="/messages" className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg">
            <i className="fa-brands fa-facebook-messenger text-[22px]" />
            <span className="hidden lg:block">Messages</span>
          </NavLink>

          {/* NOTIFICATIONS */}
          <button
            onClick={() => setActiveModal("notifications")}
            className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg"
          >
            <i className="fa-regular fa-heart text-[22px]" />
            <span className="hidden lg:block">Notifications</span>
          </button>

          {/* CREATE */}
          <button
            onClick={toggleCreate}
            className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg"
          >
            <i className="fa-regular fa-square-plus text-[22px]" />
            <span className="hidden lg:block">Create</span>
          </button>

          {/* PROFILE */}
          <NavLink
            to={`/${authUser?.username}`}
            className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg"
          >
            <img
              src={authUser?.avatar || "default-avatar.jpeg"}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="hidden lg:block">Profile</span>
          </NavLink>
        </nav>

        {/* FOOTER */}
        <div className="mt-auto">
          <NavLink to="/settings" className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg">
            <i className="fa-solid fa-gear text-[22px]" />
            <span className="hidden lg:block">Settings</span>
          </NavLink>

          <ThemeToggle />
        </div>
      </aside>

      {/* 🔥 SINGLE MODAL SYSTEM */}
      <Suspense fallback={null}>
        <SidebarModal
          key={activeModal}
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
        >
          {activeModal === "search" && (
            <Search close={() => setActiveModal(null)} />
          )}

          {activeModal === "notifications" && (
            <Notifications close={() => setActiveModal(null)} />
          )}
        </SidebarModal>
      </Suspense>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden flex justify-around items-center h-[50px] border-t bg-white dark:bg-black fixed bottom-0 w-full z-[60]">
        <NavLink to="/">
          <i className="fa-solid fa-house text-2xl"></i>
        </NavLink>

        <button onClick={() => setActiveModal("search")}>
          <i className="fa-solid fa-magnifying-glass text-2xl"></i>
        </button>

        <NavLink to="/reels">
          <i className="fa-solid fa-clapperboard text-2xl"></i>
        </NavLink>

        <button onClick={toggleCreate}>
          <i className="fa-regular fa-square-plus text-2xl"></i>
        </button>

        <NavLink to={`/${authUser?.username}`}>
          <img
            src={authUser?.avatar || "default-avatar.jpeg"}
            className="w-6 h-6 rounded-full border"
          />
        </NavLink>
      </nav>
    </>
  );
}
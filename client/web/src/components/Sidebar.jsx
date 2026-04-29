import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuthStore } from "../store/useAuth.store";

export default function Sidebar({ toggleSearch, toggleNotif, toggleCreate }) {
  const {avatar} = useAuthStore((s) => s.authUser);

  return (
    <>
      {/* Mobile Top Navigation */}
      <div className="md:hidden flex justify-between items-center px-4 py-2 border-b border-gray-300 dark:border-gray-800 bg-white dark:bg-black sticky top-0 z-[60]">
        <div className="text-2xl font-serif mt-1">Instagram</div>
        <div className="flex space-x-4">
          <div className="relative cursor-pointer" onClick={toggleNotif}>
            <i className="fa-regular fa-heart text-2xl"></i>
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <NavLink to="/messages" className="relative cursor-pointer">
            <i className="fa-brands fa-facebook-messenger text-2xl"></i>
          </NavLink>
        </div>
      </div>

      {/* Desktop Sidebar menu */}
      <aside className="hidden md:flex flex-col w-[72px] lg:w-[244px] h-full border-r border-gray-200 dark:border-gray-800 py-6 px-3 fixed left-0 top-0 bg-white dark:bg-black z-[60] transition-all duration-300">
        <div className="mb-8 px-2 lg:px-4 hidden lg:block pb-2 cursor-pointer">
          <Link to="/" className="text-2xl font-serif mt-2">
            Instagram
          </Link>
        </div>
        <div className="mb-4 px-3 lg:hidden flex justify-center hover:bg-gray-100 dark:hover:bg-gray-900 p-3 rounded-lg cursor-pointer transition-colors w-fit mx-auto group">
          <Link to="/">
            <i className="fa-brands fa-instagram text-2xl group-hover:scale-105 transition-transform"></i>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 flex-grow overflow-y-auto no-scrollbar">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg group transition-colors w-fit lg:w-full ${isActive ? "font-bold" : ""}`
            }
          >
            <i className="fa-solid fa-house text-[22px] group-hover:scale-105 transition-transform"></i>
            <span className="hidden lg:block text-[15px]">Home</span>
          </NavLink>
          <a
            href="#"
            onClick={toggleSearch}
            className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg group transition-colors w-fit lg:w-full"
          >
            <i className="fa-solid fa-magnifying-glass text-[22px] group-hover:scale-105 transition-transform"></i>
            <span className="hidden lg:block text-[15px]">Search</span>
          </a>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg group transition-colors w-fit lg:w-full ${isActive ? "font-bold" : ""}`
            }
          >
            <i className="fa-regular fa-compass text-[22px] group-hover:scale-105 transition-transform"></i>
            <span className="hidden lg:block text-[15px]">Explore</span>
          </NavLink>
          <NavLink
            to="/reels"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg group transition-colors w-fit lg:w-full ${isActive ? "font-bold" : ""}`
            }
          >
            <i className="fa-solid fa-clapperboard text-[22px] group-hover:scale-105 transition-transform"></i>
            <span className="hidden lg:block text-[15px]">Reels</span>
          </NavLink>
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg group transition-colors w-fit lg:w-full ${isActive ? "font-bold" : ""}`
            }
          >
            <i className="fa-brands fa-facebook-messenger text-[22px] group-hover:scale-105 transition-transform"></i>
            <span className="hidden lg:block text-[15px]">Messages</span>
          </NavLink>
          <a
            href="#"
            onClick={toggleNotif}
            className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg group transition-colors w-fit lg:w-full"
          >
            <i className="fa-regular fa-heart text-[22px] group-hover:scale-105 transition-transform"></i>
            <span className="hidden lg:block text-[15px]">Notifications</span>
          </a>
          <a
            href="#"
            onClick={toggleCreate}
            className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg group transition-colors w-fit lg:w-full"
          >
            <i className="fa-regular fa-square-plus text-[22px] group-hover:scale-105 transition-transform"></i>
            <span className="hidden lg:block text-[15px]">Create</span>
          </a>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg group transition-colors w-fit lg:w-full ${isActive ? "font-bold" : ""}`
            }
          >
            <img
              src={avatar}
              className="w-6 h-6 rounded-full group-hover:scale-105 transition-transform object-cover"
            />
            <span className="hidden lg:block text-[15px]">Profile</span>
          </NavLink>
        </nav>

        <div className="mt-auto shrink-0 pb-2">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg group transition-colors w-fit lg:w-full ${isActive ? "font-bold" : ""}`
            }
          >
            <i className="fa-solid fa-gear text-[22px] group-hover:scale-105 transition-transform"></i>
            <span className="hidden lg:block text-[15px]">Settings</span>
          </NavLink>

          <ThemeToggle />
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden flex justify-around items-center h-[50px] border-t border-gray-300 dark:border-gray-800 bg-white dark:bg-black fixed bottom-0 left-0 w-full z-[60]">
        <NavLink to="/" className="p-2 transition-transform active:scale-95">
          <i className="fa-solid fa-house text-2xl"></i>
        </NavLink>
        <NavLink
          to="/explore"
          className="p-2 transition-transform active:scale-95"
        >
          <i className="fa-solid fa-magnifying-glass text-2xl"></i>
        </NavLink>
        <NavLink
          to="/reels"
          className="p-2 transition-transform active:scale-95"
        >
          <i className="fa-solid fa-clapperboard text-2xl"></i>
        </NavLink>
        <a
          href="#"
          onClick={toggleCreate}
          className="p-2 transition-transform active:scale-95"
        >
          <i className="fa-regular fa-square-plus text-2xl"></i>
        </a>
        <NavLink
          to="/profile"
          className="p-2 transition-transform active:scale-95"
        >
          <img
            src={avatar}
            className="w-6 h-6 rounded-full object-cover border border-gray-300"
          />
        </NavLink>
      </nav>
    </>
  );
}

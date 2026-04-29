import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import {
  BsGrid3X3,
  BsBookmark,
  BsPersonBoundingBox,
  BsPlusLg,
} from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineVerified } from "react-icons/md";
import { RiNotificationLine } from "react-icons/ri";
import { useAuthStore } from "../store/useAuth.store";

const Profile = () => {
  const { userId } = useParams?.() ?? {};
  const authUser = useAuthStore((s) => s.authUser);

  const [activeTab, setActiveTab] = useState("posts");

  const tabs = [
    { id: "posts", icon: <BsGrid3X3 size={22} /> },
    { id: "saved", icon: <BsBookmark size={22} /> },
    { id: "tagged", icon: <BsPersonBoundingBox size={22} /> },
  ];

  return (
    <div className="bg-black text-zinc-100 min-h-screen font-sans">
      {/* Topbar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 sticky top-0 bg-black z-10 md:hidden">
        <span className="flex items-center gap-1 font-bold text-lg">
          {authUser?.username}
          <MdOutlineVerified className="text-blue-500" size={18} />
        </span>

        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-zinc-800">
            <RiNotificationLine size={24} />
          </button>
          <button className="p-2 rounded-full hover:bg-zinc-800">
            <IoSettingsOutline size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-[935px] mx-auto px-4 pt-5">
        {/* Profile Info */}
        <section className="flex items-center gap-6 md:gap-12 mb-5">
          {/* Avatar */}
          <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700 flex-shrink-0 flex items-end justify-center">
            {authUser?.avatar ? (
              <img
                src={authUser.avatar}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg viewBox="0 0 80 80" className="w-[90%] h-[90%]">
                <circle cx="40" cy="30" r="18" fill="#555" />
                <ellipse cx="40" cy="70" rx="28" ry="18" fill="#555" />
              </svg>
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link to={`/${userId ?? authUser?.username}`}>
                <h2 className="font-bold text-lg md:text-xl truncate">
                  {authUser?.username}
                </h2>
              </Link>

              {authUser.isBlueTick && (
                <MdOutlineVerified className="text-blue-500" size={20} />
              )}
            </div>

            <p className="text-sm text-zinc-400">{authUser?.name}</p>

            {/* Stats */}
            <div className="flex items-center gap-3 md:gap-8 flex-wrap md:flex-nowrap">
              <div className="flex gap-1">
                <span className="font-bold">{authUser?.posts}</span>
                <span className="text-zinc-400 text-sm">posts</span>
              </div>

              <div className="flex gap-1">
                <span className="font-bold">{authUser?.followers}</span>
                <span className="text-zinc-400 text-sm">followers</span>
              </div>

              <div className="flex gap-1">
                <span className="font-bold">{authUser?.following}</span>
                <span className="text-zinc-400 text-sm">following</span>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <div className="flex gap-2 mb-6 max-w-md">
          <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold py-2 rounded-lg active:scale-95">
            Edit Profile
          </button>
          <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold py-2 rounded-lg active:scale-95">
            View archive
          </button>
        </div>

        {/* Highlights */}
        <section className="flex gap-4 overflow-x-auto pb-2 mb-4 no-scrollbar">
          <div className="flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center hover:bg-zinc-800 cursor-pointer">
              <BsPlusLg size={24} className="text-zinc-500" />
            </div>
            <span className="text-xs text-zinc-400">New</span>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex border-t border-zinc-800 -mx-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 flex justify-center ${
                activeTab === tab.id
                  ? "text-white border-t border-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.icon}
            </button>
          ))}
        </div>

        {/* Empty State */}
        <div className="min-h-[260px] flex items-center justify-center">
          <div className="text-center flex flex-col items-center gap-3 px-6 py-10">
            {activeTab === "posts" && (
              <BsGrid3X3 size={48} className="text-zinc-700" />
            )}
            {activeTab === "saved" && (
              <BsBookmark size={48} className="text-zinc-700" />
            )}
            {activeTab === "tagged" && (
              <BsPersonBoundingBox size={48} className="text-zinc-700" />
            )}

            <p className="text-xl font-bold">
              {activeTab === "posts" && "Share Photos"}
              {activeTab === "saved" && "Save"}
              {activeTab === "tagged" && "Photos of you"}
            </p>

            <p className="text-sm text-zinc-500 max-w-xs">
              {activeTab === "posts" &&
                "When you share photos, they will appear on your profile."}
              {activeTab === "saved" &&
                "Save photos and videos that you want to see again."}
              {activeTab === "tagged" &&
                "When people tag you in photos, they'll appear here."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

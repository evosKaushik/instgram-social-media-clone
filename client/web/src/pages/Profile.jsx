import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BsGrid3X3,
  BsBookmark,
  BsPersonBoundingBox,
  BsPlusLg,
  BsPatchCheckFill,
} from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineVerified } from "react-icons/md";
import { RiNotificationLine } from "react-icons/ri";
import { useAuthStore } from "../store/useAuth.store";
import ImageWithShimmer from "../components/ImageShimmer";
import axiosInstance from "../utils/axios";
import { SlLock } from "react-icons/sl";

const Profile = () => {
  const { username } = useParams();
  const authUser = useAuthStore((s) => s.authUser);
  const [user, setUser] = useState(authUser);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const { state } = useLocation();
  const initialUser = state?.user;
  const isMe = username === authUser?.username;

  const tabs = [
    { id: "posts", icon: <BsGrid3X3 size={22} /> },
    { id: "saved", icon: <BsBookmark size={22} /> },
    { id: "tagged", icon: <BsPersonBoundingBox size={22} /> },
  ];

  const fetchUserById = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get(`/users/${username}`);
      setUser(data.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!username) return;

    // ✅ Always check if it's me
    if (username === authUser?.username) {
      setUser(authUser);
      return;
    }

    // ✅ Use state for instant UI (optional optimization)
    if (initialUser && initialUser.username === username) {
      setUser(initialUser);
    }

    // ✅ Always fetch (to avoid stale data)
    fetchUserById();
  }, [username, authUser]);

  const showPrivate = !isMe && user?.isPrivate;

  return (
    <div className=" min-h-screen font-sans">
      {/* Topbar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 sticky top-0 bg-black z-10 md:hidden">
        <span className="flex items-center gap-1 font-bold text-lg">
          {user?.username}
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

      <div className="max-w-[935px] mx-auto px-4 pt-5">
        {/* Profile Info */}
        <section className="flex items-center   gap-6 md:gap-12 mb-5">
          {/* Avatar */}
          <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700 flex-shrink-0 flex items-end justify-center">
            {user?.avatar ? (
              <ImageWithShimmer
                src={user.avatar}
                // className="w-full h-full object-cover"
              />
            ) : (
              <svg viewBox="0 0 80 80" className="w-[90%] h-[90%]">
                <circle cx="40" cy="30" r="18" fill="#555" />
                <ellipse cx="40" cy="70" rx="28" ry="18" fill="#555" />
              </svg>
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link to={`/${user ?? user?.username}`}>
                <h2 className="font-bold text-lg md:text-xl lg:text-2xl truncate">
                  {user?.username}
                </h2>
              </Link>

              {user.isBlueTick && (
                <BsPatchCheckFill
                  className="text-blue-500"
                  size={20}
                  title="verified"
                />
              )}
            </div>

            <p className="">{user?.name}</p>

            {/* Stats */}
            <div className="flex  items-center gap-3 md:gap-8 flex-wrap md:flex-nowrap">
              <div className="flex gap-1">
                <span className="font-bold">{user?.posts}</span>
                <span className="font-semibold">posts</span>
              </div>

              <div className="flex gap-1">
                <span className="font-bold">{user?.followersCount}</span>
                <span className="font-semibold">followers</span>
              </div>

              <div className="flex gap-1">
                <span className="font-bold">{user?.followingCount}</span>
                <span className="font-semibold">following</span>
              </div>
            </div>
          </div>
        </section>
        <div className="mb-5">
          <p>{user?.bio}</p>
        </div>

        {/* Buttons */}
        {isMe ? (
          <div className="flex gap-2 mb-6 max-sm:flex-col">
            <button className="flex-1 bg-border text-sm font-semibold py-2  hover:cursor-pointer hover:bg-border/80 rounded-lg active:scale-95 transition-colors">
              Edit Profile
            </button>
            <button className="flex-1 bg-border text-sm font-semibold py-2 hover:cursor-pointer hover:bg-border/80 rounded-lg active:scale-95 transition-colors">
              View archive
            </button>
          </div>
        ) : (
          <div className="flex gap-2 mb-6 max-sm:flex-col">
            <button className="flex-1 bg-blue-500 dark:bg-blue-800  text-sm font-semibold py-2 hover:cursor-pointer hover:bg-border/80 rounded-lg active:scale-95 transition-colors">
              Follow
            </button>
          </div>
        )}

        {/* Highlights */}
        {isMe && (
          <section className="flex gap-4 overflow-x-auto pb-2 mb-4 no-scrollbar">
            <div className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 rounded-full border-2 border-dashed  flex items-center justify-center hover:bg-foreground/5 cursor-pointer">
                <BsPlusLg size={24} className="" />
              </div>
              <span className="text-xs">New</span>
            </div>
          </section>
        )}

        {/* Tabs */}
        <div className="flex border-t border-zinc-800 -mx-4">
          {showPrivate
            ? !isMe && (
                <div className="flex justify-center items-center mx-auto py-8 gap-4">
                  <div className="border border-foreground/50 rounded-full p-4 inline-block ">
                    <SlLock size={28} />
                  </div>
                  <div>
                    <h3>This profile is private</h3>
                    <p className="text-sm">
                      Follow to see their photos and videos.
                    </p>
                  </div>
                </div>
              )
            : tabs.map((tab) => (
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
        {isMe && user.isPrivate && (
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
        )}
      </div>
    </div>
  );
};

export default Profile;

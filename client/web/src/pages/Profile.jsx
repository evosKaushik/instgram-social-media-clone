import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuth.store";
import axiosInstance from "../utils/axios";
import { FaCamera } from "react-icons/fa";
import {
  BsGrid3X3,
  BsBookmark,
  BsPersonBoundingBox,
  BsPatchCheckFill,
} from "react-icons/bs";
import { SlLock } from "react-icons/sl";
import ImageWithShimmer from "../components/ImageShimmer";
import toast from "react-hot-toast";

const Profile = () => {
  const { username } = useParams();
  const authUser = useAuthStore((s) => s.authUser);
  const setAuthUser = useAuthStore((s) => s.setAuthUser);

  const isMe = username === authUser?.username;
  const [isFollowing, setIsFollowing] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(authUser?.avatar);

  useEffect(() => {
    if (!username || !authUser) return;

    if (isMe) {
      setUser(authUser);
      setLoading(false); // ❗ you forgot this
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get(`/users/${username}`);
        setUser(res.data.user);

        const followRes = await axiosInstance.get(
          `/users/follow-status/${res.data.user._id}`,
        );

        setIsFollowing(followRes.data.isFollowing);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username, authUser, isMe]);

  // 🔥 FOLLOW / UNFOLLOW
  const handleFollow = async () => {
    if (!user) return;

    try {
      setFollowLoading(true);

      if (isFollowing) {
        await axiosInstance.delete(`/users/unfollow/${user.username}`);

        setIsFollowing(false);
        setUser((prev) => ({
          ...prev,
          followersCount: prev.followersCount - 1,
        }));
      } else {
        await axiosInstance.post(`/users/follow/${user.username}`);

        setIsFollowing(true);
        setUser((prev) => ({
          ...prev,
          followersCount: prev.followersCount + 1,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFollowLoading(false);
    }
  };

  const showPrivate = user?.isPrivate && !isMe && !isFollowing;

  const tabs = [
    { id: "posts", icon: <BsGrid3X3 size={22} /> },
    { id: "saved", icon: <BsBookmark size={22} /> },
    { id: "tagged", icon: <BsPersonBoundingBox size={22} /> },
  ];

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (e.target.files.length > 1) {
      toast.error("Only one file allowed");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("File too large (max 2MB)");
      return;
    }

    const modifiedFile = new File(
      [file], // keep original binary
      file.name,
      { type: file.type },
    );

    setImagePreview(URL.createObjectURL(modifiedFile));

    const formData = new FormData();
    formData.append("avatar", modifiedFile);

    try {
      const { data } = await axiosInstance.patch("/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        console.log(data)
        setAuthUser(data?.data);
        setUser(data.data);
      }
    } catch (error) {
      setImagePreview(authUser?.avatar);
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[935px] mx-auto px-4 pt-5">
        {/* PROFILE HEADER */}
        <section className="flex gap-6 mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden relative border border-foreground/50">
            <ImageWithShimmer src={imagePreview} />
            {isMe && (
              <>
                <div className=" group absolute inset-0 hover:bg-background/50 flex justify-center items-center cursor-pointer transition-colors">
                  <FaCamera
                    size={32}
                    className="opacity-0 group-hover:opacity-80"
                  />
                  <input
                    type="file"
                    name="avatar"
                    onChange={handleAvatarUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{user?.username}</h2>

              {user?.isBlueTick && (
                <BsPatchCheckFill className="text-blue-500" />
              )}
            </div>

            <p>{user?.name}</p>

            <div className="flex gap-4">
              <span>{user?.posts} posts</span>
              <span>{user?.followersCount} followers</span>
              <span>{user?.followingCount} following</span>
            </div>

            {isMe ? (
              <button className="bg-border px-4 py-1 rounded">
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                {followLoading
                  ? "Loading..."
                  : isFollowing
                    ? "Unfollow"
                    : "Follow"}
              </button>
            )}
          </div>
        </section>

        {/* PRIVATE VIEW */}
        {showPrivate ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <SlLock size={32} />
            <h3>This account is private</h3>
            <p>Follow to see posts</p>
          </div>
        ) : (
          <>
            {/* TABS */}
            <div className="flex border-t">
              {tabs.map((tab) => (
                <button key={tab.id} className="flex-1 py-3">
                  {tab.icon}
                </button>
              ))}
            </div>

            {/* POSTS PLACEHOLDER */}
            <div className="py-10 text-center text-gray-500">
              Posts will be here
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;

import { useParams } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import {
  BsGrid3X3,
  BsBookmark,
  BsPersonBoundingBox,
  BsPatchCheckFill,
} from "react-icons/bs";
import { SlLock } from "react-icons/sl";
import ImageWithShimmer from "../components/ImageShimmer";

import { useProfileData } from "../hooks/useProfileData";
import { useFollow } from "../hooks/useFollow";
import { useAvatarUpload } from "../hooks/useAvatarUpload";
import { ClipLoader } from "react-spinners";

const Profile = () => {
  const { username } = useParams();
  const { user, setUser, loading, isFollowing, setIsFollowing, isMe } = useProfileData(username);
  const { handleFollow, followLoading } = useFollow(user, setUser, isFollowing, setIsFollowing);
  const { imagePreview, isUploading, handleAvatarUpload } = useAvatarUpload(setUser);

  const showPrivate = user?.isPrivate && !isMe && !isFollowing;

  const tabs = [
    { id: "posts", icon: <BsGrid3X3 size={22} /> },
    { id: "saved", icon: <BsBookmark size={22} /> },
    { id: "tagged", icon: <BsPersonBoundingBox size={22} /> },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-[935px] mx-auto px-4 pt-5">
        {/* PROFILE HEADER */}
        <section className="flex gap-6 mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden relative border border-foreground/50">
            <ImageWithShimmer src={imagePreview} />
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex justify-center items-center z-10">
                <ClipLoader size={24} color="#ffffff" />
              </div>
            )}
            {isMe && !isUploading && (
              <>
                <div className="group absolute inset-0 hover:bg-background/50 flex justify-center items-center cursor-pointer transition-colors z-20">
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
                disabled={followLoading}
                className="bg-blue-500 text-white px-4 h-8 rounded flex justify-center items-center font-semibold text-sm min-w-[100px]"
              >
                {followLoading
                  ? <ClipLoader size={14} color="#ffffff" />
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

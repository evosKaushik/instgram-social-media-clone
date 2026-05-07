import { useState } from "react";
import axiosInstance from "../utils/axios";

export const useFollow = (user, setUser, isFollowing, setIsFollowing) => {
  const [followLoading, setFollowLoading] = useState(false);

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
      console.error("Error toggling follow:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  return { handleFollow, followLoading };
};

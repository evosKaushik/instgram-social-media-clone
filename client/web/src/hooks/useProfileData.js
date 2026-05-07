import { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import { useAuthStore } from "../store/useAuth.store";

export const useProfileData = (username) => {
  const authUser = useAuthStore((s) => s.authUser);
  const isMe = username === authUser?.username;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!username || !authUser) return;

    if (isMe) {
      setUser(authUser);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/users/${username}`);
        setUser(res.data.user);

        const followRes = await axiosInstance.get(
          `/users/follow-status/${res.data.user._id}`
        );
        setIsFollowing(followRes.data.isFollowing);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username, authUser, isMe]);

  return { user, setUser, loading, isFollowing, setIsFollowing, isMe, authUser };
};

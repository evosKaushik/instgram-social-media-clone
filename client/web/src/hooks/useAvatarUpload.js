import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axios";
import { useAuthStore } from "../store/useAuth.store";

export const useAvatarUpload = (setUser) => {
  const authUser = useAuthStore((s) => s.authUser);
  const setAuthUser = useAuthStore((s) => s.setAuthUser);
  const [imagePreview, setImagePreview] = useState(authUser?.avatar);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (e.target.files?.length > 1) {
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

    const modifiedFile = new File([file], file.name, { type: file.type });
    setImagePreview(URL.createObjectURL(modifiedFile));

    const formData = new FormData();
    formData.append("avatar", modifiedFile);

    try {
      setIsUploading(true);
      const { data } = await axiosInstance.patch("/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setAuthUser(data?.data);
        if (setUser) setUser(data.data);
      }
    } catch (error) {
      setImagePreview(authUser?.avatar);
      toast.error(error.response?.data?.message || "File upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return { imagePreview, isUploading, handleAvatarUpload };
};

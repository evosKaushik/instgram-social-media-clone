import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axios";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,

  // 🔍 CHECK AUTH
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const {data} = await axiosInstance.get("/auth/check");
      set({ authUser: data.user });
      return true;
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
      return false;
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // 📝 SIGNUP
  signup: async (payload) => {
    set({ isSigningUp: true });

    try {
      const { data } = await axiosInstance.post("/auth/signup", payload);

      if (data.success) {
        set({ authUser: data.data });
        toast.success(data.message);
        return true;
      }

      return false;
    } catch (error) {
      console.log("Signup error:", error);
      toast.error(error.response?.data?.error || "Signup failed");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  // 🔐 LOGIN
  login: async (payload) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", payload);

      set({ authUser: res.data });
      toast.success("Logged in successfully");

      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // 🚪 LOGOUT
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      set({ authUser: null });
      toast.success("Logged out successfully");

      return true;
    } catch (error) {
      console.log("Logout error:", error);
      toast.error("Error logging out");
      return false;
    }
  },

  // 👤 UPDATE PROFILE
  updateProfile: async (payload) => {
    try {
      const res = await axiosInstance.patch("/auth/profile", payload);

      set({ authUser: res.data });
      toast.success("Profile updated successfully");

      return true;
    } catch (error) {
      console.log("Update profile error:", error);
      toast.error(error?.response?.data?.message || "Update failed");
      return false;
    }
  },

  // 🔌 OPTIONAL SOCKET HANDLERS
  connectSocket: () => {
    console.log("Socket connect...");
  },

  disconnectSocket: () => {
    console.log("Socket disconnect...");
  },
}));

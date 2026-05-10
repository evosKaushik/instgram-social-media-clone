import axios from "axios";
import ENV from "./env";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

const axiosInstance = axios.create({
  baseURL: ENV.SERVER_URL,
  withCredentials: true,
});

// Separate instance for refresh
const refreshClient = axios.create({
  baseURL: ENV.SERVER_URL,
  withCredentials: true,
});

export default axiosInstance;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });

  failedQueue = [];
};

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use((config) => {
  NProgress.start();
  return config;
});

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (res) => {
    NProgress.done();
    return res;
  },

  async (error) => {
    NProgress.done();

    const originalRequest = error.config;

    // Prevent infinite refresh loop
    if (originalRequest?.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // Only refresh on 401
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      // Queue requests while refreshing
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use separate axios instance
        await refreshClient.post("/auth/refresh");

        processQueue(null);

        return axiosInstance(originalRequest);

      } catch (err) {
        processQueue(err);

        // Redirect only once refresh fails
        window.location.replace("/login");

        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
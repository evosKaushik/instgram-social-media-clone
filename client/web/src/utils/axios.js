import axios from "axios";
import ENV from "./env"

const axiosInstance = axios.create({
  baseURL: ENV.SERVER_URL,
  withCredentials: true,
});

export default axiosInstance;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  console.log("🟡 Processing queue, error:", error);

  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });

  failedQueue = [];
};

// 🔵 REQUEST LOG
axiosInstance.interceptors.request.use((config) => {
  console.log("📤 Request:", config.method?.toUpperCase(), config.url);
  return config;
});

// 🔴 RESPONSE + REFRESH LOGIC
axiosInstance.interceptors.response.use(
  (res) => {
    console.log("📥 Response:", res.status, res.config.url);
    return res;
  },

  async (error) => {
    const originalRequest = error.config;

    console.log("❌ Error:", error.response?.status, originalRequest.url);

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("⚠️ 401 detected, attempting refresh...");

      if (isRefreshing) {
        console.log("⏳ Already refreshing, queueing request:", originalRequest.url);

        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          console.log("🔁 Retrying queued request:", originalRequest.url);
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 Calling /auth/refresh");

        await axiosInstance.post("/auth/refresh");

        console.log("✅ Refresh success");

        processQueue(null);

        console.log("🔁 Retrying original request:", originalRequest.url);
        return axiosInstance(originalRequest);

      } catch (err) {
        console.log("🚫 Refresh failed → redirecting to login");

        processQueue(err);

        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


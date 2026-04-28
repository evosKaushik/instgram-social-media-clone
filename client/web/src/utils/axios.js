import axios from "axios";
import ENV from "./env"

const axiosInstance = axios.create({
  baseURL: ENV.SERVER_URL,
  withCredentials: true,
});

export default axiosInstance;

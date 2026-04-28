import axios from "axios";
import ENV from "./env"

console.log(ENV.SERVER_URL)

const axiosInstance = axios.create({
  baseURL: ENV.SERVER_URL,
  withCredentials: true,
});

export default axiosInstance;

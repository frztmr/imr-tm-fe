import axios from "axios";

const API_CONF = axios.create({
  baseURL: "http://localhost:8899",
  // baseURL: "http://172.16.32.251:8899",
  // baseURL: "http://172.16.32.172:8899",
  // baseURL: "http://172.16.32.110:8899",
  // baseURL: "http://172.16.32.3:8899",
  // baseURL: "http://192.168.100.110:8899",
  timeout: 10000, // 10 detik timeout
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API_CONF;
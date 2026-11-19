import axios from "axios";

const API_CONF = axios.create({
  baseURL: "http://localhost:8768",
  // baseURL: "http://localhost:8899",
  // baseURL: "http://172.16.32.251:8899",
  // baseURL: "http://172.16.32.172:8899",
  // baseURL: "http://172.16.32.110:8899",
  // baseURL: "http://172.16.32.3:8899",
  // baseURL: "http://192.168.100.110:8899",
  timeout: 5000, // 10 detik timeout
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================================================
// 401 HANDLER — session expired / not logged in → go to login page
// =========================================================

// 401 on these is expected and handled by the caller:
//  - /auth/keep_login : app start when not logged in (redirecting here would loop)
//  - /auth/login      : wrong username / password
const SKIP_401_REDIRECT = ["/auth/keep_login", "/auth/login"];

const LOGIN_PATH = "/login";
let redirecting = false; // avoid multiple redirects when several requests fail at once

API_CONF.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? "";
    const skip = SKIP_401_REDIRECT.some((p) => url.startsWith(p));
    const onLoginPage = window.location.pathname.startsWith(LOGIN_PATH);

    if (status === 401 && !skip && !onLoginPage && !redirecting) {
      redirecting = true;
      // full page load (not router navigate) so redux/user state is cleared too
      window.location.replace(LOGIN_PATH);
    }

    // still reject so each caller's .catch / try-catch keeps working
    return Promise.reject(error);
  }
);

export default API_CONF;

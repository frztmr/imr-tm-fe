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

// Any 401 → /login. Only exception:
//  - /auth/login : wrong username / password → the login form shows the error itself
// No redirect loop: when we're already on /login nothing happens (see onLoginPage below),
// so /auth/keep_login returning 401 on the login page is fine.
const SKIP_401_REDIRECT = ["/auth/login"];

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

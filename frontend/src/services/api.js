import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("vendora_user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error("Failed to read auth token:", error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
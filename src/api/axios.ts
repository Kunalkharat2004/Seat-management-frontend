import axios from "axios";
import { useAuthStore } from "../store/auth.store";

// ─── Axios Instance ──────────────────────────────────────────────────────────

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10_000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// ─── Request Interceptor ────────────────────────────────────────────────────
// Attach the JWT from the Zustand auth store on every outgoing request.

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

// ─── Response Interceptor ───────────────────────────────────────────────────
// On a 401 Unauthorized from a *protected* endpoint: clear auth and redirect.
// Auth endpoints (login, set-password) return 401 for invalid credentials —
// those are expected errors and should be handled by the calling component.

const PUBLIC_AUTH_PATHS = ["/auth/login", "/auth/set-password"];

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl = error.config?.url ?? "";
        const isPublicAuth = PUBLIC_AUTH_PATHS.some((path) =>
            requestUrl.includes(path),
        );

        if (error.response?.status === 401 && !isPublicAuth) {
            useAuthStore.getState().logout();
            window.location.href = "/login";
        }

        return Promise.reject(error);
    },
);

export default api;

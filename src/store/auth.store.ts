import { create } from "zustand";

// ─── Constants ───────────────────────────────────────────────────────────────

const TOKEN_KEY = "access_token";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
}

interface AuthState {
    /** Authenticated user profile (null when logged-out) */
    user: User | null;
    /** JWT access token (null when logged-out) */
    accessToken: string | null;
    /** Derived convenience flag */
    isAuthenticated: boolean;
    /** True while restoring user profile from a persisted token on refresh */
    isHydrating: boolean;

    /** Populate auth state after a successful login */
    login: (token: string, user: User) => void;
    /** Wipe auth state and remove persisted token */
    logout: () => void;
    /** Replace the user object (e.g. after a profile refresh) */
    setUser: (user: User) => void;
    /** Replace only the token (e.g. after a silent refresh) */
    setToken: (token: string) => void;
    /** Mark hydration as complete */
    setHydrated: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getPersistedToken = (): string | null => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
};

const persistToken = (token: string): void => {
    try {
        localStorage.setItem(TOKEN_KEY, token);
    } catch {
        /* storage full / blocked – fail silently */
    }
};

const removePersistedToken = (): void => {
    try {
        localStorage.removeItem(TOKEN_KEY);
    } catch {
        /* fail silently */
    }
};

// ─── Store ───────────────────────────────────────────────────────────────────

const restoredToken = getPersistedToken();

export const useAuthStore = create<AuthState>((set) => ({
    // ── Initial state ──────────────────────────────────────────────────────────
    accessToken: restoredToken,
    user: null,
    isAuthenticated: restoredToken !== null,
    isHydrating: restoredToken !== null, // needs hydration when token exists

    // ── Actions ────────────────────────────────────────────────────────────────

    login: (token, user) => {
        persistToken(token);
        set({ accessToken: token, user, isAuthenticated: true, isHydrating: false });
    },

    logout: () => {
        removePersistedToken();
        set({ accessToken: null, user: null, isAuthenticated: false, isHydrating: false });
    },

    setUser: (user) => {
        set({ user });
    },

    setToken: (token) => {
        persistToken(token);
        set({ accessToken: token, isAuthenticated: true });
    },

    setHydrated: () => {
        set({ isHydrating: false });
    },
}));

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { AxiosError } from "axios";

import {
    login as loginApi,
    getCurrentUser,
    setPassword as setPasswordApi,
    type LoginCredentials,
    type LoginResponse,
    type CurrentUserResponse,
    type SetPasswordPayload,
} from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const authKeys = {
    all: ["auth"] as const,
    me: () => [...authKeys.all, "me"] as const,
};

// ─── useCurrentUser ──────────────────────────────────────────────────────────
// Fetches the authenticated user's profile. Enabled only when a token exists.

export const useCurrentUser = () => {
    const accessToken = useAuthStore((s) => s.accessToken);

    return useQuery<CurrentUserResponse, AxiosError>({
        queryKey: authKeys.me(),
        queryFn: getCurrentUser,
        enabled: !!accessToken,
    });
};

// ─── useLoginMutation ────────────────────────────────────────────────────────
// Handles the full login flow: authenticate → fetch profile → store → redirect.

export const useLoginMutation = () => {
    const storeLogin = useAuthStore((s) => s.login);
    const navigate = useNavigate();

    return useMutation<
        { loginRes: LoginResponse; profile: CurrentUserResponse },
        AxiosError,
        LoginCredentials
    >({
        mutationFn: async (credentials) => {
            // 1. Authenticate and receive JWT
            const loginRes = await loginApi(credentials);

            // 2. Temporarily set token so /auth/me is authenticated
            useAuthStore.getState().setToken(loginRes.access_token);

            // 3. Fetch full user profile
            const profile = await getCurrentUser();

            return { loginRes, profile };
        },

        onSuccess: ({ loginRes, profile }) => {
            // 4. Persist token + user in Zustand store
            storeLogin(loginRes.access_token, {
                id: profile.id,
                employee_id: profile.employee_id,
                name: profile.name,
                email: profile.email,
                role: profile.role,
                status: profile.status,
            });

            // 5. Redirect based on role
            if (loginRes.role === "admin") {
                navigate("/admin/dashboard", { replace: true });
            } else {
                navigate("/employee/dashboard", { replace: true });
            }
        },
    });
};

// ─── useSetPasswordMutation ──────────────────────────────────────────────────

export const useSetPasswordMutation = () => {
    return useMutation<{ message: string }, AxiosError, SetPasswordPayload>({
        mutationFn: setPasswordApi,
    });
};

// ─── useLogout ───────────────────────────────────────────────────────────────
// Clears auth state, wipes query cache, and redirects to /login.

export const useLogout = () => {
    const storeLogout = useAuthStore((s) => s.logout);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useCallback(() => {
        storeLogout();
        queryClient.clear();
        navigate("/login", { replace: true });
    }, [storeLogout, queryClient, navigate]);
};

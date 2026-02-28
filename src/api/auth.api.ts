import api from "./axios";

// ─── Request / Response Types ────────────────────────────────────────────────

export interface LoginCredentials {
    employee_id: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    role: string;
}

export interface SetPasswordPayload {
    token: string;
    new_password: string;
}

export interface CurrentUserResponse {
    employee_id: string;
    name: string;
    email: string;
    role: string;
    status: string;
}

// ─── API Functions ───────────────────────────────────────────────────────────

/**
 * Authenticate an employee and receive a JWT.
 * POST /auth/login
 */
export const login = async (
    credentials: LoginCredentials,
): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", credentials);
    return data;
};

/**
 * Fetch the currently authenticated user's profile.
 * GET /auth/me
 */
export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
    const { data } = await api.get<CurrentUserResponse>("/auth/me");
    return data;
};

/**
 * Set password using an invite or reset token.
 * POST /auth/set-password
 */
export const setPassword = async (
    payload: SetPasswordPayload,
): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>(
        "/auth/set-password",
        payload,
    );
    return data;
};

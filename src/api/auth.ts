// src/api/auth.ts
import { apiFetch } from "./client";
import { mockApi } from "./mock";

// Control mock usage via environment variable
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Login response from backend (snake_case)
type BackendAuthResponse = { access_token: string; token_type: string };

// Normalized response (camelCase)
export type AuthResponse = { accessToken: string };

// Normalize backend response
function normalizeAuthResponse(res: BackendAuthResponse): AuthResponse {
    return { accessToken: res.access_token };
}

/**
 * Login API - POST /login
 * Returns accessToken; refresh token is set as HttpOnly cookie by backend
 */
export async function loginApi(username: string, password: string): Promise<AuthResponse> {
    if (USE_MOCK) {
        return mockApi.login(username, password);
    }
    const res = await apiFetch<BackendAuthResponse>("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        skipAuth: true,
    });
    return normalizeAuthResponse(res);
}

/**
 * Register API - POST /register
 */
export async function registerApi(username: string, password: string): Promise<AuthResponse> {
    if (USE_MOCK) {
        return mockApi.register(username, password);
    }
    const res = await apiFetch<BackendAuthResponse>("/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        skipAuth: true,
    });
    return normalizeAuthResponse(res);
}

/**
 * Logout API - POST /logout
 * Server revokes refresh token cookie
 */
export async function logoutApi() {
    if (USE_MOCK) {
        return mockApi.logout();
    }
    return apiFetch<void>("/logout", { method: "POST" });
}
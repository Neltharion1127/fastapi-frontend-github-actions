// src/api/client.ts
import { getAccessToken, setAccessToken } from "../auth/token";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

type RequestOptions = RequestInit & { skipAuth?: boolean };

let refreshingPromise: Promise<void> | null = null;

// Refresh token rotation using HttpOnly cookie
async function refreshAccessToken(): Promise<void> {
    // Prevent concurrent refresh requests (deduplication)
    if (!refreshingPromise) {
        refreshingPromise = (async () => {
            const res = await fetch(`${API_BASE}/refresh`, {
                method: "POST",
                credentials: "include", // Refresh token is in HttpOnly cookie
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                setAccessToken(null);
                throw new Error("Refresh failed");
            }

            const data = await res.json();
            // Response format: { access_token: "..." }
            setAccessToken(data.access_token);
        })().finally(() => {
            refreshingPromise = null;
        });
    }

    return refreshingPromise;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const url = `${API_BASE}${path}`;

    const headers = new Headers(options.headers);
    headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");

    if (!options.skipAuth) {
        const token = getAccessToken();
        if (token) headers.set("Authorization", `Bearer ${token}`);
    }

    const doRequest = async () => {
        const res = await fetch(url, {
            ...options,
            headers,
            credentials: "include", // Required for cookie mode
        });
        return res;
    };

    let res = await doRequest();

    // 401 → refresh → retry once
    if (res.status === 401 && !options.skipAuth) {
        await refreshAccessToken();

        const token = getAccessToken();
        if (token) headers.set("Authorization", `Bearer ${token}`);

        res = await doRequest();
    }

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
    }

    // 204 No Content
    if (res.status === 204) return undefined as T;

    return (await res.json()) as T;
}
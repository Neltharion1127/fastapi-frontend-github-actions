// Token Storage Module - Using memory + localStorage for persistence
const TOKEN_KEY = 'access_token';

let accessToken: string | null = null;

// Restore token from localStorage on initialization
if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem(TOKEN_KEY);
}

export function getAccessToken(): string | null {
    return accessToken;
}

export function setAccessToken(token: string | null): void {
    accessToken = token;
    if (typeof window !== 'undefined') {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
        } else {
            localStorage.removeItem(TOKEN_KEY);
        }
    }
}

export function clearAccessToken(): void {
    setAccessToken(null);
}

export function hasValidToken(): boolean {
    return !!accessToken;
}
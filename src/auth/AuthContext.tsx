// AuthContext - Authentication Context and Provider
import * as React from 'react';
import { User } from '../entities/User';
import { Credentials, RegisterCredentials } from '../entities/Credentials';
import { loginApi, registerApi, logoutApi } from '../api/auth';
import { setAccessToken, clearAccessToken, getAccessToken } from './token';
import type { Session } from '@toolpad/core/AppProvider';

// Authentication status
type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
    user: User | null;
    session: Session | null;
    status: AuthStatus;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: Credentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
    children: React.ReactNode;
}

// Decode JWT payload (without verification - server is trusted)
function decodeJwtPayload(token: string): { sub?: string; username?: string; exp?: number } | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(atob(parts[1]));
        return payload;
    } catch {
        return null;
    }
}

// Check if token is expired
function isTokenExpired(token: string): boolean {
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return false;
    return payload.exp * 1000 < Date.now();
}

// Get user from token
function getUserFromToken(token: string): User | null {
    const payload = decodeJwtPayload(token);
    if (!payload) return null;
    return {
        id: payload.sub || payload.username || 'unknown',
        username: payload.username || payload.sub || 'unknown',
    };
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = React.useState<User | null>(null);
    const [status, setStatus] = React.useState<AuthStatus>('loading');

    // Convert User to Session format (required by toolpad core)
    const session: Session | null = React.useMemo(() => {
        if (!user) return null;
        return {
            user: {
                id: user.id,
                name: user.name || user.username,
                email: user.username,  // Toolpad expects email, use username
                image: user.image || undefined,
            },
        };
    }, [user]);

    // Set authenticated state from token
    const setAuthFromToken = React.useCallback((accessToken: string) => {
        const userInfo = getUserFromToken(accessToken);
        if (userInfo && !isTokenExpired(accessToken)) {
            setUser(userInfo);
            setStatus('authenticated');
        } else {
            clearAccessToken();
            setUser(null);
            setStatus('unauthenticated');
        }
    }, []);

    // Login
    const login = React.useCallback(async (credentials: Credentials) => {
        const result = await loginApi(credentials.username, credentials.password);
        setAccessToken(result.accessToken);
        setAuthFromToken(result.accessToken);
    }, [setAuthFromToken]);

    // Register
    const register = React.useCallback(async (credentials: RegisterCredentials) => {
        const result = await registerApi(credentials.username, credentials.password);
        setAccessToken(result.accessToken);
        setAuthFromToken(result.accessToken);
    }, [setAuthFromToken]);

    // Logout
    const logout = React.useCallback(async () => {
        try {
            await logoutApi();
        } catch {
            // Clear local state even if logout API fails
        }
        clearAccessToken();
        setUser(null);
        setStatus('unauthenticated');
    }, []);

    // Initialize: Check existing token
    React.useEffect(() => {
        const token = getAccessToken();
        if (token && !isTokenExpired(token)) {
            setAuthFromToken(token);
        } else {
            if (token) clearAccessToken();  // Clear expired token
            setStatus('unauthenticated');
        }
    }, [setAuthFromToken]);

    const value: AuthContextValue = {
        user,
        session,
        status,
        isAuthenticated: status === 'authenticated',
        isLoading: status === 'loading',
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook to use auth context
export function useAuth(): AuthContextValue {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Export context for advanced usage
export { AuthContext };

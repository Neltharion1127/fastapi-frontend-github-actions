// Route Guards - Protect routes that require authentication
import * as React from 'react';
import { Navigate, useLocation } from 'react-router';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        // Save current path for redirect after login
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    return <>{children}</>;
}

// Public Route - Redirect logged-in users to home when accessing login/register pages
interface PublicRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export function PublicRoute({ children, redirectTo = '/' }: PublicRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
}

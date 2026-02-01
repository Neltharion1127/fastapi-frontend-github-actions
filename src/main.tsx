import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import Metrics from './pages/metrics';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import { AuthProvider } from './auth';
import { ProtectedRoute, PublicRoute } from './routes/guards';

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      // Public routes - Login and Register
      {
        path: '/login',
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: '/register',
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      // Protected routes - Requires login
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: '',
            element: <Navigate to="/metrics" replace />,
          },
          {
            path: 'metrics',
            Component: Metrics,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
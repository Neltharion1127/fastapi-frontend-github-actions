import * as React from 'react';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Outlet, useNavigate } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation, Authentication } from '@toolpad/core/AppProvider';
import { useAuth } from './auth';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'metrics',
    title: 'Metrics',
    icon: <BarChartIcon />,
  },
];

const BRANDING = {
  title: "tools-aws-githubactions",
};

export default function App() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  // Authentication method configuration - required by toolpad core
  const authentication: Authentication = React.useMemo(() => ({
    signIn: () => {
      navigate('/login');
    },
    signOut: async () => {
      await logout();
      navigate('/login');
    },
  }), [logout, navigate]);

  return (
    <ReactRouterAppProvider
      navigation={NAVIGATION}
      branding={BRANDING}
      session={session}
      authentication={authentication}
    >
      <Outlet />
    </ReactRouterAppProvider>
  );
}
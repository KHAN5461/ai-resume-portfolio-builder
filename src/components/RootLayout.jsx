import React from 'react';
import { useUser } from '../auth.jsx';
import GlobalLoadingOverlay from './custom/GlobalLoadingOverlay';
import Home from '../home/index.jsx';
import Dashboard from '../dashboard/index.jsx';

export default function RootLayout() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <GlobalLoadingOverlay forceShow={true} />;
  }

  return isSignedIn ? <Dashboard /> : <Home />;
}

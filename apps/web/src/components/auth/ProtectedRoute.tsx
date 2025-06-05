import { Navigate, useLocation } from 'react-router-dom';

import { useMe } from '@/api/resources/auth/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!user) {
    // Redirect to login but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

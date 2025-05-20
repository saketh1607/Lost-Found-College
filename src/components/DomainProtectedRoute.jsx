// components/DomainProtectedRoute.jsx
import { useUser } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

const DomainProtectedRoute = () => {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) return <Navigate to="/login" replace />;

  const email = user?.primaryEmailAddress?.emailAddress || '';
  if (email === 'saketh1607@gmail.com') {
    return <Outlet />;
  }
  
  if (!email.endsWith('@vnrvjiet.in')) {
    return <Navigate to="/error" replace />;
  }

  return <Outlet />;
};

export default DomainProtectedRoute;

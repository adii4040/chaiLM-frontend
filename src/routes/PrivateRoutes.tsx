import { Navigate, Outlet } from 'react-router-dom';
import useCurrentUser from '../modules/auth/query/useCurrentUser';
import AuthLoaderSkeleton from '../components/AuthLoaderSkeleton';

const PrivateRoute = () => {
  const { data, isLoading: isCurrentLoading } = useCurrentUser();

  if (isCurrentLoading) {
    return <AuthLoaderSkeleton />;
  }

  if (!data || !data.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;

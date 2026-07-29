import { Navigate, Outlet } from 'react-router-dom';
import useCurrentUser from '../modules/auth/query/useCurrentUser';

const PublicRoute = () => {
  const { data } = useCurrentUser();

  if (data && data.user) {
    return <Navigate to="/workspace" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;

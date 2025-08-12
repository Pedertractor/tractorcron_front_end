import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/use-check-token';

interface PropsProtectRoute {
  allowedRoles: string[];
}

const ProtectRoute = ({ allowedRoles }: PropsProtectRoute) => {
  const { role, login, loading } = useAuth();

  if (loading) {
    return <></>;
  }

  if (!login) return <Navigate to={`/login`} replace />;

  if (role && !allowedRoles.includes(role)) return <div>não autorizado</div>;

  return <Outlet />;
};

export default ProtectRoute;

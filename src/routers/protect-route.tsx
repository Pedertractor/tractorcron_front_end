import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/use-check-token';
import { ChronoanalysisDraftResumeDialog } from '@/components/chronoanalysis-draft-resume-dialog';

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

  return (
    <>
      {(role === 'ADMIN' || role === 'CHRONOANALIST') && (
        <ChronoanalysisDraftResumeDialog />
      )}
      <Outlet />
    </>
  );
};

export default ProtectRoute;

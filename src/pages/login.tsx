import Text from '../components/ui/text';
import { LoginForm } from '@/components/login-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type TypeLogin } from '../zod/schema-login';
import { loginUser } from '../api/login-api';
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../hooks/use-check-token';

const LoginPage = () => {
  const navigate = useNavigate();

  const { login, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TypeLogin>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  async function sendLoginDatas(data: TypeLogin) {
    const result = await loginUser(data);

    if (result && result.login) {
      navigate('/');
    }

    if (result && result.message) {
      alert(result.message);
    }
  }

  if (loading) return <p>Carregando...</p>;

  if (login) return <Navigate to='/' replace />;

  return (
    <main className='bg-muted flex h-svh flex-col overflow-hidden'>
      <div className='flex min-h-0 flex-1 items-center justify-center p-4 md:p-6'>
        <div className='max-h-full w-full max-w-sm md:max-w-4xl'>
          <LoginForm
            onSubmit={handleSubmit(sendLoginDatas)}
            register={register}
            errors={errors}
            isValid={isValid}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
      <footer className='flex shrink-0 items-center justify-center py-3'>
        <Text className='animate-pulse' variant='little-text'>
          Pedertractor & TractorComponents
        </Text>
      </footer>
    </main>
  );
};

export default LoginPage;

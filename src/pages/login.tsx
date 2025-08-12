import Card from '../components/ui/card/card';
import Icon from '../components/ui/icon';
import ComponentShortLogo from '../assets/logo/short-logo.svg?react';
import loginImage from '../assets/login_img.svg';
import Text from '../components/ui/text';
import Input from '../components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type TypeLogin } from '../zod/schema-login';
import { loginUser } from '../api/login-api';
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../hooks/use-check-token';
import Label from '@/components/ui/label/label';
import Button from '@/components/ui/button/button';
const LoginPage = () => {
  const navigate = useNavigate();

  const { login, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
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
    <main className=' flex flex-col w-full h-screen '>
      <div className='py-10 px-14 flex gap-10 flex-col lg:flex-row w-full h-11/12 '>
        <img src={loginImage} alt='' className=' w-full hidden lg:flex ' />
        <Card className=' h-full flex items-start justify-start border-none px-0 py-0 '>
          <Icon svg={ComponentShortLogo} className=' size-30' />
          <Text variant={'master-title'}>
            Olá,
            <br />
            Bem vindo de volta!
          </Text>
          <Text>
            Faça o login com suas credenciais para fazer uma nova cronoanálise.
          </Text>
          <Card className=' border-none px-0 py-0 w-full  h-full'>
            <form
              className=' flex w-full h-full flex-col gap-10 lg:justify-start lg:gap-5'
              onSubmit={handleSubmit(sendLoginDatas)}
            >
              <Label title='Email'>
                <Input {...register('email')} />
                {errors.email && (
                  <span className='text-red-500 text-sm'>
                    {errors.email.message}
                  </span>
                )}
              </Label>
              <Label title='Senha'>
                <Input type='password' {...register('password')} />
                {errors.password && (
                  <span className='text-red-500 text-sm'>
                    {errors.password.message}
                  </span>
                )}
              </Label>

              <div className=' flex w-full justify-end items-center'>
                <Button
                  disabled={!isValid}
                  variant={`${!isValid ? 'default' : 'blue'}`}
                  size={'md'}
                >
                  login
                </Button>
              </div>
            </form>
          </Card>
        </Card>
      </div>
      <footer className=' w-full flex items-center justify-center h-full'>
        <Text className={'animate-pulse'} variant={'little-text'}>
          Pedertractor & TractorComponents
        </Text>
      </footer>
    </main>
  );
};

export default LoginPage;

import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import ComponentShortLogo from '@/assets/logo/short-logo.svg?react';
import loginImage from '@/assets/login_img.svg';
import type { TypeLogin } from '@/zod/schema-login';

interface LoginFormProps extends React.ComponentProps<'div'> {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<TypeLogin>;
  errors: FieldErrors<TypeLogin>;
  isValid: boolean;
  isSubmitting?: boolean;
}

export function LoginForm({
  className,
  onSubmit,
  register,
  errors,
  isValid,
  isSubmitting = false,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <Card className='max-h-[calc(100svh-3.5rem)] overflow-hidden border-none p-0 shadow-none'>
        <CardContent className='grid h-full p-0 md:grid-cols-2'>
          <form className='p-5 md:p-6' onSubmit={onSubmit}>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col items-center gap-3 text-center'>
                <Icon svg={ComponentShortLogo} className='size-24 md:size-28' />
                <div className='flex flex-col gap-1'>
                  <h1 className='text-initial text-xl font-extrabold md:text-2xl'>
                    Olá,
                    <br />
                    Bem vindo de volta!
                  </h1>
                  <p className='text-secondary text-balance text-sm'>
                    Faça o login com suas credenciais para fazer uma nova
                    cronoanálise.
                  </p>
                </div>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  autoComplete='email'
                  {...register('email')}
                />
                {errors.email && (
                  <span className='text-destructive text-sm'>
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='password'>Senha</Label>
                <Input
                  id='password'
                  type='password'
                  autoComplete='current-password'
                  {...register('password')}
                />
                {errors.password && (
                  <span className='text-destructive text-sm'>
                    {errors.password.message}
                  </span>
                )}
              </div>

              <Button
                type='submit'
                disabled={!isValid || isSubmitting}
                className='w-full bg-background-blue text-white hover:bg-background-blue-active disabled:opacity-50'
              >
                login
              </Button>
            </div>
          </form>

          <div className='bg-muted relative hidden min-h-0 md:block'>
            <img
              src={loginImage}
              alt=''
              className='absolute inset-0 h-full w-full object-contain'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

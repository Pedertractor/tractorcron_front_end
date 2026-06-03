import { createUser } from '@/api/users-api';
import CheckRequestStatus from '@/components/check-request-status';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useEmployee } from '@/hooks/use-employees';
import {
  createUserSchema,
  type TypeCreateUser,
} from '@/zod/schema-users';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export interface ModalCreateUserProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreated: () => void;
}

const UNITS = [
  { value: 'PEDERTRACTOR', label: 'Pedertractor' },
  { value: 'TRACTOR', label: 'Tractor' },
] as const;

const ROLES = [
  { value: 'USER', label: 'Usuário' },
  { value: 'CHRONOANALIST', label: 'Cronoanalista' },
  { value: 'ADMIN', label: 'Administrador' },
] as const;

const ModalCreateUser = ({
  open,
  setOpen,
  onCreated,
}: ModalCreateUserProps) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TypeCreateUser>({
    resolver: zodResolver(createUserSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      cardNumber: '',
      unit: 'PEDERTRACTOR',
      role: 'USER',
    },
  });

  const unit = watch('unit');
  const cardNumber = watch('cardNumber');

  const { employeeData, isLoading, isStatus, isDisabled } = useEmployee(
    unit,
    cardNumber,
  );

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  async function handleCreateUser(data: TypeCreateUser) {
    if (!employeeData || isDisabled) {
      toast.error('Colaborador inválido ou desativado.');
      return;
    }

    const cardForApi =
      data.cardNumber.replace(/\D/g, '').replace(/^0+/, '') || '0';

    const result = await createUser({
      ...data,
      cardNumber: cardForApi,
    });

    if (!result.status) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setOpen(false);
    onCreated();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='max-h-[90vh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto border-0 p-4 shadow-lg sm:p-6'>
        <DialogHeader>
          <DialogTitle>Novo usuário</DialogTitle>
          <DialogDescription>
            Cadastre um colaborador com acesso ao sistema.
          </DialogDescription>
        </DialogHeader>

        <form
          className='grid gap-4'
          onSubmit={handleSubmit(handleCreateUser)}
        >
          <div className='grid gap-2'>
            <Label>Unidade</Label>
            <div className='bg-muted inline-flex w-full rounded-lg p-1'>
              {UNITS.map((item) => (
                <Button
                  key={item.value}
                  type='button'
                  variant='ghost'
                  className={cn(
                    'flex-1',
                    unit === item.value &&
                      'bg-background text-foreground shadow-sm',
                  )}
                  onClick={() =>
                    setValue('unit', item.value, { shouldValidate: true })
                  }
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='cardNumber'>Cartão</Label>
            <CheckRequestStatus
              data={employeeData}
              loading={isLoading}
              status={isStatus}
              disabled={isDisabled}
            >
              <Input
                id='cardNumber'
                maxLength={4}
                inputMode='numeric'
                placeholder='0000'
                {...register('cardNumber')}
              />
            </CheckRequestStatus>
            {errors.cardNumber && (
              <p className='text-destructive text-sm'>
                {errors.cardNumber.message}
              </p>
            )}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='email'>E-mail</Label>
            <Input
              id='email'
              type='email'
              autoComplete='off'
              placeholder='usuario@empresa.com'
              {...register('email')}
            />
            {errors.email && (
              <p className='text-destructive text-sm'>{errors.email.message}</p>
            )}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='password'>Senha</Label>
            <Input
              id='password'
              type='password'
              autoComplete='new-password'
              placeholder='••••••••'
              {...register('password')}
            />
            {errors.password && (
              <p className='text-destructive text-sm'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='role'>Papel</Label>
            <Controller
              name='role'
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id='role' className='w-full'>
                    <SelectValue placeholder='Selecione o papel' />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className='text-destructive text-sm'>{errors.role.message}</p>
            )}
          </div>

          <DialogFooter className='gap-3'>
            <Button
              type='button'
              variant='ghost'
              className='bg-muted text-foreground hover:bg-muted/80'
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              className='bg-background-blue hover:bg-background-blue-active text-white'
              disabled={!isValid || isSubmitting || isDisabled || !employeeData}
            >
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreateUser;

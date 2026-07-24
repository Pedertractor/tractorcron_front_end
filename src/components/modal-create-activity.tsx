import { createActivity } from '@/api/activities-api';
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
import type { ActivityCatalogType } from '@/types/activity-catalog-types';
import {
  createActivitySchema,
  type TypeCreateActivity,
} from '@/zod/schema-activities';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export interface ModalCreateActivityProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultActivityType: ActivityCatalogType;
  onCreated: () => void;
}

const CLASSIFICATIONS = [
  { value: 'VAA', label: 'VAA' },
  { value: 'NVAA', label: 'NVAA' },
  { value: 'SVAA', label: 'SVAA' },
] as const;

const TYPE_MOVEMENTS = [
  { value: 'SOLDAR', label: 'Soldar' },
  { value: 'MONTAR', label: 'Montar' },
  { value: 'CAMINHAR', label: 'Caminhar' },
  { value: 'LIMPAR', label: 'Limpar' },
  { value: 'AJUSTAR', label: 'Ajustar' },
  { value: 'PEGAR', label: 'Pegar' },
  { value: 'RETRABALHAR', label: 'Retrabalhar' },
  { value: 'INSPECIONAR', label: 'Inspecionar' },
  { value: 'IDENTIFICAR', label: 'Identificar' },
  { value: 'POSICIONAR', label: 'Posicionar' },
  { value: 'DOBRAR', label: 'Dobrar' },
  { value: 'USINAR', label: 'Usinar' },
  { value: 'MEDIR', label: 'Medir' },
  { value: 'OUTROS', label: 'Outros' },
  { value: 'MASCARAR', label: 'Mascarar' },
  { value: 'CALAFETAR', label: 'Calafetar' },
  { value: 'REPASAR', label: 'Repasar' },
  { value: 'CALIBRAR', label: 'Calibrar' },
] as const;

const ACTIVITY_TYPES = [
  { value: 'SOLDAGEM', label: 'Soldagem' },
  { value: 'MONTAGEM', label: 'Montagem' },
  { value: 'DOBRA', label: 'Dobra' },
  { value: 'USINAGEM', label: 'Usinagem' },
  { value: 'PREP_PINTURA', label: 'Prep. pintura' },
  { value: 'REPASSE_DE_ROSCA', label: 'Repasse de rosca' },
  { value: 'GERAL', label: 'Geral' },
] as const;

const ModalCreateActivity = ({
  open,
  setOpen,
  defaultActivityType,
  onCreated,
}: ModalCreateActivityProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TypeCreateActivity>({
    resolver: zodResolver(createActivitySchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      classification: 'NVAA',
      typeMovement: 'OUTROS',
      activityType: defaultActivityType,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: '',
        classification: 'NVAA',
        typeMovement: 'OUTROS',
        activityType: defaultActivityType,
      });
    }
  }, [open, defaultActivityType, reset]);

  async function handleCreateActivity(data: TypeCreateActivity) {
    const result = await createActivity(data);

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
          <DialogTitle>Nova atividade</DialogTitle>
          <DialogDescription>
            Cadastre uma atividade vinculada a um tipo de cronoanálise.
          </DialogDescription>
        </DialogHeader>

        <form
          className='grid gap-4'
          onSubmit={handleSubmit(handleCreateActivity)}
        >
          <div className='grid gap-2'>
            <Label htmlFor='activity-name'>Nome</Label>
            <Input
              id='activity-name'
              placeholder='Ex.: Soldar'
              {...register('name')}
            />
            {errors.name && (
              <p className='text-destructive text-sm'>{errors.name.message}</p>
            )}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='activity-type'>Tipo da atividade</Label>
            <Controller
              name='activityType'
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id='activity-type' className='w-full'>
                    <SelectValue placeholder='Selecione o tipo' />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIVITY_TYPES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.activityType && (
              <p className='text-destructive text-sm'>
                {errors.activityType.message}
              </p>
            )}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='classification'>Classificação</Label>
            <Controller
              name='classification'
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id='classification' className='w-full'>
                    <SelectValue placeholder='Selecione a classificação' />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSIFICATIONS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.classification && (
              <p className='text-destructive text-sm'>
                {errors.classification.message}
              </p>
            )}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='type-movement'>Tipo de movimento</Label>
            <Controller
              name='typeMovement'
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id='type-movement' className='w-full'>
                    <SelectValue placeholder='Selecione o movimento' />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_MOVEMENTS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.typeMovement && (
              <p className='text-destructive text-sm'>
                {errors.typeMovement.message}
              </p>
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
              disabled={!isValid || isSubmitting}
            >
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreateActivity;

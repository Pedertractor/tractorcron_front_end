import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import Text from '@/components/ui/text';
import Card from '@/components/ui/card/card';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button/button';
import Label from '@/components/ui/label/label';
import CheckRequestStatus from '@/components/check-request-status';
import Icon from '@/components/ui/icon';
import TimingTypeSelector from '@/components/timing-type-selector';
import { DatePickerSingle } from '@/components/date-picker-single';
import logoComplete from '@/assets/logo/complete-logo.svg?react';

import { useEmployee } from '@/hooks/use-employees';
import { useSector } from '@/hooks/use-sectors';
import { useParts } from '@/hooks/use-parts';
import {
  chronoanalysisRequestSchema,
  type TypeChronoanalysisRequestData,
} from '@/zod/schema-chronoanalysis-request';
import {
  checkPartHasChronoanalysis,
  createChronoanalysisRequest,
  getRequesterContact,
} from '@/api/chronoanalysis-request-api';
import { mapTypeOfChronoanalysisToDb } from '@/constants/chronoanalysis-types';
import type { TimingType } from '@/types/chronoanalysis-request-types';

const RequestChronoanalysisPage = () => {
  const navigate = useNavigate();
  const [partExists, setPartExists] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors, isValid, isSubmitted },
  } = useForm<TypeChronoanalysisRequestData>({
    resolver: zodResolver(chronoanalysisRequestSchema),
    mode: 'onChange',
    defaultValues: {
      employeeUnit: undefined,
      employeeCardNumber: '',
      employeeEmail: '',
      sectorCostCenter: '',
      sectorName: '',
      internalCode: '',
      partNumber: '',
      operation: '',
      manufacturingStartDate: '',
      typeOfChronoanalysis: 'welding',
      productionTime: undefined,
      timingType: undefined,
      observation: '',
    },
  });

  const employeeUnit = watch('employeeUnit');
  const employeeCardNumber = watch('employeeCardNumber');
  const costCenter = watch('sectorCostCenter');
  const partCode = watch('internalCode');
  const typeOfChron = watch('typeOfChronoanalysis');
  const productionTime = watch('productionTime');
  const timingType = watch('timingType');

  const {
    employeeData,
    isLoading: isLoadingEmployee,
    isStatus: isStatusEmployee,
    isDisabled: isEmployeeDisabled,
  } = useEmployee(employeeUnit, employeeCardNumber);

  const {
    sectorData,
    isLoading: isLoadingSector,
    isStatus: isStatusSector,
  } = useSector(costCenter);

  const { partData, isLoading: isLoadingPart, isStatus: isStatusPart } =
    useParts(partCode);

  useEffect(() => {
    setValue('employeeEmail', '', { shouldValidate: false });
  }, [employeeUnit, employeeCardNumber, setValue]);

  useEffect(() => {
    if (
      !employeeUnit ||
      !employeeData ||
      !isStatusEmployee ||
      isLoadingEmployee ||
      isEmployeeDisabled
    ) {
      return;
    }

    let cancelled = false;
    (async () => {
      const result = await getRequesterContact(
        employeeUnit,
        employeeCardNumber,
      );
      if (cancelled) return;
      if (result.status && result.email) {
        setValue('employeeEmail', result.email, { shouldValidate: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    employeeUnit,
    employeeCardNumber,
    employeeData,
    isStatusEmployee,
    isLoadingEmployee,
    isEmployeeDisabled,
    setValue,
  ]);

  useEffect(() => {
    if (!isStatusSector) {
      setValue('sectorName', '', { shouldValidate: true });
      setValue('sectorId', undefined as unknown as number, {
        shouldValidate: true,
      });
    }
    if (!isLoadingSector && isStatusSector && sectorData) {
      setValue('sectorId', +sectorData.id, { shouldValidate: true });
      setValue('sectorName', sectorData.name, { shouldValidate: true });
    }
  }, [isLoadingSector, isStatusSector, sectorData, setValue]);

  useEffect(() => {
    if (isStatusPart && partData && !isLoadingPart) {
      setValue('partNumber', partData.partNumber, { shouldValidate: true });
      return;
    }
    setValue('partNumber', '', { shouldValidate: true });
    setPartExists(null);
  }, [isLoadingPart, isStatusPart, partData, setValue]);

  useEffect(() => {
    if (!partData?.partCode || isLoadingPart || !isStatusPart) return;

    let cancelled = false;
    (async () => {
      const result = await checkPartHasChronoanalysis(partCode);
      if (cancelled) return;
      if (!result.status) {
        setPartExists(null);
        return;
      }
      setPartExists(result.exists);

      setValue('timingType', undefined as unknown as TimingType, {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      });
      clearErrors('timingType');
    })();

    return () => {
      cancelled = true;
    };
  }, [partData, isLoadingPart, isStatusPart, partCode, setValue, clearErrors]);

  const employeeReady =
    Boolean(employeeData) &&
    isStatusEmployee &&
    !isLoadingEmployee &&
    !isEmployeeDisabled;

  const canSubmit =
    isValid &&
    employeeReady &&
    isStatusSector &&
    Boolean(sectorData) &&
    isStatusPart &&
    Boolean(partData) &&
    partExists !== null;

  async function onSubmit(data: TypeChronoanalysisRequestData) {
    if (!employeeReady || !employeeData) {
      toast.error('Informe um colaborador válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createChronoanalysisRequest({
        employeeCardNumber: data.employeeCardNumber,
        employeeUnit: data.employeeUnit,
        employeeEmail: data.employeeEmail.trim(),
        sectorId: data.sectorId,
        sectorName: data.sectorName,
        sectorCostCenter: data.sectorCostCenter,
        internalCode: data.internalCode,
        partNumber: data.partNumber,
        operation: data.operation,
        manufacturingStartDate: data.manufacturingStartDate,
        chronoanalysisType: mapTypeOfChronoanalysisToDb(
          data.typeOfChronoanalysis,
        ),
        productionTime: data.productionTime,
        timingType: data.timingType,
        observation: data.observation?.trim() || null,
      });

      if (!result.status || !result.data) {
        toast.error(result.message);
        return;
      }

      navigate(`/ticket/${result.data.id}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  function selectTiming(value: TimingType) {
    if (partExists === true && value === 'FIRST_CRON') return;
    if (partExists === false && value === 'TIME_REVIEW') return;
    setValue('timingType', value, { shouldValidate: true });
  }

  return (
    <main className='min-h-svh bg-muted'>
      <header className='border-b border-border bg-white px-3 py-3 sm:px-4 lg:px-6'>
        <div className='flex w-full items-center gap-3'>
          <Icon svg={logoComplete} className='h-8 w-auto sm:h-10' />
        </div>
      </header>

      <section className='w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6'>
        <Text as='h1' variant='title' className='mb-1 block sm:mb-2'>
          Solicitar cronoanálise
        </Text>
        <Text
          as='p'
          variant='little-text'
          className='mb-4 block text-secondary sm:mb-6'
        >
          Preencha as informações para abrir uma nova solicitação de
          cronoanálise.
        </Text>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-3 sm:space-y-5'>
          <Card text='Identificação do solicitante' className='flex flex-col bg-white'>
            <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:gap-4'>
              <Label title='Cartão' className='relative w-full sm:max-w-[14rem]'>
                <CheckRequestStatus
                  data={employeeData}
                  loading={isLoadingEmployee}
                  status={isStatusEmployee}
                  disabled={isEmployeeDisabled}
                >
                  <div className='flex w-full items-center gap-0.5'>
                    <Button
                      type='button'
                      size=' md-desk'
                      className='h-9 w-9 shrink-0 p-0 text-sm'
                      variant={
                        employeeUnit === 'PEDERTRACTOR'
                          ? 'select-blue'
                          : 'default'
                      }
                      onClick={() =>
                        setValue('employeeUnit', 'PEDERTRACTOR', {
                          shouldValidate: true,
                        })
                      }
                    >
                      P
                    </Button>
                    <Button
                      type='button'
                      size=' md-desk'
                      className='h-9 w-9 shrink-0 p-0 text-sm'
                      variant={
                        employeeUnit === 'TRACTOR' ? 'select-blue' : 'default'
                      }
                      onClick={() =>
                        setValue('employeeUnit', 'TRACTOR', {
                          shouldValidate: true,
                        })
                      }
                    >
                      T
                    </Button>
                    <Input
                      disabled={!employeeUnit}
                      maxLength={4}
                      inputMode='numeric'
                      placeholder='ex: 0072'
                      {...register('employeeCardNumber')}
                    />
                  </div>
                </CheckRequestStatus>
                {errors.employeeCardNumber && (
                  <span className='text-xs text-red-500'>
                    {errors.employeeCardNumber.message}
                  </span>
                )}
                {errors.employeeUnit && (
                  <span className='text-xs text-red-500'>
                    {errors.employeeUnit.message}
                  </span>
                )}
              </Label>
              <Label title='Nome' className='w-full'>
                <Input
                  disabled
                  value={employeeData?.name ?? ''}
                  placeholder='Preenchido após validar o cartão'
                />
              </Label>
            </div>
            <Label title='E-mail' className='mt-3 w-full sm:mt-4'>
              <Input
                type='email'
                disabled={!employeeReady}
                placeholder={
                  employeeReady
                    ? 'ex: nome.sobrenome@ptractor.com.br'
                    : 'Disponível após validar o cartão'
                }
                autoComplete='email'
                {...register('employeeEmail')}
              />
              {errors.employeeEmail && (
                <span className='text-xs text-red-500'>
                  {errors.employeeEmail.message}
                </span>
              )}
            </Label>
          </Card>

          <Card text='Informações do setor' className='flex bg-white'>
            <div className='flex w-full flex-col gap-2 sm:flex-row sm:gap-4'>
              <Label
                title='Centro de custo'
                className='relative sm:max-w-[8rem]'
              >
                <CheckRequestStatus
                  data={sectorData}
                  status={isStatusSector}
                  loading={isLoadingSector}
                >
                  <Input
                    {...register('sectorCostCenter')}
                    maxLength={4}
                    inputMode='numeric'
                    placeholder='ex: 7051'
                  />
                </CheckRequestStatus>
                {errors.sectorCostCenter && (
                  <span className='text-xs text-red-500'>
                    {errors.sectorCostCenter.message}
                  </span>
                )}
              </Label>
              <Label title='Setor' className='w-full'>
                <Input {...register('sectorName')} disabled />
              </Label>
            </div>
          </Card>

          <Card text='Informações do componente' className='flex flex-col bg-white'>
            <div className='flex w-full flex-col gap-2 sm:flex-row sm:gap-4'>
              <Label title='Código interno' className='relative w-full'>
                <CheckRequestStatus
                  data={partData}
                  status={isStatusPart}
                  loading={isLoadingPart}
                >
                  <Input
                    {...register('internalCode')}
                    maxLength={10}
                    inputMode='numeric'
                  />
                </CheckRequestStatus>
                {errors.internalCode && (
                  <span className='text-xs text-red-500'>
                    {errors.internalCode.message}
                  </span>
                )}
              </Label>
              <Label title='Part number' className='w-full'>
                <Input {...register('partNumber')} disabled />
              </Label>
            </div>
          </Card>

          <Card text='Detalhes da solicitação' className='flex flex-col gap-3 bg-white'>
            <div className='flex w-full flex-col gap-2 sm:flex-row sm:gap-4'>
              <Label title='Operação' className='w-full'>
                <Input {...register('operation')} placeholder='ex: 10' />
                {errors.operation && (
                  <span className='text-xs text-red-500'>
                    {errors.operation.message}
                  </span>
                )}
              </Label>
              <Label title='Data início de fabricação' className='w-full'>
                <DatePickerSingle
                  value={watch('manufacturingStartDate')}
                  onChange={(date) =>
                    setValue('manufacturingStartDate', date, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  aria-invalid={!!errors.manufacturingStartDate}
                />
                {errors.manufacturingStartDate && (
                  <span className='text-xs text-red-500'>
                    {errors.manufacturingStartDate.message}
                  </span>
                )}
              </Label>
            </div>

            <Label title='Tipo de cronoanálise' className='flex w-full flex-col'>
              <div className='mb-1 flex flex-wrap gap-2'>
                {(
                  [
                    ['welding', 'soldagem'],
                    ['montage', 'montagem'],
                    ['bend', 'dobra'],
                    ['machining', 'usinagem'],
                    ['prepPainting', 'prep. pintura'],
                    ['repasseRosca', 'repasse de rosca'],
                  ] as const
                ).map(([value, label]) => (
                  <Button
                    key={value}
                    type='button'
                    size=' md-desk'
                    className='min-w-[6rem] flex-1 py-2 text-xs sm:min-w-[8rem] sm:py-2.5 sm:text-sm'
                    variant={typeOfChron === value ? 'select-blue' : 'default'}
                    onClick={() =>
                      setValue('typeOfChronoanalysis', value, {
                        shouldValidate: true,
                      })
                    }
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </Label>

            <Label title='Tempo de produção' className='w-full'>
              <div className='flex w-full items-center gap-1'>
                <Button
                  type='button'
                  size=' md-desk'
                  className='w-full py-2 text-xs sm:py-2.5 sm:text-sm'
                  variant={
                    productionTime === 'UNDER_3H' ? 'select-blue' : 'default'
                  }
                  onClick={() =>
                    setValue('productionTime', 'UNDER_3H', {
                      shouldValidate: true,
                    })
                  }
                >
                  Inferior a 3h
                </Button>
                <Button
                  type='button'
                  size=' md-desk'
                  className='w-full py-2 text-xs sm:py-2.5 sm:text-sm'
                  variant={
                    productionTime === 'OVER_3H' ? 'select-blue' : 'default'
                  }
                  onClick={() =>
                    setValue('productionTime', 'OVER_3H', {
                      shouldValidate: true,
                    })
                  }
                >
                  Superior a 3h
                </Button>
              </div>
              {errors.productionTime && (
                <span className='text-xs text-red-500'>
                  {errors.productionTime.message}
                </span>
              )}
            </Label>

            <div className='flex w-full flex-col gap-0.5 sm:gap-1'>
              <Text as='p' variant='text-label'>
                Tipo de cronometragem
              </Text>
              <TimingTypeSelector
                value={timingType}
                partExists={partExists}
                onSelect={selectTiming}
              />
              {isSubmitted && errors.timingType && (
                <span className='text-xs text-red-500'>
                  {errors.timingType.message}
                </span>
              )}
            </div>

            <Label title='Observação' className='w-full'>
              <textarea
                className='min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50'
                {...register('observation')}
                placeholder='Opcional'
              />
            </Label>
          </Card>

          <div className='flex flex-col gap-2 pt-1 sm:flex-row sm:justify-end'>
            <Button
              type='submit'
              variant='blue'
              disabled={!canSubmit || isSubmitting}
              className='w-full sm:w-[180px]'
            >
              {isSubmitting ? 'Enviando...' : 'Enviar solicitação'}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default RequestChronoanalysisPage;

import Text from '../../components/ui/text';
import Card from '../../components/ui/card/card';
import Input from '../../components/ui/input';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  initialInformationsSchema,
  type TypeInitialInformationsData,
} from '../../zod/schema-chronoanalysis';
import { v4 as uuidv4 } from 'uuid';
import {
  type RegisterPresetActivities,
} from '../../db/db';
import Select from '../../components/ui/select-native';
import { clients } from '../../seed/seed-client';
import { useNavigate, useSearchParams } from 'react-router';
import ListActivities from '../../components/list-activities';
import { syncPresetActivitiesFromType } from '../../db/sync-preset-activities';
import { verifyUuidRegister } from '@/api/chronoanalysis-api';
import {
  discardChronoanalysisDraft,
  hasRemoteChronoanalysisDraft,
  initChronoanalysisSession,
} from '../../db/db-functions';
import { toast } from 'sonner';
import Button from '@/components/ui/button/button';
import Label from '@/components/ui/label/label';
import { useParts } from '@/hooks/use-parts';
import CheckRequestStatus from '@/components/check-request-status';
import { useSector } from '@/hooks/use-sectors';
import ModalImage from '@/components/modal-image';
import ModalCancelChronoanalysis from '@/components/modal-cancel-chronoanalysis';
import { Images } from 'lucide-react';
import { useOf } from '@/hooks/use-of';
import AddChronoanalysisEmployee, {
  EmployeeProps,
} from '@/components/add-chronoanalysis-employees';
import CounterParts from '@/components/counter-parts';
import { getChronoanalysisRequest } from '@/api/chronoanalysis-request-api';
import { mapTypeOfChronoanalysisFromDb } from '@/constants/chronoanalysis-types';
import {
  PRODUCTION_TIME_LABELS,
  type ChronoanalysisRequestItem,
  type ProductionTime,
} from '@/types/chronoanalysis-request-types';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

const PENDING_FIELD_CLASS =
  'border-background-orange ring-2 ring-background-orange/35 bg-background-orange/5';

const RegisterInitialInformationsPage = () => {
  const [pinedActivities, setPinedActivities] = useState<
    RegisterPresetActivities[]
  >([]);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [employeeList, setEmployeeList] = useState<EmployeeProps[]>([]);
  const [numberOfParts, setNumberOfParts] = useState<number>(1);
  const [linkedRequest, setLinkedRequest] =
    useState<ChronoanalysisRequestItem | null>(null);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [sopConfirmed, setSopConfirmed] = useState(false);
  const [partsConfirmed, setPartsConfirmed] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestIdFromQuery = searchParams.get('requestId');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<TypeInitialInformationsData>({
    resolver: zodResolver(initialInformationsSchema),
    mode: 'onChange',
    defaultValues: {
      sectorName: '',
      clientId: '',
      sop: false,
      typeOfChronoanalysis: 'welding',
      isKaizen: false,
      isRequest: false,
      firstCron: true,
    },
  });

  const costCenter = watch('sectorCostCenter');
  const partCode = watch('internalCode');
  const manufacturingOrder = watch('of');
  const revision = watch('revision');
  const clientId = watch('clientId');
  const sop = watch('sop');
  const typeOfChron = watch('typeOfChronoanalysis');
  const isKaizen = watch('isKaizen');
  const numberKaizen = watch('numberKaizen');
  const isRequest = watch('isRequest');
  const firstCron = watch('firstCron');

  const fromRequest = !!linkedRequest;
  const highlightEmployees = fromRequest && employeeList.length === 0;
  const highlightRevision = fromRequest && !revision?.trim();
  const highlightOf = fromRequest && !manufacturingOrder?.trim();
  const highlightClient = fromRequest && !clientId?.trim();
  const highlightNumberKaizen =
    fromRequest && isKaizen && !numberKaizen?.toString().trim();
  const highlightSop = fromRequest && !sopConfirmed;
  const highlightParts = fromRequest && !partsConfirmed;

  const { partData, isLoading, isStatus } = useParts(partCode);

  const {
    sectorData,
    isLoading: isLoadingSector,
    isStatus: isStatusSector,
  } = useSector(costCenter);

  const {
    isLoading: isLoadingOf,
    isStatus: isStatusOf,
    ofData,
  } = useOf(manufacturingOrder);

  useEffect(() => {
    if (!requestIdFromQuery) return;

    let cancelled = false;
    setLoadingRequest(true);

    (async () => {
      const result = await getChronoanalysisRequest(requestIdFromQuery);
      if (cancelled) return;
      setLoadingRequest(false);

      if (!result.status || !result.data) {
        toast.error(result.message ?? 'Não foi possível carregar a solicitação.');
        return;
      }

      const req = result.data;
      setLinkedRequest(req);
      setSopConfirmed(false);
      setPartsConfirmed(false);

      setValue('sectorCostCenter', req.sectorCostCenter, {
        shouldValidate: true,
      });
      setValue('sectorName', req.sectorName, { shouldValidate: true });
      setValue('sectorId', req.sectorId, { shouldValidate: true });
      setValue('internalCode', req.internalCode, { shouldValidate: true });
      setValue('partNumber', req.partNumber, { shouldValidate: true });
      setValue('op', req.operation, { shouldValidate: true });
      setValue(
        'typeOfChronoanalysis',
        mapTypeOfChronoanalysisFromDb(req.chronoanalysisType),
        { shouldValidate: true },
      );
      setValue('isRequest', true, { shouldValidate: true });
      setValue('isKaizen', req.timingType === 'KAIZEN', {
        shouldValidate: true,
      });
      setValue('firstCron', req.timingType === 'FIRST_CRON', {
        shouldValidate: true,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [requestIdFromQuery, setValue]);

  useEffect(() => {
    if (isStatus && partData && !isLoading)
      return setValue('partNumber', partData.partNumber, {
        shouldValidate: true,
      });

    setValue('partNumber', '', { shouldValidate: true });
  }, [isLoading, isStatus, partData, setValue]);

  useEffect(() => {
    if (!isStatusSector) {
      setValue('sectorName', '', { shouldValidate: true });
      setValue('sectorId', undefined, { shouldValidate: true });
    }
    if (!isLoadingSector && isStatusSector && sectorData) {
      setValue('sectorId', +sectorData.id, { shouldValidate: true });
      setValue('sectorName', sectorData.name, { shouldValidate: true });
    }
  }, [isLoadingSector, isStatusSector, sectorData, setValue]);

  useEffect(() => {
    const syncAndListActivities = async () => {
      if (!typeOfChron) {
        setPinedActivities([]);
        return;
      }

      try {
        const presets = await syncPresetActivitiesFromType(typeOfChron);
        setPinedActivities(presets);
      } catch (error) {
        setPinedActivities([]);
        toast.error(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar as atividades. Verifique a conexão.',
        );
      }
    };

    void syncAndListActivities();
  }, [typeOfChron]);

  const handleAddInitialInformations = async (
    data: TypeInitialInformationsData,
  ) => {
    const remoteDraft = await hasRemoteChronoanalysisDraft();
    if (remoteDraft) {
      const replace = window.confirm(
        'Já existe uma cronoanálise em andamento. Deseja substituir pelo novo registro?',
      );
      if (!replace) return;
    }

    let uuIdRegisterChronoanalysis = uuidv4();
    let verifyResult = await verifyUuidRegister(uuIdRegisterChronoanalysis);

    while (verifyResult.result === 'taken') {
      uuIdRegisterChronoanalysis = uuidv4();
      verifyResult = await verifyUuidRegister(uuIdRegisterChronoanalysis);
    }

    if (verifyResult.result === 'error') {
      toast.error(verifyResult.message);
      return;
    }

    const registerData = {
      id: uuIdRegisterChronoanalysis,
      employees: employeeList,
      howManyParts: numberOfParts,
      sectorId: data.sectorId ? data.sectorId : 0,
      sectorName: data.sectorName ? data.sectorName : '',
      sectorCostCenter: data.sectorCostCenter ? data.sectorCostCenter : '',
      clientId: +data.clientId,
      of: data.of,
      op: data.op,
      sop: data.sop,
      revision: data.revision,
      internalCode: data.internalCode,
      partNumber: data.partNumber,
      typeOfChronoanalysis: data.typeOfChronoanalysis,
      isRequest: data.isRequest,
      firstCron: data.firstCron,
      isKaizen: data.isKaizen,
      numberKaizen: data.numberKaizen,
      requestId: linkedRequest?.id,
      manufacturingStartDate: linkedRequest?.manufacturingStartDate,
      productionTime: linkedRequest?.productionTime,
    };

    try {
      await initChronoanalysisSession(registerData);
      navigate('/cronoanalise/atividades', {
        replace: true,
      });
    } catch {
      toast.error('Erro ao salvar rascunho localmente.');
    }
  };

  async function handleConfirmCancel() {
    setIsCanceling(true);
    try {
      await discardChronoanalysisDraft();
      setOpenCancelModal(false);
      navigate('/');
    } finally {
      setIsCanceling(false);
    }
  }

  return (
    <section className=''>
      {isOpenImage ? (
        <ModalImage
          openModal={isOpenImage}
          setOpenModal={setIsOpenImage}
          partData={partData}
        />
      ) : (
        <>
          <Text variant={'title'} className='mb-3 sm:mb-4'>
            Nova cronoanálise
          </Text>
          {loadingRequest && (
            <p className='mb-3 text-sm text-secondary'>
              Carregando dados da solicitação...
            </p>
          )}
          {linkedRequest && (
            <div className='mb-3 rounded-lg border border-background-base-blue bg-background-base-blue/40 px-3 py-2 text-sm sm:mb-4'>
              <p className='font-semibold text-initial'>
                Origem: solicitação{' '}
                <span className='font-mono text-xs'>
                  {linkedRequest.id.slice(0, 8)}
                </span>
              </p>
              <p className='mt-1 text-secondary'>
                Solicitante: {linkedRequest.employeeName}
                {linkedRequest.employeeCardNumber
                  ? ` · Cartão ${linkedRequest.employeeCardNumber}`
                  : ''}
              </p>
              <p className='mt-1 text-secondary'>
                Fabricação:{' '}
                {format(
                  parseISO(linkedRequest.manufacturingStartDate),
                  'dd/MM/yyyy',
                )}{' '}
                · Tempo:{' '}
                {
                  PRODUCTION_TIME_LABELS[
                    linkedRequest.productionTime as ProductionTime
                  ]
                }
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit(handleAddInitialInformations)}>
            <AddChronoanalysisEmployee
              employeeList={employeeList}
              setEmployeeList={setEmployeeList}
              highlightPending={highlightEmployees}
            />
            <Card text='Informações do setor' className='mt-3 flex sm:mt-5'>
              <div className='flex w-full flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center sm:gap-4'>
                <Label title='Centro de custo' className='relative sm:h-25 sm:max-w-[8rem]'>
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
                    <span className='text-red-500 text-xs sm:absolute sm:bottom-0 sm:left-0 sm:text-sm'>
                      {errors.sectorCostCenter.message}
                    </span>
                  )}
                </Label>
                <Label
                  title='Setor de execução'
                  className='relative w-full sm:h-25 sm:w-4/5'
                >
                  <Input {...register('sectorName')} disabled />
                </Label>
              </div>
            </Card>
            <Card
              text='Informações do componente'
              className='relative my-3 flex sm:my-5 [&>h2]:pr-11 sm:[&>h2]:pr-0'
            >
              <Button
                onClick={() => setIsOpenImage(!isOpenImage)}
                type='button'
                disabled={!isStatus || isLoading || !partData ? true : false}
                variant={`${
                  isStatus && !isLoading && partData ? 'blue' : 'default'
                }`}
                svg={Images}
                className='absolute right-2 top-2 !size-9 rounded-lg p-0 sm:right-3 sm:top-3 sm:!size-11 [&_svg]:!size-4 sm:[&_svg]:!size-5'
              />
              <div className='flex w-full flex-col gap-2 sm:gap-4'>
                <div className='flex w-full flex-col gap-2 sm:flex-row sm:gap-4'>
                  <Label title='Código interno' className=' relative '>
                    <CheckRequestStatus
                      data={partData}
                      status={isStatus}
                      loading={isLoading}
                    >
                      <Input
                        {...register('internalCode')}
                        maxLength={10}
                        inputMode='numeric'
                      />
                    </CheckRequestStatus>
                    {errors.internalCode && (
                      <span className='text-red-500 text-xs sm:text-sm'>
                        {errors.internalCode.message}
                      </span>
                    )}
                  </Label>
                  <Label title='Part number'>
                    <Input {...register('partNumber')} disabled />
                  </Label>
                </div>
                <div className='flex w-full flex-col gap-2 sm:flex-row sm:gap-4 sm:[&>label]:w-1/2'>
                  <Label title='Revisão'>
                    <Input
                      {...register('revision')}
                      className={cn(highlightRevision && PENDING_FIELD_CLASS)}
                    />
                    {errors.revision && (
                      <span className='text-red-500 text-xs sm:text-sm'>
                        {errors.revision.message}
                      </span>
                    )}
                  </Label>
                  <CounterParts
                    numberOfParts={numberOfParts}
                    setNumberOfParts={(value) => {
                      setPartsConfirmed(true);
                      setNumberOfParts(value);
                    }}
                    highlightPending={highlightParts}
                  />
                </div>
              </div>
            </Card>
            <Card text='Informações extras' className='flex'>
              <div className='flex flex-col gap-4 w-full'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                  <Label title='Ordem de fabricação (OF)' className='relative'>
                    <CheckRequestStatus
                      data={ofData}
                      status={isStatusOf}
                      loading={isLoadingOf}
                    >
                      <Input
                        {...register('of')}
                        className={cn(highlightOf && PENDING_FIELD_CLASS)}
                      />
                    </CheckRequestStatus>
                    {errors.of && (
                      <span className='text-red-500 text-xs sm:text-sm'>
                        {errors.of.message}
                      </span>
                    )}
                  </Label>
                  <Label title='Operação (OP)'>
                    <Input {...register('op')} />
                    {errors.op && (
                      <span className='text-red-500 text-xs sm:text-sm'>
                        {errors.op.message}
                      </span>
                    )}
                  </Label>
                </div>

                <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                  <Label title='Existe procedimento operacional padrão (SOP)?'>
                    <div
                      className={cn(
                        'flex w-full items-center gap-1 rounded-md',
                        highlightSop && PENDING_FIELD_CLASS,
                        highlightSop && 'p-1',
                      )}
                    >
                      <Button
                        size={' md-desk'}
                        className='w-full py-2 text-xs sm:py-2.5 sm:text-sm'
                        type='button'
                        variant={`${sop ? 'select-blue' : 'default'}`}
                        onClick={() => {
                          setValue('sop', true);
                          setSopConfirmed(true);
                        }}
                      >
                        sim
                      </Button>
                      <Button
                        size={' md-desk'}
                        className='w-full py-2 text-xs sm:py-2.5 sm:text-sm'
                        type='button'
                        variant={`${!sop ? 'select-blue' : 'default'}`}
                        onClick={() => {
                          setValue('sop', false);
                          setSopConfirmed(true);
                        }}
                      >
                        não
                      </Button>
                    </div>
                    {errors.sop && (
                      <span className='text-red-500 text-xs sm:text-sm'>
                        {errors.sop.message}
                      </span>
                    )}
                  </Label>
                  <Label title='Cliente'>
                    <Select
                      name='clientId'
                      control={control}
                      listOptions={clients}
                      placeholder='escolha um cliente'
                      showEmptyOption={false}
                      className={cn(highlightClient && PENDING_FIELD_CLASS)}
                    />
                    {errors.clientId && (
                      <span className='text-red-500 text-xs sm:text-sm'>
                        {errors.clientId.message}
                      </span>
                    )}
                  </Label>
                </div>
                <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                  <Label title='É uma cronoanálise para Kaizen?'>
                    <div className=' flex items-center gap-1 w-full'>
                      <Button
                        size={' md-desk'}
                        className='w-full py-2 text-xs sm:py-2.5 sm:text-sm'
                        type='button'
                        variant={`${isKaizen ? 'select-blue' : 'default'}`}
                        onClick={() => setValue('isKaizen', true)}
                      >
                        sim
                      </Button>
                      <Button
                        size={' md-desk'}
                        className='w-full py-2 text-xs sm:py-2.5 sm:text-sm'
                        type='button'
                        variant={`${!isKaizen ? 'select-blue' : 'default'}`}
                        onClick={() => setValue('isKaizen', false)}
                      >
                        não
                      </Button>
                    </div>
                    {errors.isKaizen && (
                      <span className='text-red-500 text-xs sm:text-sm'>
                        {errors.isKaizen.message}
                      </span>
                    )}
                  </Label>
                  {isKaizen && (
                    <Label title='Número do Kaizen'>
                      <Input
                        {...register('numberKaizen')}
                        className={cn(
                          highlightNumberKaizen && PENDING_FIELD_CLASS,
                        )}
                      />
                      {errors.op && (
                        <span className='text-red-500 text-xs sm:text-sm'>
                          {errors.op.message}
                        </span>
                      )}
                    </Label>
                  )}
                </div>
                <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                  <Label title='É uma requisição?'>
                    <div className=' flex items-center gap-1 w-full'>
                      <Button
                        size={' md-desk'}
                        className='w-full py-2 text-xs sm:py-2.5 sm:text-sm'
                        type='button'
                        variant={`${isRequest ? 'select-blue' : 'default'}`}
                        onClick={() => setValue('isRequest', true)}
                      >
                        sim
                      </Button>
                      <Button
                        size={' md-desk'}
                        className='w-full py-2 text-xs sm:py-2.5 sm:text-sm'
                        type='button'
                        variant={`${!isRequest ? 'select-blue' : 'default'}`}
                        onClick={() => setValue('isRequest', false)}
                      >
                        não
                      </Button>
                    </div>
                    {errors.isRequest && (
                      <span className='text-red-500 text-xs sm:text-sm'>
                        {errors.isRequest.message}
                      </span>
                    )}
                  </Label>
                  <Label title='É a primeira cronoanálise dessa peça?'>
                    <div className=' flex items-center gap-1 w-full'>
                      <Button
                        size={' md-desk'}
                        className='w-full py-2 text-xs sm:py-2.5 sm:text-sm'
                        type='button'
                        variant={`${firstCron ? 'select-blue' : 'default'}`}
                        onClick={() => setValue('firstCron', true)}
                      >
                        sim
                      </Button>
                      <Button
                        size={' md-desk'}
                        className='w-full py-2 text-xs sm:py-2.5 sm:text-sm'
                        type='button'
                        variant={`${!firstCron ? 'select-blue' : 'default'}`}
                        onClick={() => setValue('firstCron', false)}
                      >
                        não
                      </Button>
                    </div>
                    {errors.firstCron && (
                      <span className='text-red-500 text-xs sm:text-sm'>
                        {errors.firstCron.message}
                      </span>
                    )}
                  </Label>
                </div>
              </div>
            </Card>
            <Card text='Preset das atividades' className='mt-3 flex flex-col sm:mt-5'>
              <Label title='Tipo de cronoanálise' className=' flex w-full'>
                <div className=' flex flex-wrap gap-2 mb-3'>
                  <Button
                    size={' md-desk'}
                        className='w-full flex-1 py-2 text-xs min-w-[6rem] sm:min-w-[8rem] sm:py-2.5 sm:text-sm'
                    type='button'
                    variant={`${
                      typeOfChron === 'welding' ? 'select-blue' : 'default'
                    }`}
                    onClick={() => setValue('typeOfChronoanalysis', 'welding')}
                  >
                    soldagem
                  </Button>
                  <Button
                    size={' md-desk'}
                        className='w-full flex-1 py-2 text-xs min-w-[6rem] sm:min-w-[8rem] sm:py-2.5 sm:text-sm'
                    type='button'
                    variant={`${
                      typeOfChron === 'montage' ? 'select-blue' : 'default'
                    }`}
                    onClick={() => setValue('typeOfChronoanalysis', 'montage')}
                  >
                    montagem
                  </Button>
                  <Button
                    size={' md-desk'}
                        className='w-full flex-1 py-2 text-xs min-w-[6rem] sm:min-w-[8rem] sm:py-2.5 sm:text-sm'
                    type='button'
                    variant={`${
                      typeOfChron === 'bend' ? 'select-blue' : 'default'
                    }`}
                    onClick={() => setValue('typeOfChronoanalysis', 'bend')}
                  >
                    dobra
                  </Button>
                  <Button
                    size={' md-desk'}
                        className='w-full flex-1 py-2 text-xs min-w-[6rem] sm:min-w-[8rem] sm:py-2.5 sm:text-sm'
                    type='button'
                    variant={`${
                      typeOfChron === 'machining' ? 'select-blue' : 'default'
                    }`}
                    onClick={() =>
                      setValue('typeOfChronoanalysis', 'machining')
                    }
                  >
                    usinagem
                  </Button>
                  <Button
                    size={' md-desk'}
                        className='w-full flex-1 py-2 text-xs min-w-[6rem] sm:min-w-[8rem] sm:py-2.5 sm:text-sm'
                    type='button'
                    variant={`${
                      typeOfChron === 'prepPainting'
                        ? 'select-blue'
                        : 'default'
                    }`}
                    onClick={() =>
                      setValue('typeOfChronoanalysis', 'prepPainting')
                    }
                  >
                    prep. pintura
                  </Button>
                  <Button
                    size={' md-desk'}
                        className='w-full flex-1 py-2 text-xs min-w-[6rem] sm:min-w-[8rem] sm:py-2.5 sm:text-sm'
                    type='button'
                    variant={`${
                      typeOfChron === 'repasseRosca'
                        ? 'select-blue'
                        : 'default'
                    }`}
                    onClick={() =>
                      setValue('typeOfChronoanalysis', 'repasseRosca')
                    }
                  >
                    repasse de rosca
                  </Button>
                </div>
              </Label>
              <ListActivities activities={pinedActivities} />
            </Card>
            <div className='flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 w-full sm:justify-end items-stretch sm:items-center mt-5'>
              <Button
                variant={'red'}
                size={'md'}
                type='button'
                className='w-full sm:w-[140px]'
                onClick={() => setOpenCancelModal(true)}
              >
                cancelar
              </Button>
              <Button
                disabled={!isValid || (isKaizen && !numberKaizen)}
                variant={`${
                  !isValid || (isKaizen && !numberKaizen) ? 'default' : 'blue'
                }`}
                size={'md'}
                type='submit'
                className='w-full sm:w-[140px]'
              >
                iniciar
              </Button>
            </div>
          </form>
          <ModalCancelChronoanalysis
            open={openCancelModal}
            setOpen={setOpenCancelModal}
            isLoading={isCanceling}
            onConfirm={handleConfirmCancel}
          />
        </>
      )}
    </section>
  );
};

export default RegisterInitialInformationsPage;

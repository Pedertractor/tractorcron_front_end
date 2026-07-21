import { useEffect, useState } from 'react';
import Card from '../../components/ui/card/card';
import Text from '../../components/ui/text';

import PlayIconComponent from '../../assets/icons/play-icon.svg?react';
import EndIconComponent from '../../assets/icons/check-icon.svg?react';
import {
  initialInformationsSchema,
  type TypeInitialInformationsData,
} from '../../zod/schema-chronoanalysis';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  clearLocalChronoanalysisDb,
  discardChronoanalysisDraft,
  flushChronoanalysisDraft,
  handleGetRegister,
  listActivities,
  setChronoanalysisStage,
} from '../../db/db-functions';
import type { RegisterActivities } from '../../db/db';
import Select from '../../components/ui/select-native';
import Input from '../../components/ui/input';
import { clients } from '../../seed/seed-client';
import TableActivities from '../../components/table-activities';
import TableActivitiesMobile from '../../components/table-activities-mobile';
import LabelActivitieInfo from '../../components/label-activities-info';
import Modal from '../../components/ui/modal';
import ModalCancelChronoanalysis from '@/components/modal-cancel-chronoanalysis';
import WorkPaceAssessment, {
  type DataWorkPaceProps,
} from '../../components/work-pace-assessment';
import type { PropsChronoanalysis } from '../../types/chronoanalysis-types';
import { mapTypeOfChronoanalysisToDb } from '@/constants/chronoanalysis-types';
import type { PropsActivities } from '../../types/activities-types';
import {
  deleteChronoanalysisDraft,
  registerNewChronoanalysis,
} from '../../api/chronoanalysis-api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useChronoanalysisSessionGuard } from '@/hooks/use-chronoanalysis-session-guard';
import { useChronoanalysisUnloadGuard } from '@/hooks/use-chronoanalysis-unload-guard';
import Label from '@/components/ui/label/label';
import Button from '@/components/ui/button/button';
import { useParts } from '@/hooks/use-parts';
import CheckRequestStatus from '@/components/check-request-status';
import { useSector } from '@/hooks/use-sectors';
import { useOf } from '@/hooks/use-of';
import AddChronoanalysisEmployee, {
  EmployeeProps,
} from '@/components/add-chronoanalysis-employees';
import CounterParts from '@/components/counter-parts';

const RegisterFinishInformationsPage = () => {
  const { isValidating, isValid: isSessionValid } =
    useChronoanalysisSessionGuard();
  useChronoanalysisUnloadGuard(isSessionValid);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attTable, setAttTable] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [workPaceAssessment, setWorkPaceAssessment] =
    useState<DataWorkPaceProps | null>(null);
  const [finalRegisterActivities, setFinalRegisterActivities] = useState<
    RegisterActivities[]
  >([]);
  const [employeeList, setEmployeeList] = useState<EmployeeProps[]>([]);
  const [numberOfParts, setNumberOfParts] = useState<number>(1);

  const [idRegister] = useState<string | null>(() =>
    localStorage.getItem('idRegister')
  );
  const [startTime] = useState<string | null>(() =>
    localStorage.getItem('startTime')
  );
  const [endTime] = useState<string | null>(() =>
    localStorage.getItem('endTime')
  );

  const navigate = useNavigate();

  useEffect(() => {
    setChronoanalysisStage('REVIEW');
    void flushChronoanalysisDraft('REVIEW');
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<TypeInitialInformationsData>({
    resolver: zodResolver(initialInformationsSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    const getInformationsByCron = async () => {
      const info = await handleGetRegister();
      const activities = await listActivities();
      if (activities) setFinalRegisterActivities(activities);
      if (info && info.status) {
        if (info.register) {
          setEmployeeList(info.register.employees);
          setNumberOfParts(info.register.howManyParts);
          reset({
            id: info.register.id,
            clientId: String(info.register.clientId),
            sectorId: +info.register.sectorId,
            sectorName: info.register.sectorName,
            sectorCostCenter: info.register.sectorCostCenter,
            sop: info.register.sop,
            internalCode: info.register.internalCode,
            of: info.register.of,
            op: info.register.op,
            partNumber: info.register.partNumber,
            revision: info.register.revision,
            typeOfChronoanalysis: info.register.typeOfChronoanalysis,
            isRequest: info.register.isRequest,
            firstCron: info.register.firstCron,
            isKaizen: info.register.isKaizen,
            numberKaizen: info.register.numberKaizen,
          });
        }
      }
    };
    getInformationsByCron();
  }, [reset]);

  useEffect(() => {
    if (!attTable) return;

    const updateActivities = async () => {
      const activities = await listActivities();
      if (activities) {
        setFinalRegisterActivities(activities);
      }
      setAttTable(false);
    };

    updateActivities();
  }, [attTable]);

  const costCenter = watch('sectorCostCenter');
  const partCode = watch('internalCode');
  const manufacturingOrder = watch('of');
  const sop = watch('sop');
  const isKaizen = watch('isKaizen');
  const isRequest = watch('isRequest');
  const firstCron = watch('firstCron');

  const {
    partData,
    isLoading: isLoadingPart,
    isStatus: isStatusPart,
  } = useParts(partCode);

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
    if (isStatusPart && partData && !isLoadingPart)
      return setValue('partNumber', partData.partNumber, {
        shouldValidate: true,
      });

    setValue('partNumber', '', { shouldValidate: true });
  }, [isLoadingPart, isStatusPart, partData, setValue]);

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

  async function handleSubmitInformations(data: TypeInitialInformationsData) {
    setIsLoading(true);

    if (!startTime || !endTime || !workPaceAssessment) {
      setIsLoading(false);
      toast.error(
        'Dados incompletos. Verifique horários de início/fim e avaliação de ritmo.'
      );
      return;
    }

    const incompleteActivities = finalRegisterActivities.filter(
      (activitie) =>
        !activitie.goldenZoneId ||
        !activitie.strikeZoneId ||
        !activitie.endTime
    );

    if (incompleteActivities.length > 0) {
      setIsLoading(false);
      toast.error(
        `${incompleteActivities.length} atividade(s) incompleta(s). Preencha zonas dourada e de golpe e finalize todas antes de enviar.`
      );
      return;
    }

    const { typeOfChronoanalysis, ...rest } = data;
    const chronoanalysis: PropsChronoanalysis = {
      ...rest,
      chronoanalysisType: mapTypeOfChronoanalysisToDb(typeOfChronoanalysis),
      clientId: +data.clientId,
      employees: employeeList,
      howManyParts: numberOfParts,
      enhancement: data.enhancement,
      sectorId: data.sectorId ? +data.sectorId : undefined,
      sop: data.sop ? true : false,
      startTime,
      endTime,
    };

    const activities: PropsActivities[] = finalRegisterActivities.map(
      (activitie) => ({
        registerId: activitie.registerId,
        activitieId: activitie.activitieId,
        goldenZoneId: activitie.goldenZoneId!,
        strikeZoneId: activitie.strikeZoneId!,
        startTime: activitie.startTime,
        endTime: activitie.endTime!,
      })
    );

    const finalData = {
      chronoanalysis,
      activities,
      workPaceAssessment,
    };

    if (!navigator.onLine) {
      setIsLoading(false);
      toast.warning(
        'Sem conexão com a internet, porfavor verifique antes de enviar.'
      );
      return;
    }

    const { status, error, message } = await registerNewChronoanalysis(
      finalData
    );

    if (!status) {
      setIsLoading(false);
      toast.error(error);
      return;
    }

    try {
      await deleteChronoanalysisDraft();
      await clearLocalChronoanalysisDb();
      setIsLoading(false);
      setOpenModal(false);
      toast.success(message);
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      toast.error(`Erro ao limpar banco local! ${error}`);
    }
  }

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

  if (isValidating || !isSessionValid) {
    return null;
  }

  return (
    <section className=''>
      <Text variant={'title'} className='mb-3 sm:mb-4'>
        Revisão da Cronoanálise
      </Text>
      <Card text='Identificação e tempo de cronoanálise' className='my-3 flex sm:my-5'>
        <div className='grid grid-cols-2 gap-2 md:hidden'>
          <div className='flex flex-col gap-1'>
            <Text variant='text-label'>Identificação</Text>
            <span className='truncate rounded-lg border border-border px-2 py-1.5'>
              <Text variant='little-text'>{idRegister ?? '-'}</Text>
            </span>
          </div>
          <div className='flex flex-col gap-1'>
            <Text variant='text-label'>Início</Text>
            <span className='truncate rounded-lg border border-border px-2 py-1.5'>
              <Text variant='little-text'>
                {startTime
                  ? `${new Date(startTime).toLocaleDateString()} - ${new Date(startTime).toLocaleTimeString()}`
                  : '-'}
              </Text>
            </span>
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <Text variant='text-label'>Fim</Text>
            <span className='truncate rounded-lg border border-border px-2 py-1.5'>
              <Text variant='little-text'>
                {endTime
                  ? `${new Date(endTime).toLocaleDateString()} - ${new Date(endTime).toLocaleTimeString()}`
                  : '-'}
              </Text>
            </span>
          </div>
        </div>
        <div className='hidden flex-wrap items-center gap-3 sm:gap-5 md:flex'>
          <LabelActivitieInfo text='ID' textInfo={idRegister} />
          <LabelActivitieInfo
            svg={PlayIconComponent}
            textInfo={startTime && new Date(startTime).toLocaleDateString()}
            secondTextInfo={
              startTime && new Date(startTime).toLocaleTimeString()
            }
          />
          <LabelActivitieInfo
            svg={EndIconComponent}
            textInfo={endTime && new Date(endTime).toLocaleDateString()}
            secondTextInfo={endTime && new Date(endTime).toLocaleTimeString()}
          />
        </div>
      </Card>
      <form onSubmit={handleSubmit(handleSubmitInformations)}>
        <AddChronoanalysisEmployee
          employeeList={employeeList}
          setEmployeeList={setEmployeeList}
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
            <Label title='Setor de execução' className='relative w-full sm:h-25 sm:w-4/5'>
              <Input {...register('sectorName')} disabled />
            </Label>
          </div>
        </Card>
        <Card text='Informações do componente' className='relative my-3 flex sm:my-5'>
          <div className='flex w-full flex-col gap-2 sm:gap-4'>
            <div className='flex w-full flex-col gap-2 sm:flex-row sm:gap-4'>
              <Label title='Código interno' className='relative'>
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
                  <span className='text-red-500 text-xs sm:text-sm'>
                    {errors.internalCode.message}
                  </span>
                )}
              </Label>
              <Label title='Part number'>
                <Input {...register('partNumber')} disabled />
              </Label>
            </div>
            <div className='flex w-full flex-col gap-2 sm:flex-row sm:gap-4'>
              <Label title='Revisão'>
                <Input {...register('revision')} />
                {errors.revision && (
                  <span className='text-red-500 text-xs sm:text-sm'>
                    {errors.revision.message}
                  </span>
                )}
              </Label>
              <CounterParts
                numberOfParts={numberOfParts}
                setNumberOfParts={setNumberOfParts}
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
                  <Input {...register('of')} />
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
                <div className=' flex items-center gap-1 w-full'>
                  <Button
                    size={' md-desk'}
                    className='w-full py-2 text-xs sm:py-2.5 sm:text-sm'
                    type='button'
                    variant={`${sop ? 'select-blue' : 'default'}`}
                    onClick={() => setValue('sop', true)}
                  >
                    sim
                  </Button>
                  <Button
                    size={' md-desk'}
                    className='w-full py-2 text-xs sm:py-2.5 sm:text-sm'
                    type='button'
                    variant={`${!sop ? 'select-blue' : 'default'}`}
                    onClick={() => setValue('sop', false)}
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
                  <Input {...register('numberKaizen')} />
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
        <Card text='Revisar atividades' className='my-3 sm:my-5'>
          <div className='hidden md:block'>
            <TableActivities
              allActivities={finalRegisterActivities}
              setAttTable={setAttTable}
              authFunc={false}
            />
          </div>
          <div className='md:hidden'>
            <TableActivitiesMobile
              allActivities={finalRegisterActivities}
              setAttTable={setAttTable}
              allowDelete={false}
            />
          </div>
        </Card>

        <Card text='Avaliação de ritimo de trabalho'>
          <WorkPaceAssessment
            numberOfParts={numberOfParts}
            activites={finalRegisterActivities}
            workPaceAssessmentDatas={workPaceAssessment}
            setWorkPaceAssessmentDatas={setWorkPaceAssessment}
          />
        </Card>

        <Card text='Melhorias e observações' className='my-3 sm:my-5'>
          <textarea
            {...register('enhancement')}
            rows={8}
            placeholder='Digite aqui suas observações ou melhorias...'
            className='resize-none rounded-xl border border-border p-2 text-xs text-secondary sm:text-sm md:text-base'
          />
        </Card>

        <div className='flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 w-full sm:justify-end items-stretch sm:items-center mt-5'>
          <Button
            variant={'red'}
            size={'md'}
            type='button'
            className='w-full text-sm sm:w-[140px] sm:text-base'
            onClick={() => setOpenCancelModal(true)}
          >
            cancelar
          </Button>
          <Button
            disabled={!isValid}
            variant={`${!isValid ? 'default' : 'green'}`}
            size={'md'}
            type='button'
            onClick={() => setOpenModal(true)}
            className='w-full text-sm sm:w-[140px] sm:text-base'
          >
            finalizar
          </Button>
        </div>
        <Modal
          open={openModal}
          title='Enviar informações'
          description='Ao clicar em confirmar você estará registrando todas as informações da cronoanálise'
          setOpenModal={setOpenModal}
          isLoading={isLoading}
          setConfirmModal={() => handleSubmit(handleSubmitInformations)()}
        />
        <ModalCancelChronoanalysis
          open={openCancelModal}
          setOpen={setOpenCancelModal}
          isLoading={isCanceling}
          onConfirm={handleConfirmCancel}
        />
      </form>
    </section>
  );
};

export default RegisterFinishInformationsPage;

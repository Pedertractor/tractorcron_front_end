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
  handleGetRegister,
  listActivities,
} from '../../db/db-functions';
import type { RegisterActivities } from '../../db/db';
import Select from '../../components/ui/select';
import Input from '../../components/ui/input';
import { clients } from '../../seed/seed-client';
import TableActivities from '../../components/table-activities';
import LabelActivitieInfo from '../../components/label-activities-info';
import Modal from '../../components/ui/modal';
import WorkPaceAssessment, {
  type DataWorkPaceProps,
} from '../../components/work-pace-assessment';
import type { PropsChronoanalysis } from '../../types/chronoanalysis-types';
import type { PropsActivities } from '../../types/activities-types';
import { registerNewChronoanalysis } from '../../api/chronoanalysis-api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import Label from '@/components/ui/label/label';
import Button from '@/components/ui/button/button';
import { useParts } from '@/hooks/use-parts';
import CheckRequestStatus from '@/components/check-request-status';
import { useSector } from '@/hooks/use-sectors';
import { useEmployee } from '@/hooks/use-employees';
import { useOf } from '@/hooks/use-of';

const RegisterFinishInformationsPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attTable, setAttTable] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [workPaceAssessment, setWorkPaceAssessment] =
    useState<DataWorkPaceProps | null>(null);
  const [finalRegisterActivities, setFinalRegisterActivities] = useState<
    RegisterActivities[]
  >([]);

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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
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
        if (info.register)
          reset({
            id: info.register.id,
            clientId: String(info.register.clientId),
            employeeUnit: info.register.employeeUnit,
            employeeId: info.register.employeeId,
            employeeName: info.register.employeeName,
            employeeCardNumber: info.register.employeeCardNumber,
            sectorId: +info.register.sectorId,
            sectorName: info.register.sectorName,
            sectorCostCenter: info.register.sectorCostCenter,
            sop: info.register.sop,
            internalCode: info.register.internalCode,
            of: info.register.of,
            op: info.register.op,
            partNumber: info.register.partNumber,
            revision: info.register.revision,
          });
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

  const unit = watch('employeeUnit');
  const cardNumber = watch('employeeCardNumber');
  const costCenter = watch('sectorCostCenter');
  const partCode = watch('internalCode');
  const manufacturingOrder = watch('of');
  const sop = watch('sop');

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
    employeeData,
    isLoading: isLoadingEmployee,
    isStatus: isStatusEmployee,
    isDisabled,
  } = useEmployee(unit, cardNumber);

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

  useEffect(() => {
    if (!isStatusEmployee || isDisabled) {
      setValue('employeeName', '', { shouldValidate: true });
      setValue('employeeId', undefined, { shouldValidate: true });
    }

    if (!isLoadingEmployee && isStatusEmployee && employeeData) {
      console.log('entrou', employeeData);
      setValue('employeeName', employeeData.name, { shouldValidate: true });
      setValue('employeeId', employeeData.id, { shouldValidate: true });
    }
  }, [employeeData, isDisabled, isLoadingEmployee, isStatusEmployee, setValue]);

  async function handleSubmitInformations(data: TypeInitialInformationsData) {
    setIsLoading(true);
    if (startTime && endTime && workPaceAssessment) {
      const chronoanalysis: PropsChronoanalysis = {
        ...data,
        clientId: +data.clientId,
        sectorId: data.sectorId ? +data.sectorId : undefined,
        sop: data.sop ? true : false,
        startTime,
        endTime,
      };

      const activities: PropsActivities[] = finalRegisterActivities
        .map((activitie) => {
          if (activitie.goldenZoneId && activitie.strikeZoneId)
            return {
              registerId: activitie.registerId,
              activitieId: activitie.activitieId,
              goldenZoneId: activitie.goldenZoneId,
              strikeZoneId: activitie.strikeZoneId,
              startTime: activitie.startTime,
              endTime: activitie.endTime,
            };
          return undefined;
        })
        .filter((a): a is PropsActivities => a !== undefined);

      const finalData = {
        chronoanalysis,
        activities,
        workPaceAssessment,
      };

      const isOnline = navigator.onLine;

      if (!isOnline) {
        setIsLoading(false);
        return toast.warning(
          'Sem conexão com a internet, porfavor verifique antes de enviar.'
        );
      }

      const { status, error, message } = await registerNewChronoanalysis(
        finalData
      );

      if (!status) {
        setIsLoading(false);
        toast.error(error);
      }

      if (status) {
        try {
          await clearLocalChronoanalysisDb();
          localStorage.removeItem('idRegister');
          localStorage.removeItem('endTime');
          localStorage.removeItem('startTime');

          setIsLoading(false);
          setOpenModal(false);
          toast.success(message);
          navigate('/');
        } catch (error) {
          setIsLoading(false);
          toast.error(`Erro ao limpar banco local! ${error}`);
        }
      }
    }
  }

  return (
    <section className=''>
      <Text variant={'title'}>Revisão da Cronoanálise</Text>
      <Card text='Identificação e tempo de cronoanálise' className=' my-5 flex'>
        <div className=' flex items-center gap-5'>
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
        <Card text='Informações do colaborador' className='flex mt-5'>
          <div className=' flex gap-4 w-full items-center justify-center'>
            <Label title='Cartão' className=' relative h-25'>
              <CheckRequestStatus
                data={employeeData}
                loading={isLoadingEmployee}
                status={isStatusEmployee}
                disabled={isDisabled}
              />
              <div className=' flex items-center gap-0.5 w-full'>
                <Button
                  type='button'
                  variant={`${
                    unit === 'PEDERTRACTOR' ? 'select-blue' : 'default'
                  }`}
                  onClick={() => setValue('employeeUnit', 'PEDERTRACTOR')}
                >
                  P
                </Button>
                <Button
                  type='button'
                  variant={`${unit === 'TRACTOR' ? 'select-blue' : 'default'}`}
                  onClick={() => setValue('employeeUnit', 'TRACTOR')}
                >
                  T
                </Button>
                <Input
                  disabled={!unit ? true : false}
                  className='w-full'
                  maxLength={4}
                  inputMode='numeric'
                  placeholder='ex: 0072 | ex: 5532'
                  {...register('employeeCardNumber')}
                />
              </div>
              {errors.employeeCardNumber && (
                <span className='text-red-500 text-sm absolute left-22 bottom-0 '>
                  {errors.employeeCardNumber.message}
                </span>
              )}
            </Label>
            <Label title='Nome do colaborador' className=' w-4/5 h-25'>
              <Input {...register('employeeName')} disabled />
            </Label>
          </div>
          <div className=' flex gap-4 justify-center w-full items-center'>
            <Label title='Centro de custo' className='  relative h-25'>
              <CheckRequestStatus
                data={sectorData}
                status={isStatusSector}
                loading={isLoadingSector}
              />
              <Input
                {...register('sectorCostCenter')}
                maxLength={4}
                inputMode='numeric'
                placeholder='ex: 7051'
              />
              {errors.sectorCostCenter && (
                <span className='text-red-500 text-sm absolute left-0 bottom-0 '>
                  {errors.sectorCostCenter.message}
                </span>
              )}
            </Label>
            <Label title='Setor de execução' className=' w-4/5 relative h-25'>
              <Input {...register('sectorName')} disabled />
            </Label>
          </div>
        </Card>
        <Card text='Informações do componente' className='flex my-5 relative'>
          <div className=' flex gap-4 w-full '>
            <Label title='Código interno' className='relative'>
              <CheckRequestStatus
                data={partData}
                status={isStatusPart}
                loading={isLoadingPart}
              />
              <Input
                {...register('internalCode')}
                maxLength={10}
                inputMode='numeric'
              />
              {errors.internalCode && (
                <span className='text-red-500 text-sm'>
                  {errors.internalCode.message}
                </span>
              )}
            </Label>
            <Label title='Revisão'>
              <Input {...register('revision')} />
              {errors.revision && (
                <span className='text-red-500 text-sm'>
                  {errors.revision.message}
                </span>
              )}
            </Label>
            <Label title='Part number'>
              <Input {...register('partNumber')} disabled />
            </Label>
          </div>
        </Card>
        <Card text='Informações extras' className='flex'>
          <div className=' flex gap-4 w-full flex-col '>
            <div className=' flex items-center gap-4'>
              <Label title='Ordem de fabricação (OF)' className='relative'>
                <CheckRequestStatus
                  data={ofData}
                  status={isStatusOf}
                  loading={isLoadingOf}
                />
                <Input {...register('of')} />
                {errors.of && (
                  <span className='text-red-500 text-sm'>
                    {errors.of.message}
                  </span>
                )}
              </Label>
              <Label title='Operação (OP)'>
                <Input {...register('op')} />
                {errors.op && (
                  <span className='text-red-500 text-sm'>
                    {errors.op.message}
                  </span>
                )}
              </Label>
            </div>

            <div className=' flex items-center gap-4'>
              <Label title='Existe procedimento operacional padrão (SOP)?'>
                <div className=' flex items-center gap-1 w-full'>
                  <Button
                    size={' md-desk'}
                    className=' py-2.5 w-full'
                    type='button'
                    variant={`${sop ? 'select-blue' : 'default'}`}
                    onClick={() => setValue('sop', true)}
                  >
                    sim
                  </Button>
                  <Button
                    size={' md-desk'}
                    className=' py-2.5 w-full'
                    type='button'
                    variant={`${!sop ? 'select-blue' : 'default'}`}
                    onClick={() => setValue('sop', false)}
                  >
                    não
                  </Button>
                </div>
                {errors.sop && (
                  <span className='text-red-500 text-sm'>
                    {errors.sop.message}
                  </span>
                )}
              </Label>
              <Label title='Cliente'>
                <Select
                  listOptions={clients}
                  disabled={false} //i can put loading fetch of clients
                  {...register('clientId')}
                />
                {errors.clientId && (
                  <span className='text-red-500 text-sm'>
                    {errors.clientId.message}
                  </span>
                )}
              </Label>
            </div>
          </div>
        </Card>
        <Card text='Revisar atividades' className=' my-5'>
          <TableActivities
            allActivities={finalRegisterActivities}
            setAttTable={setAttTable}
            authFunc={false}
          />
        </Card>

        <Card text='Avaliação de ritimo de trabalho'>
          <WorkPaceAssessment
            endTime={endTime}
            startTime={startTime}
            workPaceAssessmentDatas={workPaceAssessment}
            setWorkPaceAssessmentDatas={setWorkPaceAssessment}
          />
        </Card>

        <div className=' flex gap-4 w-full justify-end items-center mt-5'>
          <Button variant={'red'} size={'md'} type='button'>
            cancelar
          </Button>
          <Button
            disabled={!isValid}
            variant={`${!isValid ? 'default' : 'green'}`}
            size={'md'}
            type='button'
            onClick={() => setOpenModal(true)}
          >
            finalizar
          </Button>
        </div>
        {openModal && (
          <Modal
            title='Enviar informações'
            description='Ao clicar em confirmar você estará registrando todas as informações da cronoanálise'
            setOpenModal={setOpenModal}
            isLoading={isLoading}
            setConfirmModal={() => {}}
          />
        )}
      </form>
    </section>
  );
};

export default RegisterFinishInformationsPage;

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
import { useOf } from '@/hooks/use-of';
import AddChronoanalysisEmployee, {
  EmployeeProps,
} from '@/components/add-chronoanalysis-employees';
import CounterParts from '@/components/counter-parts';

const RegisterFinishInformationsPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attTable, setAttTable] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [workPaceAssessment, setWorkPaceAssessment] =
    useState<DataWorkPaceProps | null>(null);
  const [finalRegisterActivities, setFinalRegisterActivities] = useState<
    RegisterActivities[]
  >([]);
  const [employeeList, setEmployeeList] = useState<EmployeeProps[]>([]);
  const [numberOfParts, setNumberOfParts] = useState<number>(1);
  const [enhancement, setEnhancement] = useState<string>('');

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
            isKaizen: info.register.isKaizen,
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
    if (startTime && endTime && workPaceAssessment) {
      const chronoanalysis: PropsChronoanalysis = {
        ...data,
        clientId: +data.clientId,
        employees: employeeList,
        howManyParts: numberOfParts,
        enhancement,
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
        <AddChronoanalysisEmployee
          employeeList={employeeList}
          setEmployeeList={setEmployeeList}
        />
        <Card text='Informações do setor' className='flex mt-5'>
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
          <div className=' flex flex-col gap-4 w-full '>
            <div className=' flex gap-4 w-full'>
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
              <Label title='Part number'>
                <Input {...register('partNumber')} disabled />
              </Label>
            </div>
            <div className=' flex gap-4 w-full'>
              <Label title='Revisão'>
                <Input {...register('revision')} />
                {errors.revision && (
                  <span className='text-red-500 text-sm'>
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
            <div className=' flex items-center gap-4'>
              {/* preciso adicionar a lógica de do isKaizen para armazenar/enviar no obj */}
              <Label title='É uma cronoanálise para KAIZEN?'>
                <div className=' flex items-center gap-1 w-full'>
                  <Button
                    size={' md-desk'}
                    className=' py-2.5 w-full'
                    type='button'
                    variant={`${isKaizen ? 'select-blue' : 'default'}`}
                    onClick={() => setValue('isKaizen', true)} //não é SOP preciso criar uma prop isKaizen
                  >
                    sim
                  </Button>
                  <Button
                    size={' md-desk'}
                    className=' py-2.5 w-full'
                    type='button'
                    variant={`${!isKaizen ? 'select-blue' : 'default'}`}
                    onClick={() => setValue('isKaizen', false)}
                  >
                    não
                  </Button>
                </div>
                {errors.isKaizen && (
                  <span className='text-red-500 text-sm'>
                    {errors.isKaizen.message}
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
            numberOfParts={numberOfParts}
            activites={finalRegisterActivities}
            workPaceAssessmentDatas={workPaceAssessment}
            setWorkPaceAssessmentDatas={setWorkPaceAssessment}
          />
        </Card>

        <Card text='Melhorias e observações' className=' my-5'>
          <Label title=''>
            <textarea
              value={enhancement}
              defaultValue={''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setEnhancement(e.target.value)
              }
              rows={8}
              placeholder='Digite aqui suas observações ou melhorias...'
              className=' p-2 border border-border rounded-xl text-secondary resize-none'
            />
          </Label>
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

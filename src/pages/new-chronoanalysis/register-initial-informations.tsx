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
  dbRegisterChronoanalysis,
  type RegisterPresetActivities,
} from '../../db/db';
import Select from '../../components/ui/select';
import { clients } from '../../seed/seed-client';
import { useNavigate } from 'react-router';
import ListActivities from '../../components/list-activities';
import { changePresetActivities } from '../../db/db-functions-preset-activities';
import { seedActivities } from '../../seed/seed-activities';
import { verifyUuidRegister } from '@/api/chronoanalysis-api';
import Button from '@/components/ui/button/button';
import Label from '@/components/ui/label/label';
import { useParts } from '@/hooks/use-parts';
import CheckRequestStatus from '@/components/check-request-status';
import { useSector } from '@/hooks/use-sectors';
import ModalImage from '@/components/modal-image';
import { Images } from 'lucide-react';
import { useOf } from '@/hooks/use-of';
import AddChronoanalysisEmployee, {
  EmployeeProps,
} from '@/components/add-chronoanalysis-employees';
import CounterParts from '@/components/counter-parts';

const RegisterInitialInformationsPage = () => {
  const [pinedActivities, setPinedActivities] = useState<
    RegisterPresetActivities[]
  >([]);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [employeeList, setEmployeeList] = useState<EmployeeProps[]>([]);
  const [numberOfParts, setNumberOfParts] = useState<number>(1);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
  const sop = watch('sop');
  const typeOfChron = watch('typeOfChronoanalysis');
  const isKaizen = watch('isKaizen');
  const numberKaizen = watch('numberKaizen');
  const isRequest = watch('isRequest');
  const firstCron = watch('firstCron');

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
      setPinedActivities([]);
      if (typeOfChron === 'welding') {
        const filterWelding = seedActivities.filter(
          (activity) =>
            activity.activityType === 'SOLDAGEM' ||
            activity.activityType === 'GERAL',
        );
        setPinedActivities(filterWelding);
        await changePresetActivities(filterWelding);
      }

      if (typeOfChron === 'montage') {
        const filterMontage = seedActivities.filter(
          (activity) =>
            activity.activityType === 'MONTAGEM' ||
            activity.activityType === 'GERAL',
        );
        setPinedActivities(filterMontage);
        await changePresetActivities(filterMontage);
      }
      if (typeOfChron === 'bend') {
        const filterBeld = seedActivities.filter(
          (act) => act.activityType === 'DOBRA' || act.activityType === 'GERAL',
        );
        setPinedActivities(filterBeld);
        await changePresetActivities(filterBeld);
      }
      if (typeOfChron === 'machining') {
        const filterMachining = seedActivities.filter(
          (act) =>
            act.activityType === 'USINAGEM' || act.activityType === 'GERAL',
        );
        setPinedActivities(filterMachining);
        await changePresetActivities(filterMachining);
      }
    };

    syncAndListActivities();
  }, [typeOfChron]);

  const handleAddInitialInformations = async (
    data: TypeInitialInformationsData,
  ) => {
    let uuIdRegisterChronoanalysis = uuidv4();

    let isUuidValid = await verifyUuidRegister(uuIdRegisterChronoanalysis);

    while (!isUuidValid) {
      uuIdRegisterChronoanalysis = uuidv4();
      isUuidValid = await verifyUuidRegister(uuIdRegisterChronoanalysis);
    }

    localStorage.setItem('idRegister', uuIdRegisterChronoanalysis);

    const testInitialInformations = {
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
    };

    await dbRegisterChronoanalysis.register.add(testInitialInformations);

    navigate('/chronoanalysis/activities', {
      replace: true,
    });
  };

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
          <Text variant={'title'}>Nova cronoanálise</Text>
          <form onSubmit={handleSubmit(handleAddInitialInformations)}>
            <AddChronoanalysisEmployee
              employeeList={employeeList}
              setEmployeeList={setEmployeeList}
            />
            <Card text='Informações do setor' className='flex mt-5'>
              <div className=' flex gap-4 justify-center w-full items-center'>
                <Label title='Centro de custo' className='relative h-25'>
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
                <Label
                  title='Setor de execução'
                  className=' w-4/5 relative h-25'
                >
                  <Input {...register('sectorName')} disabled />
                </Label>
              </div>
            </Card>
            <Card
              text='Informações do componente'
              className='flex my-5 relative'
            >
              <Button
                onClick={() => setIsOpenImage(!isOpenImage)}
                type='button'
                disabled={!isStatus || isLoading || !partData ? true : false}
                variant={`${
                  isStatus && !isLoading && partData ? 'blue' : 'default'
                }`}
                svg={Images}
                className='absolute top-3 right-3 '
              />
              <div className=' flex flex-col gap-4 w-full '>
                <div className=' flex gap-4 w-full'>
                  <Label title='Código interno' className=' relative '>
                    <CheckRequestStatus
                      data={partData}
                      status={isStatus}
                      loading={isLoading}
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
                  <Label title='Ordem de fabricação (OF)' className=' relative'>
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
                      disabled={false}
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
                  <Label title='É uma cronoanálise para Kaizen?'>
                    <div className=' flex items-center gap-1 w-full'>
                      <Button
                        size={' md-desk'}
                        className=' py-2.5 w-full'
                        type='button'
                        variant={`${isKaizen ? 'select-blue' : 'default'}`}
                        onClick={() => setValue('isKaizen', true)}
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
                  {isKaizen && (
                    <Label title='Número do Kaizen'>
                      <Input {...register('numberKaizen')} />
                      {errors.op && (
                        <span className='text-red-500 text-sm'>
                          {errors.op.message}
                        </span>
                      )}
                    </Label>
                  )}
                </div>
                <div className=' flex items-center gap-4'>
                  <Label title='É uma requisição?'>
                    <div className=' flex items-center gap-1 w-full'>
                      <Button
                        size={' md-desk'}
                        className=' py-2.5 w-full'
                        type='button'
                        variant={`${isRequest ? 'select-blue' : 'default'}`}
                        onClick={() => setValue('isRequest', true)}
                      >
                        sim
                      </Button>
                      <Button
                        size={' md-desk'}
                        className=' py-2.5 w-full'
                        type='button'
                        variant={`${!isRequest ? 'select-blue' : 'default'}`}
                        onClick={() => setValue('isRequest', false)}
                      >
                        não
                      </Button>
                    </div>
                    {errors.isRequest && (
                      <span className='text-red-500 text-sm'>
                        {errors.isRequest.message}
                      </span>
                    )}
                  </Label>
                  <Label title='É a primeira cronoanálise dessa peça?'>
                    <div className=' flex items-center gap-1 w-full'>
                      <Button
                        size={' md-desk'}
                        className=' py-2.5 w-full'
                        type='button'
                        variant={`${firstCron ? 'select-blue' : 'default'}`}
                        onClick={() => setValue('firstCron', true)}
                      >
                        sim
                      </Button>
                      <Button
                        size={' md-desk'}
                        className=' py-2.5 w-full'
                        type='button'
                        variant={`${!firstCron ? 'select-blue' : 'default'}`}
                        onClick={() => setValue('firstCron', false)}
                      >
                        não
                      </Button>
                    </div>
                    {errors.firstCron && (
                      <span className='text-red-500 text-sm'>
                        {errors.firstCron.message}
                      </span>
                    )}
                  </Label>
                </div>
              </div>
            </Card>
            <Card text='Preset das atividades' className='flex flex-col mt-5'>
              <Label title='Tipo de cronoanálise' className=' flex w-full'>
                <div className=' flex gap-2 mb-3'>
                  <Button
                    size={' md-desk'}
                    className=' py-2.5 w-full'
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
                    className=' py-2.5 w-full'
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
                    className=' py-2.5 w-full'
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
                    className=' py-2.5 w-full'
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
                </div>
              </Label>
              <ListActivities activities={pinedActivities} />
            </Card>
            <div className=' flex gap-4 w-full justify-end items-center mt-5'>
              <Button variant={'red'} size={'md'} type='button'>
                cancelar
              </Button>
              <Button
                disabled={!isValid || (isKaizen && !numberKaizen)}
                variant={`${
                  !isValid || (isKaizen && !numberKaizen) ? 'default' : 'blue'
                }`}
                size={'md'}
                type='submit'
              >
                iniciar
              </Button>
            </div>
          </form>
        </>
      )}
    </section>
  );
};

export default RegisterInitialInformationsPage;

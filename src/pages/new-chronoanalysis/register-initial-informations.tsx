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
import {
  listPinedActivities,
  pinedActivitie,
  syncPresetActivities,
} from '../../db/db-functions-preset-activities';
import { seedActivities } from '../../seed/seed-activities';
import { findEmployee } from '../../api/employee-api';
import { toast } from 'sonner';
import { findSectorByCc } from '@/api/sector-api';
import { verifyUuidRegister } from '@/api/chronoanalysis-api';
import Button from '@/components/ui/button/button';
import Label from '@/components/ui/label/label';

const RegisterInitialInformationsPage = () => {
  const [pinedActivities, setPinedACtivities] = useState<
    RegisterPresetActivities[]
  >([]);
  const [attListPinedActivities, setAttListPinedActivities] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TypeInitialInformationsData>({
    resolver: zodResolver(initialInformationsSchema),
    mode: 'onChange',
    defaultValues: {
      employeeName: '',
      sectorName: '',
      clientId: '',
    },
  });

  const unit = watch('employeeUnit');
  const cardNumber = watch('employeeCardNumber');
  const costCenter = watch('sectorCostCenter');

  useEffect(() => {
    const supportFindSectorFunction = async () => {
      if (costCenter) {
        const { status, message, data } = await findSectorByCc(costCenter);

        if (!status) {
          setValue('sectorName', '');
          setValue('sectorCostCenter', '');
          setValue('sectorId', undefined);
          return toast.error(message);
        }

        if (status) {
          console.log(data.id);
          setValue('sectorId', +data.id);
          setValue('sectorName', data.name);
          // setValue('costCenter', data.costCenter);
        }
      }
    };

    if (costCenter && costCenter.length === 4 && /^\d{4}$/.test(costCenter)) {
      supportFindSectorFunction();
    }
  }, [costCenter, setValue]);

  useEffect(() => {
    const supportFindEmployeeFunction = async () => {
      if (unit && cardNumber) {
        const { status, message, data } = await findEmployee({
          cardNumber,
          unit,
        });

        if (!status) {
          setValue('employeeName', '');
          setValue('employeeCardNumber', '');
          setValue('employeeId', undefined);
          return toast.info(message);
        }

        if (status) {
          if (!data.status) {
            setValue('employeeName', '');
            setValue('employeeCardNumber', '');
            setValue('employeeId', undefined);

            return toast.info('Colaborador encontrado, porém desativado.');
          }
          setValue('employeeName', data.name);
          setValue('employeeId', data.id);
        }
      }
    };

    if (
      unit &&
      cardNumber &&
      cardNumber.length === 4 &&
      /^\d{4}$/.test(cardNumber)
    )
      supportFindEmployeeFunction();
  }, [unit, cardNumber, setValue]);

  useEffect(() => {
    const syncAndListActivities = async () => {
      const existingPresetActivites = await listPinedActivities();

      if (existingPresetActivites) {
        const filter = seedActivities.filter(
          (activity) =>
            !existingPresetActivites.some(
              (preset) => preset.name === activity.name
            )
        );

        if (filter.length > 0) {
          await syncPresetActivities(filter);
        }
      } else {
        await syncPresetActivities(seedActivities);
      }
      const updatedList = await listPinedActivities();

      if (updatedList) setPinedACtivities(updatedList);
    };

    syncAndListActivities();
  }, []);

  useEffect(() => {
    const listPined = async () => {
      const list = await listPinedActivities();

      if (list) setPinedACtivities(list);
    };

    if (attListPinedActivities) {
      listPined();
      return setAttListPinedActivities(false);
    }
  }, [attListPinedActivities]);

  const handleAddInitialInformations = async (
    data: TypeInitialInformationsData
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
      employeeId: data.employeeId ? data.employeeId : 0,
      employeeName: data.employeeName ? data.employeeName : '',
      employeeCardNumber: data.employeeCardNumber
        ? data.employeeCardNumber
        : '',
      sectorId: data.sectorId ? data.sectorId : 0,
      sectorName: data.sectorName ? data.sectorName : '',
      sectorCostCenter: data.sectorCostCenter ? data.sectorCostCenter : '',
      employeeUnit: data.employeeUnit ? data.employeeUnit : '',
      clientId: +data.clientId,
      of: data.of,
      op: data.op,
      sop: data.sop,
      revision: data.revision,
      internalCode: data.internalCode,
      partNumber: data.partNumber,
    };

    await dbRegisterChronoanalysis.register.add(testInitialInformations);

    navigate('/chronoanalysis/activities', {
      replace: true,
    });
  };
  return (
    <section className=''>
      <Text variant={'title'}>Nova cronoanálise</Text>
      <form onSubmit={handleSubmit(handleAddInitialInformations)}>
        <Card text='Informações do colaborador' className='flex mt-5'>
          <div className=' flex gap-4 w-full items-center justify-center'>
            <Label title='Cartão' className=' relative h-25'>
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
            <Label title='Centro de custo' className=' w-1/5 relative h-25'>
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
          {/* <Button
            disabled={imageDisabled}
            variant={`${!imageDisabled ? 'blue' : 'default'}`}
            svg={ImagemIcon}
            className='absolute top-4 right-4'
          /> */}
          <div className=' flex gap-4 w-full '>
            <Label title='Part number'>
              <Input {...register('partNumber')} />
              {errors.partNumber && (
                <span className='text-red-500 text-sm'>
                  {errors.partNumber.message}
                </span>
              )}
            </Label>
            <Label title='Código interno'>
              <Input {...register('internalCode')} />
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
          </div>
        </Card>
        <Card text='Informações extras' className='flex'>
          <div className=' flex gap-4 w-full flex-col '>
            <div className=' flex items-center gap-4'>
              <Label title='Ordem de fabricação (OF)'>
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
              <Label title='Procedimento operacional padrão (SOP)'>
                <Input {...register('sop')} />
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
        <Card text='Preset das atividades' className='flex flex-col mt-5'>
          {/* <Label title='Tipo de cronoanálise'>
            <Select
              listTypeChronoanalist={['Soldagem', 'Montagem']}
              disabled={false} //i can put loading fetch of clients
              {...register('clientId')}
            />
          </Label> */}
          <ListActivities
            activities={pinedActivities}
            pinedActivitie={pinedActivitie}
            setAttListPinedActivities={setAttListPinedActivities}
          />
        </Card>
        <div className=' flex gap-4 w-full justify-end items-center mt-5'>
          <Button variant={'red'} size={'md'} type='button'>
            cancelar
          </Button>
          <Button
            // disabled={!isValid}
            // variant={`${!isValid ? 'default' : 'blue'}`}
            variant={'blue'}
            size={'md'}
            type='submit'
          >
            iniciar
          </Button>
        </div>
      </form>
    </section>
  );
};

export default RegisterInitialInformationsPage;

import { listChronoanalist } from '@/api/user';
import { DatePicker } from '@/components/date-picker';
import Button from '@/components/ui/button/button';
import { Button as ShadButton } from '@/components/ui/button';
import Card from '@/components/ui/card/card';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label/label';
import Select from '@/components/ui/select';
import Text from '@/components/ui/text';
import { clients } from '@/seed/seed-client';
import type { listChronoanalistProps } from '@/types/user-types';
import {
  filterChronoanalysis,
  type TypeFilterChronoanalysis,
} from '@/zod/schema-chronoanalysis';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  listChronoanalysis,
  type listChronoanalysisProps,
} from '@/api/chronoanalysis-api';
import { BrushCleaning } from 'lucide-react';

import ModalDetail from '@/components/modal-detail';
import TableChronoanalysis from '@/components/table-chronoanalysis';
import { Switch } from '@/components/ui/switch';

const Analysis = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isListChronoanalist, setListChronoanalist] = useState<
    listChronoanalistProps[]
  >([]);
  const [isListChronoanalysis, setListChronoanalysis] = useState<
    listChronoanalysisProps[]
  >([]);
  const [filterListChronoanalysis, setFilterListChronoanalysis] = useState<
    listChronoanalysisProps[]
  >([]);
  const [isChronoanalysis, setIsChronoanalysis] = useState<
    listChronoanalysisProps | undefined
  >(undefined);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(filterListChronoanalysis.length / pageSize);
  const paginatedData = filterListChronoanalysis
    .sort((a, b) => Date.parse(b.startDate) - Date.parse(a.startDate))
    .slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const { register, watch, setValue, control, reset } =
    useForm<TypeFilterChronoanalysis>({
      resolver: zodResolver(filterChronoanalysis),
      mode: 'onChange',
      defaultValues: {
        partNumber: '',
        internalCode: '',
        cardNumber: '',
        costCenter: '',
        clientId: '',
        dataRange: undefined,
        unit: '',
        userChronoanalistId: '',
        isKaizen: false,
        isSend: false,
      },
    });

  const unit = watch('unit');
  const partNumber = watch('partNumber');
  const internalCode = watch('internalCode');
  const userChronoanalistId = watch('userChronoanalistId');
  const cardNumber = watch('cardNumber');
  const costCenter = watch('costCenter');
  const clientId = watch('clientId');
  const dataRange = watch('dataRange');
  const formIsKaizen = watch('isKaizen');
  const formIsSend = watch('isSend');

  useEffect(() => {
    const supportListChronoanalist = async () => {
      const { data, message, status } = await listChronoanalist();
      if (!status) {
        return toast.info(message);
      }

      if (status) {
        setListChronoanalist(data);
      }
    };

    supportListChronoanalist();
  }, []);

  useEffect(() => {
    const supportListChronoanalysis = async () => {
      const { data, error, status } = await listChronoanalysis();

      if (!status) return toast.info(error);

      if (status) {
        setListChronoanalysis(data);
      }
    };

    supportListChronoanalysis();
  }, []);

  useEffect(() => {
    let filtered = [...isListChronoanalysis];

    filtered = filtered.filter((item) => item.isKaizen === formIsKaizen);
    filtered = filtered.filter((item) => item.isSend === formIsSend);

    if (unit) {
      filtered = filtered.filter((item) =>
        item.chronoanalysisEmployee.some(
          (employee) => employee.employeeUnit === unit
        )
      );
    }

    if (cardNumber) {
      filtered = filtered.filter((item) =>
        item.chronoanalysisEmployee.some((employee) =>
          employee.employeeCardNumber?.includes(cardNumber)
        )
      );
    }

    if (partNumber) {
      filtered = filtered.filter((item) =>
        item.partNumber.includes(partNumber)
      );
    }

    if (internalCode) {
      filtered = filtered.filter((item) =>
        item.internalCode.includes(internalCode)
      );
    }

    if (userChronoanalistId) {
      filtered = filtered.filter(
        (item) => item.user.employeeId === +userChronoanalistId
      );
    }

    if (costCenter) {
      filtered = filtered.filter((item) =>
        item.sectorCostCenter.includes(costCenter)
      );
    }

    if (clientId) {
      filtered = filtered.filter((item) => item.client.id === +clientId);
    }

    if (dataRange?.from || dataRange?.to) {
      filtered = filtered.filter((item) => {
        const startDate = new Date(item.startDate).getTime();

        const fromDate = dataRange.from
          ? new Date(dataRange.from).getTime()
          : null;

        const toDate = dataRange.to
          ? new Date(new Date(dataRange.to).setHours(23, 59, 59, 999)).getTime()
          : null;

        if (fromDate && toDate) {
          return startDate >= fromDate && startDate <= toDate;
        }

        return true;
      });
    }

    setCurrentPage(1);
    setFilterListChronoanalysis(filtered);
  }, [
    cardNumber,
    clientId,
    costCenter,
    dataRange,
    dataRange?.from,
    dataRange?.to,
    isListChronoanalysis,
    internalCode,
    partNumber,
    unit,
    userChronoanalistId,
    formIsKaizen,
    formIsSend,
  ]);

  function handleCleanForm() {
    reset();
  }
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className=''>
      <Text variant={'title'}>Análise</Text>
      <div className=' flex flex-col gap-2 mt-2'>
        <Card className=' relative'>
          <form className='flex flex-col gap-2 '>
            <div className=' flex gap-4 w-full'>
              <Label title='Part number'>
                <Input
                  {...register('partNumber')}
                  className='w-full h-fit py-2'
                />
              </Label>
              <Label title='Código interno'>
                <Input
                  {...register('internalCode')}
                  className='w-full h-fit py-2'
                />
              </Label>
              <Label title='Cartão' className=''>
                <div className=' flex items-center gap-0.5 w-full'>
                  <Button
                    type='button'
                    className='px-4 py-2'
                    size={' md-desk'}
                    variant={`${
                      unit === 'PEDERTRACTOR' ? 'select-blue' : 'default'
                    }`}
                    onClick={() => setValue('unit', 'PEDERTRACTOR')}
                  >
                    P
                  </Button>
                  <Button
                    type='button'
                    className='px-4 py-2'
                    size={' md-desk'}
                    variant={`${
                      unit === 'TRACTOR' ? 'select-blue' : 'default'
                    }`}
                    onClick={() => setValue('unit', 'TRACTOR')}
                  >
                    T
                  </Button>
                  <Input
                    disabled={!unit ? true : false}
                    className='w-full h-fit py-2'
                    maxLength={4}
                    inputMode='numeric'
                    placeholder='ex: 0072 | ex: 5532'
                    {...register('cardNumber')}
                  />
                </div>
              </Label>
              <Label title='Centro de custo'>
                <Input
                  {...register('costCenter')}
                  className='w-full h-fit py-2'
                  maxLength={4}
                  inputMode='numeric'
                  placeholder='ex: 7051'
                />
              </Label>
            </div>
            <div className=' flex gap-4 w-full'>
              <Controller
                control={control}
                name='dataRange'
                render={({ field }) => {
                  const value = field.value
                    ? {
                        from: field.value.from
                          ? parseISO(field.value.from)
                          : undefined,
                        to: field.value.to
                          ? parseISO(field.value.to)
                          : undefined,
                      }
                    : undefined;

                  return (
                    <DatePicker
                      value={value}
                      onChange={(val) => {
                        field.onChange(
                          val
                            ? {
                                from: val.from?.toISOString(),
                                to: val.to?.toISOString(),
                              }
                            : undefined
                        );
                      }}
                    />
                  );
                }}
              />
              <Label title='Cronoanálista'>
                <Select
                  className='w-full h-fit py-2'
                  listOptionsChronoanalist={isListChronoanalist}
                  {...register('userChronoanalistId')}
                />
              </Label>
              <Label title='Cliente'>
                <Select
                  className='w-full h-fit py-2'
                  listOptions={clients}
                  {...register('clientId')}
                />
              </Label>
              <div className=' flex items-center justify-center gap-5'>
                <Label title='Kaizen' className=' flex gap-3 w-fit'>
                  <Switch
                    className='border-2'
                    checked={formIsKaizen}
                    onCheckedChange={() => setValue('isKaizen', !formIsKaizen)}
                  />
                </Label>
                <Label title='Eeprom' className=' flex gap-3 w-fit'>
                  <Switch
                    className='border-2'
                    checked={formIsSend}
                    onCheckedChange={() => setValue('isSend', !formIsSend)}
                  />
                </Label>
              </div>
            </div>
          </form>
          <ShadButton
            onClick={handleCleanForm}
            type='button'
            variant={'secondary'}
            size={'sm'}
            disabled={
              unit ||
              partNumber ||
              internalCode ||
              userChronoanalistId ||
              cardNumber ||
              costCenter ||
              clientId ||
              dataRange
                ? false
                : true
            }
            className={`cursor-pointer transition absolute top-1 right-4.5 z-50 ${
              unit ||
              partNumber ||
              internalCode ||
              userChronoanalistId ||
              cardNumber ||
              costCenter ||
              clientId ||
              dataRange
                ? 'bg-background-base-blue text-background-base-blue-select hover:bg-background-base-blue-active'
                : 'bg-zinc-50 text-zinc-900'
            }`}
          >
            <BrushCleaning />
          </ShadButton>
        </Card>
        <TableChronoanalysis
          data={paginatedData}
          PagesLength={filterListChronoanalysis.length}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalPages={totalPages}
          setIsChronoanalysis={setIsChronoanalysis}
          setIsOpenModal={setIsOpenModal}
          isView={false}
        />
      </div>
      {isChronoanalysis && (
        <ModalDetail
          open={isOpenModal}
          setOpen={setIsOpenModal}
          chronoanalysis={isChronoanalysis}
        />
      )}
    </section>
  );
};

export default Analysis;

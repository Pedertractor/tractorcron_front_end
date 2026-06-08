import { listChronoanalist } from '@/api/user';

import { DatePicker } from '@/components/date-picker';

import Button from '@/components/ui/button/button';

import { Button as ShadButton } from '@/components/ui/button';

import Card from '@/components/ui/card/card';

import Input from '@/components/ui/input';

import Label from '@/components/ui/label/label';

import Select from '@/components/ui/select-native';

import Text from '@/components/ui/text';

import { clients } from '@/seed/seed-client';

import type { listChronoanalistProps } from '@/types/user-types';

import {

  filterChronoanalysis,

  type TypeFilterChronoanalysis,

} from '@/zod/schema-chronoanalysis';

import { zodResolver } from '@hookform/resolvers/zod';

import { parseISO } from 'date-fns';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';

import { toast } from 'sonner';



import {

  listChronoanalysis,

  listChronoanalistsFromRecords,

  type ChronoanalysisListItem,

  type ListChronoanalysisParams,

} from '@/api/chronoanalysis-api';

import { BrushCleaning, ChevronDown, ChevronUp, ListFilter } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';



import ModalDetail from '@/components/modal-detail';

import TableChronoanalysis from '@/components/table-chronoanalysis';

import { Switch } from '@/components/ui/switch';

import ModalEditChronoanalysis from '@/components/modal-edit';

import ModalDelete from '@/components/modal-delete';

import { CHRONOANALYSIS_TYPE_OPTIONS } from '@/constants/chronoanalysis-types';

const PAGE_SIZE = 15;
const DEBOUNCE_MS = 300;



const Analysis = () => {

  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);

  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);

  const [deleteChronoId, setDeleteChronoId] = useState<string | null>(null);

  const [role] = useState(window.localStorage.getItem('role'));



  const [isRefetch, setIsRefetch] = useState(false);

  const [isIdChrono, setIsIdChrono] = useState<string | null>(null);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [detailChronoId, setDetailChronoId] = useState<string | null>(null);

  const [isListChronoanalist, setListChronoanalist] = useState<

    listChronoanalistProps[]

  >([]);

  const [recordChronoanalists, setRecordChronoanalists] = useState<

    listChronoanalistProps[]

  >([]);

  const [items, setItems] = useState<ChronoanalysisListItem[]>([]);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [filtersOpen, setFiltersOpen] = useState(false);



  const chronoanalistsForFilter = useMemo(() => {

    const byEmployeeId = new Map<number, listChronoanalistProps>();

    for (const u of isListChronoanalist) {

      byEmployeeId.set(u.employeeId, u);

    }

    for (const u of recordChronoanalists) {

      if (byEmployeeId.has(u.employeeId)) continue;

      byEmployeeId.set(u.employeeId, {

        id: u.id ?? u.employeeId,

        employeeName: u.employeeName,

        employeeId: u.employeeId,

      });

    }

    return Array.from(byEmployeeId.values()).sort((a, b) =>

      a.employeeName.localeCompare(b.employeeName, 'pt-BR', {

        sensitivity: 'base',

      }),

    );

  }, [isListChronoanalist, recordChronoanalists]);



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

        chronoanalysisType: '',

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

  const chronoanalysisType = watch('chronoanalysisType');



  const hasActiveFilters = Boolean(

    unit ||

      partNumber ||

      internalCode ||

      userChronoanalistId ||

      cardNumber ||

      costCenter ||

      clientId ||

      dataRange ||

      formIsKaizen ||

      formIsSend ||

      chronoanalysisType,

  );



  const buildListParams = useCallback(

    (page: number): ListChronoanalysisParams => ({

      page,

      pageSize: PAGE_SIZE,

      partNumber: partNumber || undefined,

      internalCode: internalCode || undefined,

      costCenter: costCenter || undefined,

      unit: unit || undefined,

      cardNumber: cardNumber || undefined,

      userChronoanalistId: userChronoanalistId || undefined,

      clientId: clientId || undefined,

      ...(formIsKaizen ? { isKaizen: true } : {}),

      ...(formIsSend ? { isSend: true } : {}),

      dateFrom:

        dataRange?.from && dataRange?.to ? dataRange.from : undefined,

      dateTo: dataRange?.from && dataRange?.to ? dataRange.to : undefined,

      chronoanalysisType: chronoanalysisType || undefined,

    }),

    [

      partNumber,

      internalCode,

      costCenter,

      unit,

      cardNumber,

      userChronoanalistId,

      clientId,

      formIsKaizen,

      formIsSend,

      dataRange?.from,

      dataRange?.to,

      chronoanalysisType,

    ],

  );



  const abortRef = useRef<AbortController | null>(null);



  const fetchList = useCallback(

    async (page: number) => {

      abortRef.current?.abort();

      const controller = new AbortController();

      abortRef.current = controller;



      setLoading(true);

      const { data, error, status, aborted } = await listChronoanalysis(

        buildListParams(page),

        controller.signal,

      );



      if (aborted) return;



      setLoading(false);



      if (!status) {

        toast.info(error);

        return;

      }



      setItems(data.items);

      setTotal(data.total);

      setTotalPages(data.totalPages);

      setCurrentPage(data.page);

    },

    [buildListParams],

  );



  const fetchListRef = useRef(fetchList);

  fetchListRef.current = fetchList;



  useEffect(() => {

    const loadChronoanalistOptions = async () => {

      const [roleList, recordsList] = await Promise.all([

        listChronoanalist(),

        listChronoanalistsFromRecords(),

      ]);



      if (roleList.status) {

        setListChronoanalist(roleList.data);

      } else {

        toast.info(roleList.message);

      }



      if (recordsList.status) {

        setRecordChronoanalists(recordsList.data);

      }

    };



    void loadChronoanalistOptions();

  }, []);



  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      void fetchListRef.current(1);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [

    partNumber,

    internalCode,

    costCenter,

    unit,

    cardNumber,

    userChronoanalistId,

    clientId,

    dataRange?.from,

    dataRange?.to,

    formIsKaizen,

    formIsSend,

    chronoanalysisType,

  ]);



  useEffect(() => {

    if (!isRefetch) return;

    setIsRefetch(false);

    void fetchList(currentPage);

  }, [isRefetch, currentPage, fetchList]);



  useEffect(() => {

    return () => abortRef.current?.abort();

  }, []);



  function handleCleanForm() {

    reset();

    setCurrentPage(1);

    void fetchListWithDefaults();

  }



  const fetchListWithDefaults = async () => {

    abortRef.current?.abort();

    const controller = new AbortController();

    abortRef.current = controller;



    setLoading(true);

    const { data, error, status, aborted } = await listChronoanalysis(

      { page: 1, pageSize: PAGE_SIZE },

      controller.signal,

    );



    if (aborted) return;



    setLoading(false);



    if (!status) {

      toast.info(error);

      return;

    }



    setItems(data.items);

    setTotal(data.total);

    setTotalPages(data.totalPages);

    setCurrentPage(data.page);

  };



  const handlePageChange = (page: number) => {

    void fetchList(page);

  };



  const handleOpenDetail = (id: string) => {

    setDetailChronoId(id);

    setIsOpenModal(true);

  };



  const handleRefetchList = () => {

    void fetchList(currentPage);

  };



  return (

    <section className='w-full min-w-0 max-w-full'>

      <Text variant={'title'}>Análise</Text>

      <div className='mt-2 flex min-w-0 flex-col gap-2'>

        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>

          <div className='flex items-center justify-between gap-2'>

            <CollapsibleTrigger asChild>

              <ShadButton

                type='button'

                variant='outline'

                size='sm'

                className='cursor-pointer gap-2 border-border/25 shadow-none hover:border-border/40'

              >

                <ListFilter size={16} />

                Filtros

                {hasActiveFilters && (

                  <span className='rounded-full bg-background-base-blue px-1.5 py-0.5 text-[10px] font-semibold text-white'>

                    ativos

                  </span>

                )}

                {filtersOpen ? (

                  <ChevronUp size={16} />

                ) : (

                  <ChevronDown size={16} />

                )}

              </ShadButton>

            </CollapsibleTrigger>

            <ShadButton

              onClick={handleCleanForm}

              type='button'

              variant={'secondary'}

              size={'sm'}

              disabled={!hasActiveFilters}

              className={`cursor-pointer transition ${

                hasActiveFilters

                  ? 'bg-background-base-blue text-background-base-blue-select hover:bg-background-base-blue-active'

                  : 'bg-zinc-50 text-zinc-900'

              }`}

            >

              <BrushCleaning />

            </ShadButton>

          </div>

          <CollapsibleContent className='min-w-0 pt-2'>

            <Card className='min-w-0 overflow-hidden'>

              <form className='flex min-w-0 flex-col gap-2'>

            <div className='flex w-full min-w-0 flex-wrap gap-4'>

              <Label title='Part number' className='min-w-0 flex-1 basis-40'>

                <Input

                  {...register('partNumber')}

                  className='w-full h-fit py-2'

                />

              </Label>

              <Label title='Código interno' className='min-w-0 flex-1 basis-40'>

                <Input

                  {...register('internalCode')}

                  className='w-full h-fit py-2'

                />

              </Label>

              <Label title='Cartão' className='min-w-0 flex-1 basis-40'>

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

              <Label title='Centro de custo' className='min-w-0 flex-1 basis-40'>

                <Input

                  {...register('costCenter')}

                  className='w-full h-fit py-2'

                  maxLength={4}

                  inputMode='numeric'

                  placeholder='ex: 7051'

                />

              </Label>

            </div>

            <div className='flex w-full min-w-0 flex-wrap items-end gap-4'>

              <Label title='Período' className='min-w-0 flex-1'>

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

                              : undefined,

                          );

                        }}

                      />

                    );

                  }}

                />

              </Label>

              <Label title='Cronoanálista' className='min-w-0 flex-1'>

                <Select

                  name='userChronoanalistId'

                  control={control}

                  className='h-fit py-2'

                  listOptionsChronoanalist={chronoanalistsForFilter}

                />

              </Label>

              <Label title='Cliente' className='min-w-0 flex-1'>

                <Select

                  name='clientId'

                  control={control}

                  className='h-fit py-2'

                  listOptions={clients}

                />

              </Label>

              <Label title='Tipo de cronoanálise' className='min-w-0 flex-1'>

                <Select

                  name='chronoanalysisType'

                  control={control}

                  className='h-fit py-2'

                  listEnumOptions={CHRONOANALYSIS_TYPE_OPTIONS}

                />

              </Label>

              <div className='flex shrink-0 items-center justify-center gap-5'>

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

            </Card>

          </CollapsibleContent>

        </Collapsible>

        <TableChronoanalysis

          data={items}

          role={role}

          loading={loading}

          PagesLength={total}

          currentPage={currentPage}

          handlePageChange={handlePageChange}

          totalPages={totalPages}

          onOpenDetail={handleOpenDetail}

          onSendStatusChange={handleRefetchList}

          onOpenEdit={(id) => {

            setIsIdChrono(id);

            setIsOpenModalEdit(true);

          }}

          onOpenDelete={(id) => {

            setDeleteChronoId(id);

            setIsOpenModalDelete(true);

          }}

        />

      </div>

      {deleteChronoId && (

        <ModalDelete

          idChronoanalysis={deleteChronoId}

          open={isOpenModalDelete}

          setOpen={(open) => {

            setIsOpenModalDelete(open);

            if (!open) {

              window.setTimeout(() => setDeleteChronoId(null), 300);

            }

          }}

          setIsRefetch={setIsRefetch}

        />

      )}

      {isOpenModalEdit && isIdChrono && (

        <ModalEditChronoanalysis

          open={isOpenModalEdit}

          setOpen={setIsOpenModalEdit}

          idChrono={isIdChrono}

          setIdChrono={setIsIdChrono}

          setIsRefetch={setIsRefetch}

        />

      )}

      {detailChronoId && (

        <ModalDetail

          open={isOpenModal}

          setOpen={(open) => {

            setIsOpenModal(open);

            if (!open) setDetailChronoId(null);

          }}

          chronoanalysisId={detailChronoId}

        />

      )}

    </section>

  );

};



export default Analysis;


import { useCallback, useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  ClipboardList,
  Eye,
  Check,
  X,
  MoreVertical,
  LoaderCircle,
  Search,
  AlarmClockOff,
} from 'lucide-react';

import Text from '@/components/ui/text';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button/button';
import { Button as ShadButton } from '@/components/ui/button';
import Label from '@/components/ui/label/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ModalDetail from '@/components/modal-detail';
import { DatePickerSingle } from '@/components/date-picker-single';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { getPaginationRange } from '@/lib/pagination';
import {
  acceptChronoanalysisRequest,
  cancelChronoanalysisRequest,
  listChronoanalysisRequests,
} from '@/api/chronoanalysis-request-api';
import {
  PRODUCTION_TIME_LABELS,
  REQUEST_STATUS_LABELS,
  TIMING_TYPE_LABELS,
  type ChronoanalysisRequestItem,
  type RequestStatus,
} from '@/types/chronoanalysis-request-types';
import { getChronoanalysisTypeLabel } from '@/constants/chronoanalysis-types';
import type { ChronoanalysisTypeValue } from '@/constants/chronoanalysis-types';

const PAGE_SIZE = 10;

const STATUS_OPTIONS: Array<RequestStatus | 'ALL'> = [
  'ALL',
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
];

const STATUS_BADGE_CLASS: Record<RequestStatus, string> = {
  PENDING: 'border-transparent bg-amber-100 text-amber-900',
  IN_PROGRESS: 'border-transparent bg-background-base-blue text-initial',
  COMPLETED: 'border-transparent bg-emerald-100 text-emerald-900',
  CANCELLED: 'border-transparent bg-muted text-muted-foreground',
};

function OverdueClockIcon() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className='inline-flex shrink-0 cursor-default'>
          <AlarmClockOff
            className='size-4 text-background-orange'
            aria-label='Atrasado'
          />
        </span>
      </TooltipTrigger>
      <TooltipContent side='top'>Atrasado</TooltipContent>
    </Tooltip>
  );
}

function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <Badge variant='default' className={cn(STATUS_BADGE_CLASS[status])}>
      {REQUEST_STATUS_LABELS[status]}
    </Badge>
  );
}

interface RequestActionsProps {
  item: ChronoanalysisRequestItem;
  busy: boolean;
  onDetail: (item: ChronoanalysisRequestItem) => void;
  onAccept: (item: ChronoanalysisRequestItem) => void;
  onCancel: (item: ChronoanalysisRequestItem) => void;
  onContinue: (item: ChronoanalysisRequestItem) => void;
}

function MobileActions({
  item,
  busy,
  onDetail,
  onAccept,
  onCancel,
  onContinue,
}: RequestActionsProps) {
  const actionBtnClass =
    'h-7 min-w-0 flex-1 gap-1 rounded-md px-1.5 text-[11px] font-semibold [&_svg]:size-3.5';

  return (
    <div className='flex flex-nowrap items-center gap-1'>
      <Button
        type='button'
        size=' md-desk'
        variant='default'
        className={actionBtnClass}
        onClick={() => onDetail(item)}
      >
        <Eye />
        Detalhe
      </Button>
      {item.status === 'PENDING' && (
        <Button
          type='button'
          size=' md-desk'
          variant='blue'
          className={actionBtnClass}
          disabled={busy}
          onClick={() => onAccept(item)}
        >
          {busy ? <LoaderCircle className='animate-spin' /> : <Check />}
          Aceitar
        </Button>
      )}
      {item.status === 'IN_PROGRESS' && (
        <Button
          type='button'
          size=' md-desk'
          variant='blue'
          className={actionBtnClass}
          onClick={() => onContinue(item)}
        >
          Continuar
        </Button>
      )}
      {(item.status === 'PENDING' || item.status === 'IN_PROGRESS') && (
        <Button
          type='button'
          size=' md-desk'
          variant='default'
          className={actionBtnClass}
          disabled={busy}
          onClick={() => onCancel(item)}
        >
          <X />
          Cancelar
        </Button>
      )}
    </div>
  );
}

function RowActions({
  item,
  busy,
  onDetail,
  onAccept,
  onCancel,
  onContinue,
}: RequestActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  function runAfterMenuClose(action: () => void) {
    setMenuOpen(false);
    window.setTimeout(action, 0);
  }

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <ShadButton
          variant='ghost'
          size='icon-sm'
          disabled={busy}
          aria-label='Abrir menu de ações'
        >
          {busy ? <LoaderCircle className='animate-spin' /> : <MoreVertical />}
        </ShadButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='min-w-40 rounded-lg border border-border bg-white shadow-md'
      >
        <DropdownMenuItem
          onSelect={() => runAfterMenuClose(() => onDetail(item))}
        >
          <Eye />
          Detalhe
        </DropdownMenuItem>
        {item.status === 'PENDING' && (
          <DropdownMenuItem
            onSelect={() => runAfterMenuClose(() => onAccept(item))}
          >
            <Check />
            Aceitar
          </DropdownMenuItem>
        )}
        {item.status === 'IN_PROGRESS' && (
          <DropdownMenuItem
            onSelect={() => runAfterMenuClose(() => onContinue(item))}
          >
            <Check />
            Continuar
          </DropdownMenuItem>
        )}
        {(item.status === 'PENDING' || item.status === 'IN_PROGRESS') && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant='destructive'
              onSelect={() => runAfterMenuClose(() => onCancel(item))}
            >
              <X />
              Cancelar
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RequestDetailRows({ item }: { item: ChronoanalysisRequestItem }) {
  return (
    <dl className='grid grid-cols-1 gap-3 text-sm sm:grid-cols-2'>
      <div>
        <dt className='text-secondary'>Solicitante</dt>
        <dd className='font-medium'>
          {item.employeeName} ({item.employeeCardNumber} · {item.employeeUnit})
        </dd>
      </div>
      <div>
        <dt className='text-secondary'>Setor</dt>
        <dd className='font-medium'>
          {item.sectorCostCenter} — {item.sectorName}
        </dd>
      </div>
      <div>
        <dt className='text-secondary'>Código interno</dt>
        <dd className='font-medium'>{item.internalCode}</dd>
      </div>
      <div>
        <dt className='text-secondary'>Part number</dt>
        <dd className='font-medium'>{item.partNumber}</dd>
      </div>
      <div>
        <dt className='text-secondary'>Operação</dt>
        <dd className='font-medium'>{item.operation}</dd>
      </div>
      <div>
        <dt className='text-secondary'>Início fabricação</dt>
        <dd className='font-medium'>
          {format(parseISO(item.manufacturingStartDate), 'dd/MM/yyyy')}
        </dd>
      </div>
      <div>
        <dt className='text-secondary'>Tipo</dt>
        <dd className='font-medium'>
          {getChronoanalysisTypeLabel(
            item.chronoanalysisType as ChronoanalysisTypeValue,
          )}
        </dd>
      </div>
      <div>
        <dt className='text-secondary'>Tempo de produção</dt>
        <dd className='font-medium'>
          {PRODUCTION_TIME_LABELS[item.productionTime]}
        </dd>
      </div>
      <div>
        <dt className='text-secondary'>Cronometragem</dt>
        <dd className='font-medium'>{TIMING_TYPE_LABELS[item.timingType]}</dd>
      </div>
      <div>
        <dt className='text-secondary'>Status</dt>
        <dd>
          <StatusBadge status={item.status} />
        </dd>
      </div>
      <div className='sm:col-span-2'>
        <dt className='text-secondary'>Observação</dt>
        <dd className='font-medium whitespace-pre-wrap'>
          {item.observation?.trim() || '—'}
        </dd>
      </div>
    </dl>
  );
}

const ChronoanalysisRequestsPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ChronoanalysisRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'ALL'>(
    'ALL',
  );
  const [internalCode, setInternalCode] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detailItem, setDetailItem] = useState<ChronoanalysisRequestItem | null>(
    null,
  );
  const [chronoDetailId, setChronoDetailId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await listChronoanalysisRequests({
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      internalCode: internalCode.trim() || undefined,
      costCenter: costCenter.trim() || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      page,
      pageSize: PAGE_SIZE,
    });
    setLoading(false);

    if (!result.status || !result.data) {
      toast.error(result.message ?? 'Erro ao carregar solicitações');
      setItems([]);
      return;
    }

    setItems(result.data.items);
    setTotalPages(result.data.totalPages);
  }, [statusFilter, internalCode, costCenter, dateFrom, dateTo, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAccept(item: ChronoanalysisRequestItem) {
    setActionLoadingId(item.id);
    const result = await acceptChronoanalysisRequest(item.id);
    setActionLoadingId(null);
    if (!result.status) {
      toast.error(result.message);
      return;
    }
    toast.success('Solicitação aceita. Abrindo cronoanálise...');
    navigate(`/cronoanalise?requestId=${item.id}`);
  }

  async function handleCancel(item: ChronoanalysisRequestItem) {
    const confirmed = window.confirm(
      'Deseja cancelar esta solicitação de cronoanálise?',
    );
    if (!confirmed) return;

    setActionLoadingId(item.id);
    const result = await cancelChronoanalysisRequest(item.id);
    setActionLoadingId(null);
    if (!result.status) {
      toast.error(result.message);
      return;
    }
    toast.success('Solicitação cancelada.');
    load();
  }

  return (
    <section className='flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden'>
      <div className='mb-2 flex shrink-0 items-center gap-2 sm:mb-3'>
        <ClipboardList className='size-5 text-background-base-blue-select sm:size-6' />
        <Text variant='title'>Solicitações de cronoanálise</Text>
        <Badge className='border-transparent bg-background-orange px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-none sm:text-xs'>
          novo!
        </Badge>
      </div>

      <div className='mb-2 flex shrink-0 flex-col gap-2 rounded-lg border border-border/20 bg-white p-2.5 sm:mb-3 sm:gap-2.5 sm:p-3'>
        <div className='flex flex-wrap gap-1.5'>
          {STATUS_OPTIONS.map((status) => (
            <Button
              key={status}
              type='button'
              size=' md-desk'
              className='h-8 px-2.5 text-xs'
              variant={statusFilter === status ? 'select-blue' : 'default'}
              onClick={() => {
                setPage(1);
                setStatusFilter(status);
              }}
            >
              {status === 'ALL' ? 'Todas' : REQUEST_STATUS_LABELS[status]}
            </Button>
          ))}
        </div>

        <div className='grid grid-cols-2 gap-x-2 gap-y-1.5 sm:flex sm:flex-wrap sm:items-end sm:gap-2'>
          <Label
            title='Código interno'
            className='col-span-2 min-w-0 sm:col-auto sm:flex-1 sm:basis-36'
          >
            <Input
              value={internalCode}
              onChange={(e) => setInternalCode(e.target.value)}
              placeholder='Filtrar'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPage(1);
                  load();
                }
              }}
            />
          </Label>
          <Label
            title='Centro de custo'
            className='col-span-2 min-w-0 sm:col-auto sm:flex-1 sm:basis-32'
          >
            <Input
              value={costCenter}
              onChange={(e) => setCostCenter(e.target.value)}
              placeholder='ex: 7051'
              maxLength={4}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPage(1);
                  load();
                }
              }}
            />
          </Label>
          <Label title='De' className='min-w-0 sm:flex-1 sm:basis-36'>
            <DatePickerSingle value={dateFrom} onChange={setDateFrom} />
          </Label>
          <Label title='Até' className='min-w-0 sm:flex-1 sm:basis-36'>
            <DatePickerSingle value={dateTo} onChange={setDateTo} />
          </Label>
          <ShadButton
            type='button'
            size='icon'
            variant='ghost'
            className='col-span-2 size-9 shrink-0 justify-self-end text-muted-foreground hover:text-foreground sm:col-auto sm:justify-self-auto'
            aria-label='Filtrar'
            title='Filtrar'
            onClick={() => {
              setPage(1);
              load();
            }}
          >
            <Search />
          </ShadButton>
        </div>
      </div>

      {loading ? (
        <div className='min-h-0 flex-1 space-y-3 overflow-hidden'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-24 w-full md:h-12' />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className='flex min-h-0 flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border/25 bg-muted/10 px-4 py-12 text-center'>
          <p className='text-sm font-medium'>Nenhuma solicitação encontrada</p>
          <p className='text-muted-foreground mt-1 text-sm'>
            Ajuste os filtros ou aguarde novas solicitações da indústria.
          </p>
        </div>
      ) : (
        <>
          <TooltipProvider>
          <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
          <ul className='min-h-0 flex-1 space-y-2 overflow-y-auto md:hidden'>
            {items.map((item) => {
              const overdue = item.isOverdue;
              return (
              <li
                key={item.id}
                className={cn(
                  'rounded-lg border p-3',
                  overdue
                    ? 'border-background-orange/30 bg-background-orange/8'
                    : 'border-border/20 bg-background',
                )}
              >
                <div className='flex items-start justify-between gap-2'>
                  <div className='min-w-0'>
                    <p className='truncate text-sm leading-snug font-medium'>
                      {item.internalCode} · OP {item.operation}
                    </p>
                    <p className='text-muted-foreground mt-0.5 truncate text-xs'>
                      {item.employeeName} · {item.sectorCostCenter}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <p className='text-muted-foreground mt-1.5 flex items-center gap-1.5 text-xs'>
                  {overdue && <OverdueClockIcon />}
                  <span>
                    {format(parseISO(item.createdAt), 'dd/MM/yyyy HH:mm')} · Fab.{' '}
                    {format(parseISO(item.manufacturingStartDate), 'dd/MM/yyyy')}{' '}
                    · {TIMING_TYPE_LABELS[item.timingType]}
                  </span>
                </p>
                <div className='mt-2'>
                  <MobileActions
                    item={item}
                    busy={actionLoadingId === item.id}
                    onDetail={setDetailItem}
                    onAccept={handleAccept}
                    onCancel={handleCancel}
                    onContinue={(request) =>
                      navigate(`/cronoanalise?requestId=${request.id}`)
                    }
                  />
                </div>
              </li>
              );
            })}
          </ul>

          <div className='hidden min-h-0 flex-1 overflow-hidden md:block'>
            <div className='relative h-full min-h-0 w-full min-w-0 max-w-full overflow-auto'>
              <table className='w-full caption-bottom text-sm'>
                <TableCaption className='sr-only'>
                  Lista de solicitações de cronoanálise
                </TableCaption>
                <TableHeader className='sticky top-0 z-10 bg-white [&_tr]:border-border/20'>
                  <TableRow className='border-border/20 hover:bg-transparent'>
                    <TableHead className='w-8 bg-white px-2'>
                      <span className='sr-only'>Atraso</span>
                    </TableHead>
                    <TableHead className='bg-white'>Data</TableHead>
                    <TableHead className='bg-white'>Início fabricação</TableHead>
                    <TableHead className='bg-white'>Solicitante</TableHead>
                    <TableHead className='bg-white'>Peça</TableHead>
                    <TableHead className='bg-white'>CC</TableHead>
                    <TableHead className='bg-white'>Tipo</TableHead>
                    <TableHead className='bg-white'>Status</TableHead>
                    <TableHead className='w-12 bg-white'>
                      <span className='sr-only'>Ações</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const overdue = item.isOverdue;
                    return (
                    <TableRow
                      key={item.id}
                      className={cn(
                        'border-border/20',
                        overdue
                          ? 'bg-background-orange/8 hover:bg-background-orange/14'
                          : 'hover:bg-muted/20',
                      )}
                    >
                      <TableCell className='w-8 px-2'>
                        {overdue ? <OverdueClockIcon /> : null}
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {format(parseISO(item.createdAt), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {format(
                          parseISO(item.manufacturingStartDate),
                          'dd/MM/yyyy',
                        )}
                      </TableCell>
                      <TableCell>
                        <div className='font-medium'>{item.employeeName}</div>
                        <div className='text-muted-foreground text-xs'>
                          {item.employeeCardNumber} · {item.employeeUnit}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='font-medium'>{item.internalCode}</div>
                        <div className='text-muted-foreground text-xs'>
                          OP {item.operation}
                        </div>
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {item.sectorCostCenter}
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {getChronoanalysisTypeLabel(
                          item.chronoanalysisType as ChronoanalysisTypeValue,
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      <TableCell>
                        <RowActions
                          item={item}
                          busy={actionLoadingId === item.id}
                          onDetail={setDetailItem}
                          onAccept={handleAccept}
                          onCancel={handleCancel}
                          onContinue={(request) =>
                            navigate(`/cronoanalise?requestId=${request.id}`)
                          }
                        />
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </table>
            </div>
          </div>
          </div>
          </TooltipProvider>

          {totalPages > 1 && (
            <div className='mt-2 flex shrink-0 items-center gap-2 border-t border-border/15 pt-2 sm:mt-3 sm:pt-3'>
              <div className='hidden flex-1 sm:block' />
              <Pagination className='mx-0 w-auto'>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) setPage(page - 1);
                      }}
                      className={
                        page <= 1 ? 'pointer-events-none opacity-50' : ''
                      }
                    />
                  </PaginationItem>
                  {getPaginationRange(page, totalPages).map((item, index) =>
                    item === 'ellipsis' ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          href='#'
                          isActive={item === page}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(item);
                          }}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < totalPages) setPage(page + 1);
                      }}
                      className={
                        page >= totalPages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <div className='flex flex-1 justify-end'>
                <p className='rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-secondary'>
                  {page} / {totalPages}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog
        open={Boolean(detailItem)}
        onOpenChange={(open) => {
          if (!open) setDetailItem(null);
        }}
      >
        <DialogContent className='h-auto max-h-[90vh] gap-2 overflow-y-auto border-0 sm:max-w-lg'>
          <DialogHeader className='gap-0'>
            <DialogTitle>Detalhe da solicitação</DialogTitle>
          </DialogHeader>
          {detailItem && (
            <div className='flex flex-col gap-3'>
              <RequestDetailRows item={detailItem} />
              {detailItem.status === 'COMPLETED' &&
                detailItem.registerChronoanalysisId && (
                  <Button
                    type='button'
                    variant='blue'
                    className='w-full'
                    onClick={() => {
                      const chronoId = detailItem.registerChronoanalysisId;
                      setDetailItem(null);
                      if (chronoId) setChronoDetailId(chronoId);
                    }}
                  >
                    Ver cronoanálise
                  </Button>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {chronoDetailId && (
        <ModalDetail
          open={Boolean(chronoDetailId)}
          setOpen={(open) => {
            if (!open) setChronoDetailId(null);
          }}
          chronoanalysisId={chronoDetailId}
        />
      )}
    </section>
  );
};

export default ChronoanalysisRequestsPage;

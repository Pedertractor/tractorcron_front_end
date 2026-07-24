import { forwardRef, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Check, Clock, Package, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import Text from '@/components/ui/text';
import {
  getChronoanalysisTypeLabel,
  type ChronoanalysisTypeValue,
} from '@/constants/chronoanalysis-types';
import {
  TIMING_TYPE_LABELS,
  type ChronoanalysisRequestItem,
  type RequestStatus,
} from '@/types/chronoanalysis-request-types';

type SuccessTicketCardProps = {
  request: ChronoanalysisRequestItem;
};

const PROGRESS_STEPS = [
  { key: 'PENDING', label: 'Solicitado' },
  { key: 'IN_PROGRESS', label: 'Aceito' },
  { key: 'COMPLETED', label: 'Finalizado' },
] as const;

function getActiveStepIndex(status: RequestStatus) {
  switch (status) {
    case 'PENDING':
      return 0;
    case 'IN_PROGRESS':
      return 1;
    case 'COMPLETED':
      return 2;
    case 'CANCELLED':
      return -1;
    default:
      return 0;
  }
}

function TicketProgress({ status }: { status: RequestStatus }) {
  const isCancelled = status === 'CANCELLED';
  const activeIndex = getActiveStepIndex(status);
  const reachedIndex = isCancelled ? 0 : Math.max(activeIndex, 0);

  return (
    <div className='my-8 w-full'>
      <div className='flex items-center justify-between gap-1'>
        {PROGRESS_STEPS.map((step, index) => {
          const isDone =
            !isCancelled && (status === 'COMPLETED' || index < activeIndex);
          const isCurrent = !isCancelled && index === activeIndex;
          const showCancelledOnFirst = isCancelled && index === 0;

          return (
            <div
              key={step.key}
              className='flex min-w-0 flex-1 flex-col items-center gap-1.5'
            >
              <div className='flex w-full items-center'>
                {index > 0 ? (
                  <div
                    className={`h-0.5 flex-1 ${
                      !isCancelled && index <= reachedIndex
                        ? 'bg-emerald-500'
                        : 'bg-border'
                    }`}
                  />
                ) : (
                  <div className='flex-1' />
                )}
                <div
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                    showCancelledOnFirst
                      ? 'bg-red-500 text-white'
                      : isDone || isCurrent
                        ? 'bg-emerald-500 text-white'
                        : 'bg-zinc-200 text-secondary'
                  }`}
                >
                  {showCancelledOnFirst ? (
                    <X className='size-3.5' strokeWidth={2.5} />
                  ) : isDone ? (
                    <Check className='size-3.5' strokeWidth={2.5} />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < PROGRESS_STEPS.length - 1 ? (
                  <div
                    className={`h-0.5 flex-1 ${
                      !isCancelled && index < reachedIndex
                        ? 'bg-emerald-500'
                        : !isCancelled &&
                            index === reachedIndex &&
                            status === 'COMPLETED'
                          ? 'bg-emerald-500'
                          : 'bg-border'
                    }`}
                  />
                ) : (
                  <div className='flex-1' />
                )}
              </div>
              <span
                className={`max-w-full truncate text-[10px] leading-none sm:text-[11px] ${
                  showCancelledOnFirst
                    ? 'font-semibold text-red-500'
                    : isDone || isCurrent
                      ? 'font-semibold text-emerald-700'
                      : 'text-secondary/70'
                }`}
              >
                {showCancelledOnFirst ? 'Cancelado' : step.label}
              </span>
            </div>
          );
        })}
      </div>
      {isCancelled ? (
        <p className='mt-2 text-center text-[10px] text-red-500/80 sm:text-[11px]'>
          Esta solicitação foi cancelada.
        </p>
      ) : null}
    </div>
  );
}

const SuccessTicketCard = forwardRef<HTMLElement, SuccessTicketCardProps>(
  ({ request }, ref) => {
    const requestedAt = format(
      parseISO(request.createdAt),
      "dd/MM/yyyy 'às' HH:mm",
    );
    const typeLabel = getChronoanalysisTypeLabel(
      request.chronoanalysisType as ChronoanalysisTypeValue,
    );
    const timingLabel = TIMING_TYPE_LABELS[request.timingType];
    const partLine = `${request.internalCode} · ${request.partNumber} · OP ${request.operation}`;
    const sectorLine = `${request.sectorCostCenter} · ${request.sectorName}`;
    const typeLine = `${timingLabel} · ${typeLabel}`;

    const ticketUrl = useMemo(() => {
      if (typeof window === 'undefined') return `/ticket/${request.id}`;
      return `${window.location.origin}/ticket/${request.id}`;
    }, [request.id]);

    return (
      <article
        ref={ref}
        className='relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-md'
      >
        <div className='flex flex-col items-center gap-1.5 px-4 py-2.5 sm:gap-2 sm:px-5 sm:py-3'>
          <div className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 sm:size-10'>
            <Clock className='size-4 text-white sm:size-5' strokeWidth={2} />
          </div>

          <div className='min-w-0 w-full'>
            <Text
              as='p'
              variant='little-text'
              className='block text-center text-secondary'
            >
              Solicitado em {requestedAt}
            </Text>

            <div className='mt-2 space-y-1 text-left'>
              <Text
                as='p'
                variant='little-text'
                className='block text-center text-secondary'
              >
                {request.employeeCardNumber} · {request.employeeName}
              </Text>

              <div className='min-w-0 space-y-0.5 py-1.5'>
                <div className='flex items-center justify-start gap-2'>
                  <Package className='size-3.5 shrink-0 text-secondary' />
                  <Text
                    as='p'
                    variant='sub-title'
                    className='block min-w-0 break-words font-bold leading-snug text-initial'
                  >
                    {partLine}
                  </Text>
                </div>
                <Text
                  as='p'
                  variant='little-text'
                  className='block break-words pl-5 leading-snug text-secondary'
                >
                  {sectorLine}
                </Text>
                <Text
                  as='p'
                  variant='little-text'
                  className='block break-words pl-5 leading-snug text-secondary'
                >
                  {typeLine}
                </Text>
              </div>

              {request.observation ? (
                <p className='mt-0.5 block break-words text-[11px] font-normal leading-snug text-secondary/60 sm:text-xs'>
                  Obs.: {request.observation}
                </p>
              ) : null}

              <TicketProgress status={request.status} />
            </div>
          </div>
        </div>

        <div className='relative'>
          <span
            aria-hidden
            className='pointer-events-none absolute top-1/2 -left-3 z-10 size-6 -translate-y-1/2 rounded-full bg-muted'
          />
          <span
            aria-hidden
            className='pointer-events-none absolute top-1/2 -right-3 z-10 size-6 -translate-y-1/2 rounded-full bg-muted'
          />
          <div
            aria-hidden
            className='mx-5 h-[2px] sm:mx-6'
            style={{
              backgroundImage:
                'repeating-linear-gradient(to right, var(--border) 0 8px, transparent 8px 14px)',
            }}
          />
        </div>

        <div className='flex flex-col items-center bg-zinc-50 px-4 py-5 sm:px-5 sm:py-6'>
          <QRCodeSVG
            value={ticketUrl}
            size={96}
            level='M'
            bgColor='transparent'
            fgColor='#18181b'
            className='size-20 sm:size-24'
          />
        </div>
      </article>
    );
  },
);

SuccessTicketCard.displayName = 'SuccessTicketCard';

export default SuccessTicketCard;

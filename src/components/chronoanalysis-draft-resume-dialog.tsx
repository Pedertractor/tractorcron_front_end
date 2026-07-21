import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Button from '@/components/ui/button/button';
import {
  deleteChronoanalysisDraft,
  getChronoanalysisDraft,
  type ChronoanalysisDraftResponse,
} from '@/api/chronoanalysis-api';
import {
  restoreChronoanalysisFromDraft,
  validateChronoanalysisSession,
} from '@/db/db-functions';
import { clients } from '@/seed/seed-client';
import { getTypeOfChronoanalysisFrontendLabel } from '@/constants/chronoanalysis-types';

const PROMPT_KEY = 'chronoDraftPromptHandled';

function DraftInfoRow({ label, value }: { label: string; value: string }) {
  if (!value || value === '-') return null;

  return (
    <div className='flex items-baseline justify-between gap-3 border-b border-border/30 py-1.5 last:border-b-0'>
      <span className='shrink-0 text-xs text-secondary'>{label}</span>
      <span className='truncate text-right text-sm font-medium text-initial'>
        {value}
      </span>
    </div>
  );
}

function formatDraftSummary(draft: ChronoanalysisDraftResponse) {
  const register = draft.payload.register;
  const clientName =
    clients.find((c) => c.id === register.clientId)?.name ?? '-';
  const activitiesCount = draft.payload.activities?.length ?? 0;
  const stageLabel =
    draft.stage === 'REVIEW' ? 'Revisão' : 'Cronometragem';
  const updatedAt = draft.updatedAt
    ? new Date(draft.updatedAt).toLocaleString('pt-BR')
    : null;

  return {
    clientName,
    partNumber: register.partNumber || '-',
    internalCode: register.internalCode || '-',
    sector: register.sectorName
      ? `${register.sectorName}${
          register.sectorCostCenter ? ` (${register.sectorCostCenter})` : ''
        }`
      : '-',
    typeLabel: getTypeOfChronoanalysisFrontendLabel(
      register.typeOfChronoanalysis
    ),
    of: register.of || '-',
    op: register.op || '-',
    activitiesCount: String(activitiesCount),
    stageLabel,
    updatedAt,
  };
}

export function ChronoanalysisDraftResumeDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<ChronoanalysisDraftResponse | null>(null);
  const checkingRef = useRef(false);

  useEffect(() => {
    async function checkDraft() {
      if (checkingRef.current) return;
      if (sessionStorage.getItem(PROMPT_KEY) === '1') return;

      checkingRef.current = true;

      try {
        const localValid = await validateChronoanalysisSession();
        if (localValid) {
          sessionStorage.setItem(PROMPT_KEY, '1');
          return;
        }

        const result = await getChronoanalysisDraft();
        if (result.status && result.data) {
          setDraft(result.data);
          setOpen(true);
        } else {
          sessionStorage.setItem(PROMPT_KEY, '1');
        }
      } finally {
        checkingRef.current = false;
      }
    }

    void checkDraft();
  }, []);

  async function handleResume() {
    setLoading(true);
    try {
      const result = await getChronoanalysisDraft();
      if (!result.status || !result.data) {
        setOpen(false);
        sessionStorage.setItem(PROMPT_KEY, '1');
        return;
      }

      await restoreChronoanalysisFromDraft(result.data);
      sessionStorage.setItem(PROMPT_KEY, '1');
      setOpen(false);

      const path =
        result.data.stage === 'REVIEW'
          ? '/cronoanalise/revisao'
          : '/cronoanalise/atividades';
      navigate(path, { replace: true });
    } finally {
      setLoading(false);
    }
  }

  async function handleDiscard() {
    setLoading(true);
    try {
      await deleteChronoanalysisDraft();
      sessionStorage.setItem(PROMPT_KEY, '1');
      setOpen(false);
      setDraft(null);
    } finally {
      setLoading(false);
    }
  }

  const summary = draft ? formatDraftSummary(draft) : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className='h-auto max-h-[90vh] w-full max-w-md border-border/40 shadow-md'
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Cronoanálise em andamento</DialogTitle>
          <DialogDescription>
            Você tem uma cronoanálise em execução. Deseja continuar de onde
            parou?
          </DialogDescription>
        </DialogHeader>

        {summary && (
          <div className='rounded-lg border border-border/40 bg-zinc-50/80 px-3 py-1'>
            <DraftInfoRow label='Cliente' value={summary.clientName} />
            <DraftInfoRow label='Peça' value={summary.partNumber} />
            <DraftInfoRow label='Cód. interno' value={summary.internalCode} />
            <DraftInfoRow label='Setor' value={summary.sector} />
            <DraftInfoRow label='Tipo' value={summary.typeLabel} />
            <DraftInfoRow label='OF' value={summary.of} />
            <DraftInfoRow label='OP' value={summary.op} />
            <DraftInfoRow
              label='Atividades'
              value={summary.activitiesCount}
            />
            <DraftInfoRow label='Etapa' value={summary.stageLabel} />
            {summary.updatedAt && (
              <DraftInfoRow label='Salvo em' value={summary.updatedAt} />
            )}
          </div>
        )}

        <DialogFooter className='gap-2 sm:gap-2'>
          <Button
            type='button'
            variant='red'
            size='md'
            className='border-0 shadow-none'
            disabled={loading}
            onClick={() => void handleDiscard()}
          >
            Descartar
          </Button>
          <Button
            type='button'
            variant='green'
            size='md'
            className='border-0 shadow-none'
            disabled={loading}
            onClick={() => void handleResume()}
          >
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

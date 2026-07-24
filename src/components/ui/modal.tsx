import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

import Button from './button/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const CONFIRM_LOADING_STEPS = [
  { label: 'enviando e-mail', durationMs: 1600 },
  { label: 'finalizando crono', durationMs: 1600 },
] as const;

const CONFIRM_SUCCESS_DURATION_MS = 1100;

const CONFIRM_LOADING_BEFORE_SUCCESS_MS = CONFIRM_LOADING_STEPS.reduce(
  (total, step) => total + step.durationMs,
  0,
);

/** Tempo mínimo do efeito até exibir o check. */
export const CONFIRM_LOADING_SEQUENCE_MS =
  CONFIRM_LOADING_BEFORE_SUCCESS_MS + CONFIRM_SUCCESS_DURATION_MS;

export async function waitConfirmLoadingSequence(
  startedAt: number,
  onSuccessStep?: () => void,
) {
  const elapsed = Date.now() - startedAt;
  const remainingBeforeSuccess = CONFIRM_LOADING_BEFORE_SUCCESS_MS - elapsed;

  if (remainingBeforeSuccess > 0) {
    await new Promise((resolve) =>
      setTimeout(resolve, remainingBeforeSuccess),
    );
  }

  onSuccessStep?.();
  await new Promise((resolve) =>
    setTimeout(resolve, CONFIRM_SUCCESS_DURATION_MS),
  );
}

function GrowingLetters({ text }: { text: string }) {
  return (
    <span className='inline-flex items-center justify-center' aria-label={text}>
      {text.split('').map((char, index) => (
        <span
          key={`${text}-${index}-${char}`}
          className='inline-block origin-bottom animate-in fade-in zoom-in-50 duration-300'
          style={{
            animationDelay: `${index * 45}ms`,
            animationFillMode: 'both',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

export interface PropsModal {
  open: boolean;
  title?: string;
  description?: string;
  isLoading: boolean;
  isSuccess?: boolean;
  setOpenModal: (props: boolean) => void;
  setConfirmModal: () => void | Promise<void>;
}

const Modal = ({
  open,
  title,
  description,
  isLoading,
  isSuccess = false,
  setOpenModal,
  setConfirmModal,
}: PropsModal) => {
  const [loadingStep, setLoadingStep] = useState(0);

  const busy = isLoading || isSuccess;

  useEffect(() => {
    if (!isLoading || isSuccess) {
      return;
    }

    setLoadingStep(0);
    const timer = setTimeout(() => {
      setLoadingStep(1);
    }, CONFIRM_LOADING_STEPS[0].durationMs);

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading, isSuccess]);

  useEffect(() => {
    if (!open) {
      setLoadingStep(0);
    }
  }, [open]);

  function handleOpenChange(nextOpen: boolean) {
    if (busy) return;
    setOpenModal(nextOpen);
  }

  const confirmLabel = isLoading
    ? CONFIRM_LOADING_STEPS[loadingStep].label
    : 'confirmar';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className='h-auto max-h-[90vh] w-[calc(100%-1.5rem)] max-w-md gap-4 overflow-y-auto border-0 p-4 shadow-xl sm:p-6'
        onPointerDownOutside={(event) => {
          if (busy) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          if (busy) event.preventDefault();
        }}
      >
        <DialogHeader className='text-left'>
          <DialogTitle className='text-base font-semibold sm:text-lg'>
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className='text-xs text-secondary sm:text-sm'>
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        <DialogFooter className='gap-2 sm:justify-end'>
          {!busy ? (
            <Button
              variant='red'
              size='md'
              type='button'
              onClick={() => setOpenModal(false)}
              className='w-full text-sm sm:w-[140px] sm:text-base'
            >
              cancelar
            </Button>
          ) : null}
          {busy ? (
            <div
              role='status'
              aria-live='polite'
              className='flex h-[48px] w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-zinc-100 text-sm font-semibold text-secondary sm:w-[180px] sm:text-base'
            >
              {isSuccess ? (
                <Check
                  className='size-5 text-emerald-500 animate-in zoom-in-50 fade-in duration-300'
                  strokeWidth={2.5}
                />
              ) : (
                <GrowingLetters key={confirmLabel} text={confirmLabel} />
              )}
            </div>
          ) : (
            <Button
              size='md'
              type='button'
              variant='green'
              onClick={() => void setConfirmModal()}
              className='w-full min-w-0 text-sm sm:w-[180px] sm:text-base'
            >
              confirmar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;

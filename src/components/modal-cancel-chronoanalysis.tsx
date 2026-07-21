import Button from '@/components/ui/button/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface ModalCancelChronoanalysisProps {
  open: boolean;
  isLoading?: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
}

const ModalCancelChronoanalysis = ({
  open,
  isLoading = false,
  setOpen,
  onConfirm,
}: ModalCancelChronoanalysisProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className='h-auto w-[calc(100%-2rem)] max-w-md border border-border bg-white shadow-md'
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader className='text-left'>
          <DialogTitle>Cancelar cronoanálise</DialogTitle>
          <DialogDescription>
            Deseja cancelar? O rascunho será descartado.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2 sm:gap-2'>
          <Button
            type='button'
            variant='default'
            size='md'
            disabled={isLoading}
            onClick={() => setOpen(false)}
            className='w-full border border-border sm:w-[140px]'
          >
            voltar
          </Button>
          <Button
            type='button'
            variant='red'
            size='md'
            disabled={isLoading}
            onClick={() => void onConfirm()}
            className='w-full whitespace-nowrap px-3 text-sm sm:w-auto sm:min-w-[200px]'
          >
            {isLoading ? 'cancelando...' : 'confirmar cancelamento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCancelChronoanalysis;

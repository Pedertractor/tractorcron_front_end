import Button from './button/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface PropsModal {
  open: boolean;
  title?: string;
  description?: string;
  isLoading: boolean;
  setOpenModal: (props: boolean) => void;
  setConfirmModal: () => void | Promise<void>;
}

const Modal = ({
  open,
  title,
  description,
  isLoading,
  setOpenModal,
  setConfirmModal,
}: PropsModal) => {
  return (
    <Dialog open={open} onOpenChange={setOpenModal}>
      <DialogContent
        showCloseButton={false}
        className='h-auto max-h-[90vh] w-[calc(100%-1.5rem)] max-w-md gap-4 overflow-y-auto border-0 p-4 shadow-xl sm:p-6'
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
          <Button
            variant='red'
            size='md'
            type='button'
            disabled={isLoading}
            onClick={() => setOpenModal(false)}
            className='w-full text-sm sm:w-[140px] sm:text-base'
          >
            cancelar
          </Button>
          <Button
            size='md'
            type='button'
            disabled={isLoading}
            variant='green'
            onClick={() => void setConfirmModal()}
            className='w-full text-sm sm:w-[140px] sm:text-base'
          >
            {isLoading ? 'enviando...' : 'confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;

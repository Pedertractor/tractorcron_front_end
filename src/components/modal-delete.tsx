import { deleteChrono } from '@/api/chronoanalysis-api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export interface ModalDeleteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setIsRefetch: (open: boolean) => void;
  idChronoanalysis: string;
}

const ModalDelete = ({
  idChronoanalysis,
  open,
  setOpen,
  setIsRefetch,
}: ModalDeleteProps) => {
  async function handleDeleteChrono() {
    const { status } = await deleteChrono(idChronoanalysis);

    if (status === 200) {
      toast.success('Cronoanálise deletada com sucesso.');
      setIsRefetch(true);
      setOpen(false);
      return;
    }

    toast.error('Erro ao deletar cronoanálise');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className='h-auto w-[calc(100%-2rem)] max-w-md border border-border bg-white shadow-md'
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Remover cronoanálise</DialogTitle>
          <DialogDescription>
            Você realmente deseja apagar esta cronoanálise? Essa ação não
            poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2 sm:gap-2'>
          <Button type='button' variant='outline' onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={() => void handleDeleteChrono()}
          >
            Deletar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDelete;

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog';
import Button from './ui/button/button';
import { deleteChrono } from '@/api/chronoanalysis-api';
import { toast } from 'sonner';
import { DialogTitle } from '@radix-ui/react-dialog';

export interface ModalDeleteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setIdChrono: (open: string | null) => void;
  setIsRefetch: (open: boolean) => void;
  idChronoanalysis: string;
}

const ModalDelete = ({
  idChronoanalysis,
  open,
  setOpen,
  setIdChrono,
  setIsRefetch,
}: ModalDeleteProps) => {
  async function handleDeleteChrono() {
    console.log(idChronoanalysis);

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
      <DialogContent className='w-1/2 h-fit bg-white border-none flex flex-col'>
        <DialogHeader className=' h-fit'>
          <DialogTitle className=' font-bold'>Remover cronoanálise</DialogTitle>
          <DialogDescription className=' flex justify-between items-center'></DialogDescription>
        </DialogHeader>
        <p>Você realmente deseja apagar esta cronoanálise?</p>
        <p>Essa ação não poderá ser desfeita!</p>
        <div className=' flex gap-4 w-full justify-end items-center mt-5'>
          <Button
            variant={'red'}
            size={'md'}
            type='button'
            onClick={() => {
              setIdChrono(null);
              setOpen(false);
            }}
          >
            cancelar
          </Button>
          <Button
            variant={'default'}
            size={'md'}
            type='button'
            onClick={() => handleDeleteChrono()}
          >
            deletar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDelete;

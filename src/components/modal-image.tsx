import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PartUniqueType } from '@/hooks/use-parts';
const URL_API_BASE_IMG = import.meta.env.VITE_URL_API_BASE_PEDERTRACTOR_IMG;
type ModalImageType = {
  setOpenModal: (props: boolean) => void;
  openModal: boolean;
  partData?: PartUniqueType | null;
};

const ModalImage = ({ openModal, setOpenModal, partData }: ModalImageType) => {
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent className=' bg-white border-none shadow-xs '>
        <DialogHeader>
          <DialogTitle>Imagem da peça {partData?.partCode}</DialogTitle>
          <DialogDescription className=' bg-white w-full h-[55%]'>
            {partData?.localPath && (
              <img
                className=' h-full w-full'
                src={`${URL_API_BASE_IMG}${partData?.localPath}`}
                alt={`${partData?.partCode}`}
              />
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ModalImage;

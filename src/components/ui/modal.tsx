import Button from './button/button';
import Text from './text';

export interface PropsModal {
  title?: string;
  description?: string;
  isLoading: boolean;
  setOpenModal: (props: boolean) => void;
  setConfirmModal: () => void | Promise<void>; // <- função genérica
}

const Modal = ({
  title,
  description,
  isLoading,
  setOpenModal,
  setConfirmModal,
}: PropsModal) => {
  return (
    <div className=' fixed top-0 right-0 w-full h-full bg-[#0000005f] flex items-center justify-center'>
      <div className=' w-1/2 h-1/3 bg-white rounded-lg p-5 flex flex-col  justify-between'>
        <Text as='h2' variant={'sub-title'}>
          {title}
        </Text>
        <Text>{description}</Text>
        <div className=' flex items-center justify-end w-full gap-5'>
          <Button
            size={'md'}
            type='submit'
            disabled={isLoading}
            onClick={() => setConfirmModal()}
          >
            confirmar
          </Button>
          <Button
            variant={'red'}
            size={'md'}
            onClick={() => setOpenModal(false)}
          >
            cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

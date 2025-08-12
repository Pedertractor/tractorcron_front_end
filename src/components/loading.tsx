import { LoaderCircle } from 'lucide-react';

const Loading = () => {
  return (
    <div className=' w-full h-full flex items-center justify-center rounded-lg'>
      <div className=' animate-spin text-secondary rounded-full'>
        <LoaderCircle />
      </div>
    </div>
  );
};

export default Loading;

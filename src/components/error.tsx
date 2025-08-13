import { XCircleIcon } from 'lucide-react';

const Error = () => {
  return (
    <div className=' w-full h-full flex items-center justify-center rounded-lg'>
      <XCircleIcon
        size={16}
        className='stroke-red-900 bg-red-100 rounded-full'
      />
    </div>
  );
};

export default Error;

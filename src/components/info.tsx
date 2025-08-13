import { InfoIcon } from 'lucide-react';

const Info = () => {
  return (
    <div className=' w-full h-full flex items-center justify-center rounded-lg'>
      <InfoIcon
        size={16}
        className='stroke-blue-900 bg-blue-100 rounded-full'
      />
    </div>
  );
};

export default Info;

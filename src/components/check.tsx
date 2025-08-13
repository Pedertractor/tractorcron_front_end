import { CheckCircle2 } from 'lucide-react';

const Check = () => {
  return (
    <div className=' w-full h-full flex items-center justify-center rounded-lg'>
      <CheckCircle2
        size={16}
        className='stroke-green-900 bg-green-100 rounded-full'
      />
    </div>
  );
};

export default Check;

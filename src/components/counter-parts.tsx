import Label from './ui/label/label';
import { Minus, Plus } from 'lucide-react';

export interface CounterPartsProps {
  numberOfParts: number;
  setNumberOfParts: React.Dispatch<React.SetStateAction<number>>;
}

const CounterParts = ({
  numberOfParts,
  setNumberOfParts,
}: CounterPartsProps) => {
  return (
    <Label title='Nº de peças' className='w-full'>
      <div className='flex h-9 w-full items-stretch overflow-hidden rounded-xl'>
        <button
          onClick={() =>
            setNumberOfParts((prev) => {
              if (prev > 1) return prev - 1;
              else return prev;
            })
          }
          type='button'
          aria-label='Diminuir quantidade de peças'
          className='flex h-full w-11 shrink-0 items-center justify-center rounded-l-xl bg-background-base-blue-select text-white sm:w-12'
        >
          <Minus className='size-4 sm:size-5' strokeWidth={2.5} />
        </button>
        <div className='flex h-full min-w-[2.5rem] flex-1 items-center justify-center border-y border-border bg-white text-sm font-bold text-zinc-800 sm:text-base'>
          {numberOfParts}
        </div>
        <button
          onClick={() => setNumberOfParts((prev) => prev + 1)}
          type='button'
          aria-label='Aumentar quantidade de peças'
          className='flex h-full w-11 shrink-0 items-center justify-center rounded-r-xl bg-background-base-blue-select text-white sm:w-12'
        >
          <Plus className='size-4 sm:size-5' strokeWidth={2.5} />
        </button>
      </div>
    </Label>
  );
};

export default CounterParts;

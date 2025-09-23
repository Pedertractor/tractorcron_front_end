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
    <Label title='Nº de peças'>
      <div className=' flex items-center justify-center  h-[48px] rounded-xl '>
        <button
          onClick={() =>
            setNumberOfParts((prev) => {
              if (prev > 1) return prev - 1;
              else return prev;
            })
          }
          type='button'
          className=' text-white bg-background-base-blue-select w-full h-full rounded-l-xl flex items-center justify-center'
        >
          <Minus />
        </button>
        <div className=' w-full flex items-center justify-center text-zinc-800 font-bold border border-border h-full'>
          {numberOfParts}
        </div>
        <button
          onClick={() => setNumberOfParts((prev) => prev + 1)}
          type='button'
          className=' text-white bg-background-base-blue-select w-full h-full rounded-r-xl flex items-center justify-center'
        >
          <Plus />
        </button>
      </div>
    </Label>
  );
};

export default CounterParts;

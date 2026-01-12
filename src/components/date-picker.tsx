import { Calendar, ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarRange } from './calendar/calendar';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

type Props = {
  value?: DateRange;
  onChange: (value: DateRange | undefined) => void;
};
export function DatePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [isYear, setIsYear] = useState<string | null>(null);

  const years = ['2025', '2026'];

  function handleClickYear(year: string) {
    if (year === isYear) {
      onChange({
        from: new Date(),
        to: new Date(),
      });
      return setIsYear(null);
    }

    setIsYear(year);
    onChange({
      from: new Date(`01-01-${year}`),
      to: new Date(`12-31-${year}`),
    });
  }

  return (
    <div className=' w-full flex items-center gap-2'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            size={'sm'}
            className='text-secondary border-border cursor-pointer'
          >
            <Calendar />
            {value
              ? `${value.from?.toLocaleDateString()} - ${value.to?.toLocaleDateString()}`
              : 'Selecione um periodo'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto overflow-hidden p-0 bg-white border-none shadow-lg'
          align='start'
        >
          <CalendarRange dateRange={value} setDateRange={onChange} />
        </PopoverContent>
      </Popover>
      {years.map((year, index) => (
        <Button
          variant={'outline'}
          size={'sm'}
          key={`${index}-${year}`}
          className={`cursor-pointer text-secondary border-border ${
            isYear === year
              ? 'bg-background-blue-active border-background-base-blue-active'
              : ''
          }  `}
          onClick={() => handleClickYear(year)}
        >
          {year}
        </Button>
      ))}
    </div>
  );
}

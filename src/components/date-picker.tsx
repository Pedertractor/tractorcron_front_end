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
import { cn } from '@/lib/utils';

type Props = {
  value?: DateRange;
  onChange: (value: DateRange | undefined) => void;
  homePage?: boolean;
};
export function DatePicker({ value, onChange, homePage }: Props) {
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
    <div
      className={cn(
        'flex items-center gap-2',
        homePage ? 'w-fit shrink-0' : 'w-full min-w-0',
      )}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {homePage ? (
            <Button
              variant='outline'
              size='sm'
              className='cursor-pointer border-border text-secondary'
            >
              <Calendar />
              {value
                ? `${value.from?.toLocaleDateString()} - ${value.to?.toLocaleDateString()}`
                : 'Selecione um período'}
              <ChevronDownIcon />
            </Button>
          ) : (
            <button
              type='button'
              className={cn(
                // Mesmas dimensões dos <Select> do filtro (h-fit py-2), sem forçar h-[48px]
                'border-border text-secondary bg-background flex h-fit w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm font-normal outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
              )}
            >
              <Calendar className='size-4 shrink-0' />
              <span className='min-w-0 flex-1 truncate'>
                {value
                  ? `${value.from?.toLocaleDateString()} - ${value.to?.toLocaleDateString()}`
                  : 'Selecione um período'}
              </span>
              <ChevronDownIcon className='size-4 shrink-0' />
            </button>
          )}
        </PopoverTrigger>
        <PopoverContent
          className='w-auto overflow-hidden p-0 bg-white border-none shadow-lg'
          align='start'
        >
          <CalendarRange dateRange={value} setDateRange={onChange} />
        </PopoverContent>
      </Popover>
      {homePage &&
        years.map((year, index) => (
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

import { Calendar, ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarRange } from './calendar/calendar';
import { useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { endOfYear, startOfYear } from 'date-fns';

type Props = {
  value?: DateRange;
  onChange: (value: DateRange | undefined) => void;
  homePage?: boolean;
};

function isFullYearRange(range: DateRange | undefined, year: number) {
  if (!range?.from || !range?.to) return false;
  const from = startOfYear(new Date(year, 0, 1));
  const to = endOfYear(new Date(year, 0, 1));
  return (
    range.from.getFullYear() === year &&
    range.to.getFullYear() === year &&
    range.from.getMonth() === from.getMonth() &&
    range.from.getDate() === from.getDate() &&
    range.to.getMonth() === to.getMonth() &&
    range.to.getDate() === to.getDate()
  );
}

export function DatePicker({ value, onChange, homePage }: Props) {
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const [isYear, setIsYear] = useState<string | null>(
    homePage ? String(currentYear) : null,
  );

  const years = useMemo(
    () => [String(currentYear - 1), String(currentYear)],
    [currentYear],
  );

  useEffect(() => {
    if (!homePage) return;
    const matchedYear = years.find((year) =>
      isFullYearRange(value, Number(year)),
    );
    setIsYear(matchedYear ?? null);
  }, [homePage, value, years]);

  function handleClickYear(year: string) {
    if (year === isYear) {
      onChange({
        from: new Date(),
        to: new Date(),
      });
      return setIsYear(null);
    }

    const yearNumber = Number(year);
    setIsYear(year);
    onChange({
      from: startOfYear(new Date(yearNumber, 0, 1)),
      to: endOfYear(new Date(yearNumber, 0, 1)),
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
          className='w-auto overflow-hidden border-none bg-white p-0 shadow-lg'
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
            className={`cursor-pointer border-border text-secondary ${
              isYear === year
                ? 'border-background-base-blue-active bg-background-blue-active'
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

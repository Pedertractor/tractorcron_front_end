import { Calendar, ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Label from './ui/label/label';
import { CalendarRange } from './calendar/calendar';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

type Props = {
  value?: DateRange;
  onChange: (value: DateRange | undefined) => void;
};
export function DatePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className=''>
      <Label title='Data'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              id='date'
              className=' h-fit py-2 mt-0.5  rounded-lg text-secondary border-border'
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
      </Label>
    </div>
  );
}

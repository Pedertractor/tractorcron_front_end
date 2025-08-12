import { type DateRange } from 'react-day-picker';

import { Calendar } from '@/components/ui/calendar';
import { ptBR } from 'date-fns/locale';

interface DateRangeCalendarProps {
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
}

export function CalendarRange({
  dateRange,
  setDateRange,
}: DateRangeCalendarProps) {
  return (
    <Calendar
      locale={ptBR}
      mode='range'
      selected={dateRange ?? undefined}
      onSelect={(range) => {
        setDateRange(range);
      }}
      className='shadow-lg'
    />
  );
}

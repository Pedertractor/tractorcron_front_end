import { useEffect, useState, type ChangeEvent } from 'react';
import { format, parse, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Props = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  'aria-invalid'?: boolean;
};

function parseIsoDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const parsed = parse(value, 'yyyy-MM-dd', new Date());
  return isValid(parsed) ? parsed : undefined;
}

function isoToDisplay(value?: string): string {
  const date = parseIsoDate(value);
  return date ? format(date, 'dd/MM/yyyy') : '';
}

function maskDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseDisplayDate(display: string): Date | undefined {
  if (display.length !== 10) return undefined;
  const parsed = parse(display, 'dd/MM/yyyy', new Date());
  if (!isValid(parsed)) return undefined;
  // Garante que a digitação bate com a data (ex: 31/02 inválido)
  if (format(parsed, 'dd/MM/yyyy') !== display) return undefined;
  return parsed;
}

export function DatePickerSingle({
  value,
  onChange,
  placeholder = 'dd/mm/aaaa',
  className,
  disabled,
  id,
  'aria-invalid': ariaInvalid,
}: Props) {
  const [open, setOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState(() => isoToDisplay(value));
  const selected = parseIsoDate(value);

  useEffect(() => {
    setDisplayValue(isoToDisplay(value));
  }, [value]);

  function commitDate(date: Date | undefined) {
    onChange(date ? format(date, 'yyyy-MM-dd') : '');
    setDisplayValue(date ? format(date, 'dd/MM/yyyy') : '');
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const next = maskDateInput(event.target.value);
    setDisplayValue(next);

    if (next.length === 0) {
      onChange('');
      return;
    }

    const parsed = parseDisplayDate(next);
    if (parsed) onChange(format(parsed, 'yyyy-MM-dd'));
  }

  function handleInputBlur() {
    if (!displayValue) {
      onChange('');
      return;
    }

    const parsed = parseDisplayDate(displayValue);
    if (parsed) {
      commitDate(parsed);
      return;
    }

    // Valor incompleto/inválido: restaura o último valor válido
    setDisplayValue(isoToDisplay(value));
  }

  function handleSelect(date: Date | undefined) {
    commitDate(date);
    if (date) setOpen(false);
  }

  return (
    <div className={cn('relative w-full', className)}>
      <input
        type='text'
        inputMode='numeric'
        autoComplete='off'
        id={id}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        placeholder={placeholder}
        value={displayValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className={cn(
          'border-input bg-transparent text-foreground shadow-xs h-9 w-full min-w-0 rounded-md border px-3 py-1 pr-9 text-sm outline-none transition-[color,box-shadow]',
          'placeholder:text-muted-foreground',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type='button'
            disabled={disabled}
            aria-label='Abrir calendário'
            className={cn(
              'text-muted-foreground absolute top-1/2 right-1 flex size-7 -translate-y-1/2 items-center justify-center rounded-md outline-none',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'disabled:pointer-events-none disabled:opacity-50',
            )}
          >
            <CalendarIcon className='size-4' />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto overflow-hidden border-none bg-white p-0 shadow-lg'
          align='end'
        >
          <Calendar
            locale={ptBR}
            mode='single'
            selected={selected}
            onSelect={handleSelect}
            defaultMonth={selected}
            captionLayout='dropdown'
            startMonth={new Date(new Date().getFullYear() - 5, 0)}
            endMonth={new Date(new Date().getFullYear() + 5, 11)}
            className='shadow-lg'
          />
          <div className='flex items-center justify-between border-t px-3 py-2'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='text-primary h-8 px-2'
              onClick={() => handleSelect(undefined)}
            >
              Limpar
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='text-primary h-8 px-2'
              onClick={() => handleSelect(new Date())}
            >
              Hoje
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

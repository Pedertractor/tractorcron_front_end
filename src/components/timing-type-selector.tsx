import type { CSSProperties } from 'react';
import type { TimingType } from '@/types/chronoanalysis-request-types';

const TIMING_OPTIONS: Array<{
  value: TimingType;
  label: string;
}> = [
  { value: 'FIRST_CRON', label: 'Primeira cronometragem' },
  { value: 'KAIZEN', label: 'Kaizen' },
  { value: 'TIME_REVIEW', label: 'Revisão de tempo' },
];

type TimingTypeSelectorProps = {
  value?: TimingType;
  partExists: boolean | null;
  onSelect: (value: TimingType) => void;
};

function isOptionDisabled(
  option: TimingType,
  partExists: boolean | null,
): boolean {
  if (partExists === true && option === 'FIRST_CRON') return true;
  if (partExists === false && option === 'TIME_REVIEW') return true;
  return false;
}

const disabledStyle: CSSProperties = {
  width: '100%',
  minHeight: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  padding: '8px 12px',
  fontWeight: 600,
  fontSize: 14,
  lineHeight: 1.2,
  textAlign: 'center',
  cursor: 'not-allowed',
  pointerEvents: 'none',
  userSelect: 'none',
  opacity: 1,
  backgroundColor: '#ededed',
  color: '#2b2b2b',
  WebkitTextFillColor: '#2b2b2b',
  border: '1.5px dashed #9a9a9a',
  textDecoration: 'line-through',
  textDecorationColor: '#2b2b2b',
  boxSizing: 'border-box',
};

const TimingTypeSelector = ({
  value,
  partExists,
  onSelect,
}: TimingTypeSelectorProps) => {
  return (
    <div className='flex w-full flex-col gap-1 sm:flex-row'>
      {TIMING_OPTIONS.map((option) => {
        const disabled = isOptionDisabled(option.value, partExists);
        const selected = value === option.value;

        if (disabled) {
          return (
            <div
              key={option.value}
              role='presentation'
              aria-disabled='true'
              style={disabledStyle}
            >
              {option.label}
            </div>
          );
        }

        return (
          <button
            key={option.value}
            type='button'
            onClick={() => onSelect(option.value)}
            className={[
              'flex min-h-10 w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition',
              selected
                ? 'bg-background-base-blue-select text-white'
                : 'bg-background-default text-initial',
            ].join(' ')}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default TimingTypeSelector;

import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import type { PropsClients } from '@/types/clients-types';
import type { listChronoanalistProps } from '@/types/user-types';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EMPTY_VALUE = '__empty__';

type SelectFieldBaseProps = {
  listOptions?: PropsClients[];
  listOptionsChronoanalist?: listChronoanalistProps[];
  listEnumOptions?: { value: string; label: string }[];
  chronoanalistOptionValue?: 'employeeId' | 'id';
  listTypeChronoanalist?: string[];
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  emptyOptionLabel?: string;
};

type SelectFieldControlledProps<T extends FieldValues> = SelectFieldBaseProps & {
  name: FieldPath<T>;
  control: Control<T>;
  value?: never;
  onValueChange?: never;
};

type SelectFieldStandaloneProps = SelectFieldBaseProps & {
  value?: string;
  onValueChange?: (value: string) => void;
  name?: never;
  control?: never;
};

export type SelectFieldProps<T extends FieldValues = FieldValues> =
  | SelectFieldControlledProps<T>
  | SelectFieldStandaloneProps;

function SelectFieldInner({
  value,
  onValueChange,
  listOptions,
  listOptionsChronoanalist,
  listEnumOptions,
  chronoanalistOptionValue = 'employeeId',
  listTypeChronoanalist,
  className,
  disabled,
  placeholder = 'Todos',
  emptyOptionLabel = 'Todos',
}: SelectFieldBaseProps & {
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  const normalizedValue =
    value === '' || value === undefined || value === null
      ? EMPTY_VALUE
      : String(value);

  const handleChange = (selected: string) => {
    onValueChange?.(selected === EMPTY_VALUE ? '' : selected);
  };

  return (
    <Select
      value={normalizedValue}
      onValueChange={handleChange}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          'h-9 w-full font-normal text-secondary sm:h-10',
          disabled && 'pointer-events-none border-dashed opacity-40',
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={EMPTY_VALUE}>{emptyOptionLabel}</SelectItem>
        {listOptions?.map((option) => (
          <SelectItem key={option.id} value={String(option.id)}>
            {option.name}
          </SelectItem>
        ))}
        {listOptionsChronoanalist?.map((option) => (
          <SelectItem
            key={`${option.id}-${option.employeeId}`}
            value={String(option[chronoanalistOptionValue])}
          >
            {option.employeeName}
          </SelectItem>
        ))}
        {listEnumOptions?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
        {listTypeChronoanalist?.map((option, index) => (
          <SelectItem key={index} value={String(index)}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SelectField<T extends FieldValues>(props: SelectFieldProps<T>) {
  if ('control' in props && props.control && props.name) {
    const { control, name, ...rest } = props;

    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <SelectFieldInner
            {...rest}
            value={field.value}
            onValueChange={field.onChange}
          />
        )}
      />
    );
  }

  const { value, onValueChange, ...rest } = props as SelectFieldStandaloneProps;

  return (
    <SelectFieldInner
      {...rest}
      value={value}
      onValueChange={onValueChange}
    />
  );
}

export default SelectField;

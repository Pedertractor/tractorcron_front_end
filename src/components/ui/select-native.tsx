import React from 'react';
import type { PropsClients } from '../../types/clients-types';
import { cva, type VariantProps } from 'class-variance-authority';
import type { listChronoanalistProps } from '@/types/user-types';

export const variantsSelect = cva('border rounded-lg h-[48px] py-0.5 px-3', {
  variants: {
    variant: {
      default: ' text-secondary border-border',
    },
    disabled: {
      true: 'opacity-40 border-dashed text-disabled border-disabled pointer-events-none',
    },
  },
  defaultVariants: {
    variant: 'default',
    disabled: false,
  },
});

export interface PropsSelect
  extends React.ComponentProps<'select'>, VariantProps<typeof variantsSelect> {
  listOptions?: [] | PropsClients[];
  listOptionsChronoanalist?: [] | listChronoanalistProps[];
  /** Valor do <option> para cronoanalistas: `employeeId` (padrão, ex. página Análise) ou `id` do usuário (ex. dashboard). */
  chronoanalistOptionValue?: 'employeeId' | 'id';
  listTypeChronoanalist?: [] | string[];
  className?: string;
  disabled?: boolean;
}

const SelectNative = ({
  listOptions,
  listOptionsChronoanalist,
  chronoanalistOptionValue = 'employeeId',
  listTypeChronoanalist,
  className,
  disabled,
  ...props
}: PropsSelect) => {
  return (
    <select
      disabled={disabled}
      className={variantsSelect({ disabled, className })}
      {...props}
    >
      <option value='' defaultValue={''}>
        Todos
      </option>
      {listOptions &&
        listOptions.map((option, index) => (
          <option key={index} value={option.id}>
            {option.name}
          </option>
        ))}

      {listOptionsChronoanalist &&
        listOptionsChronoanalist.map((option) => (
          <option
            key={`${option.id}-${option.employeeId}`}
            value={option[chronoanalistOptionValue]}
          >
            {option.employeeName}
          </option>
        ))}

      {listTypeChronoanalist &&
        listTypeChronoanalist.map((option, index) => (
          <option key={index} value={index}>
            {option}
          </option>
        ))}
    </select>
  );
};

export default SelectNative;

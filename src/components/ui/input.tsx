import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const variantsInputs = cva('border rounded-lg h-[48px] py-0.5 px-3', {
  variants: {
    variant: {
      default: ' text-secondary border-border',
    },
    disabled: {
      true: 'border-dashed text-disabled border-disabled pointer-events-none',
    },
  },
  defaultVariants: {
    variant: 'default',
    disabled: false,
  },
});

export interface PropsInput
  extends Omit<React.ComponentProps<'input'>, 'disabled'>,
    VariantProps<typeof variantsInputs> {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

const Input = ({
  className,
  placeholder,
  variant,
  disabled,
  ...props
}: PropsInput) => {
  return (
    <input
      placeholder={placeholder}
      disabled={disabled}
      className={variantsInputs({ variant, disabled, className })}
      {...props}
    />
  );
};

export default Input;

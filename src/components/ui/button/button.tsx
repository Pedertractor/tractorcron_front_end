import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import Icon from '../icon';

export const buttonVariants = cva(
  'text-initial font-semibold rounded-lg flex items-center justify-center gap-1.5 transition',
  {
    variants: {
      variant: {
        default: 'bg-background-default ',
        blue: 'text-white stroke-white bg-background-blue active:bg-background-blue-active',
        'select-blue':
          ' bg-background-base-blue-select text-white stroke-white',
        red: 'text-white stroke-white bg-background-red active:bg-background-red-active',
        green:
          'text-white stroke-white bg-background-green active:bg-background-green-active',
        orange:
          'text-white stroke-white bg-background-orange active:bg-background-orange-active',
        'base-yellow': ' text-white stroke-white bg-background-base-yellow ',
        'select-yellow':
          'text-white stroke-white bg-background-base-yellow-select',
        'base-blue': ' text-white stroke-white bg-background-base-blue ',
      },

      size: {
        mobile: 'w-[48px] h-[48px]',
        md: 'w-[140px] h-[48px]',
        full: 'w-full h-[48px] ',
        ' md-desk': '',
      },
      disabled: {
        true: ' border border-border text-secondary stroke-disabled bg-white border-dashed pointer-events-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'mobile',
      disabled: false,
    },
  }
);

export interface PropsButton
  extends Omit<React.ComponentProps<'button'>, 'size' | 'disabled'>,
    VariantProps<typeof buttonVariants> {
  svg?: React.ComponentProps<typeof Icon>['svg'];
  children?: React.ReactNode;
  disabled?: boolean;
}

const Button = ({
  variant,
  size,
  disabled,
  className,
  svg,
  children,
  ...props
}: PropsButton) => {
  if (svg && !children)
    return (
      <button
        disabled={disabled}
        className={buttonVariants({ variant, disabled, size, className })}
        {...props}
      >
        <Icon svg={svg} />
      </button>
    );

  if (!svg && children)
    return (
      <button
        disabled={disabled}
        className={buttonVariants({ variant, disabled, size, className })}
        {...props}
      >
        {children}
      </button>
    );

  if (svg && children)
    return (
      <button
        disabled={disabled}
        className={buttonVariants({ variant, disabled, size, className })}
        {...props}
      >
        <Icon svg={svg} />
        {children}
      </button>
    );
};

export default Button;

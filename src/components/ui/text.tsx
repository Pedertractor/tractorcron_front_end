import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const textVariants = cva('text-initial', {
  variants: {
    variant: {
      'master-title':
        'text-3xl font-extrabold leading-none sm:text-[48px]',
      title: 'text-lg font-bold leading-tight sm:text-2xl',
      'sub-title': 'text-base font-semibold leading-snug sm:text-xl',
      information: 'text-sm font-semibold sm:text-base',
      'text-label': 'text-xs font-medium text-secondary sm:text-sm',
      'text-input': 'text-sm font-normal text-secondary sm:text-base',
      'little-text': 'text-xs font-normal text-secondary sm:text-sm',
    },
  },
  defaultVariants: {
    variant: 'text-input',
  },
});

export interface TextProps extends VariantProps<typeof textVariants> {
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
}
const Text = ({
  as = 'span',
  variant,
  className,
  children,
  ...props
}: TextProps) => {
  return React.createElement(
    as,
    {
      className: textVariants({ variant, className }),
      ...props,
    },
    children
  );
};

export default Text;

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const textVariants = cva(' text-initial text-base leading-6', {
  variants: {
    variant: {
      'master-title': ' text-[48px] font-extrabold leading-none',
      title: 'font-bold text-[24px]',
      'sub-title': 'font-semibold text-xl',
      information: 'font-semibold text-base',
      'text-label': 'font-medium text-secondary',
      'text-input': 'font-normal text-secondary',
      'little-text': 'font-normal text-secondary text-sm',
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

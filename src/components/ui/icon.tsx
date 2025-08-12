import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const iconVariants = cva('transition', {
  variants: {
    animate: {
      false: '',
      true: 'animate-spin',
    },
  },
  defaultVariants: {
    animate: false,
  },
});

export interface IconProps
  extends React.ComponentProps<'svg'>,
    VariantProps<typeof iconVariants> {
  svg: React.FC<React.ComponentProps<'svg'>>;
}

const Icon = ({
  svg: SvgComponent,
  animate,
  className,
  ...props
}: IconProps) => {
  return (
    <SvgComponent className={iconVariants({ animate, className })} {...props} />
  );
};

export default Icon;

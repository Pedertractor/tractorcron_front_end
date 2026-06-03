import React from 'react';
import Text from '../text';

export interface PropsLabel {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Label = ({ title, children, className }: PropsLabel) => {
  return (
    <label className={`flex w-full flex-col gap-0.5 sm:gap-1 ${className}`}>
      <Text as='p' variant={'text-label'}>
        {title}
      </Text>
      {children}
    </label>
  );
};

export default Label;

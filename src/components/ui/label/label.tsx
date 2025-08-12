import React from 'react';
import Text from '../text';

export interface PropsLabel {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Label = ({ title, children, className }: PropsLabel) => {
  return (
    <label className={`flex flex-col gap-1 w-full ${className}`}>
      <Text as='p' variant={'text-label'}>
        {title}
      </Text>
      {children}
    </label>
  );
};

export default Label;

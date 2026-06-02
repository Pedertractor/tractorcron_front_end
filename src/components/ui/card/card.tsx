import type React from 'react';
import { cn } from '@/lib/utils';
import Text from '../text';

export interface PropsCard {
  text?: string;
  children: React.ReactNode;
  className?: string;
}

const Card = ({ text, children, className }: PropsCard) => {
  return (
    <section
      className={cn(
        'flex w-full flex-col gap-3 rounded-lg border border-border p-3',
        className,
      )}
    >
      {text && (
        <Text variant={'sub-title'} as={'h2'} className=' '>
          {text}
        </Text>
      )}

      {children}
    </section>
  );
};

export default Card;

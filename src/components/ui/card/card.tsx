import type React from 'react';
import Text from '../text';

export interface PropsCard {
  text?: string;
  children: React.ReactNode;
  className?: string;
}

const Card = ({ text, children, className }: PropsCard) => {
  return (
    <section
      className={`p-3 rounded-lg border border-border w-full flex flex-col justify-center gap-3 ${className}`}
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

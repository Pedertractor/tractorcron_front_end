import { useMemo } from 'react';

const RandomIconUser = ({ name }: { name: string | null }) => {
  const [randomBg, randomText] = useMemo(() => {
    const bgColors = [
      'bg-background-default-active',
      'bg-background-blue-active',
      'bg-background-red-active',
      'bg-background-green-active',
      'bg-background-orange-active',
    ];
    const textColors = ['text-white', 'text-initial', 'text-secondary'];
    const bg = bgColors[Math.floor(Math.random() * bgColors.length)];
    const text = textColors[Math.floor(Math.random() * textColors.length)];
    return [bg, text];
  }, []);

  if (!name) return null;

  return (
    <div
      className={`${randomBg} ${randomText} hover:cursor-pointer rounded-lg w-9 h-9 flex items-center justify-center`}
    >
      <span className=' text-sm font-semibold'>{name.slice(0, 1)}</span>
    </div>
  );
};

export default RandomIconUser;

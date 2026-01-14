import GoldenZoneSvg from '@/assets/golden_zone.svg?react';
import { useMemo } from 'react';

const GoldenZoneClassification = ({
  totalGoldenZone,
}: {
  totalGoldenZone: {
    name: string;
    total: number;
  }[];
}) => {
  const structGoldenZone = useMemo(() => {
    const base = [
      { name: 'AA', total: 0 },
      { name: 'B', total: 0 },
      { name: 'C', total: 0 },
      { name: 'D', total: 0 },
      { name: 'A', total: 0 },
    ];

    return base.map((item) => {
      const goldenZone = totalGoldenZone.find(
        (zone) => zone.name === item.name
      );

      return {
        ...item,
        total: goldenZone ? goldenZone.total : item.total,
      };
    });
  }, [totalGoldenZone]);

  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <div className=' flex items-center gap-1 relative '>
        {structGoldenZone.map((item, index) => (
          <div
            key={index}
            className={`absolute ${
              item.name === 'AA'
                ? ' right-45 bottom-55'
                : item.name === 'A'
                ? ' right-26 bottom-39'
                : item.name === 'B'
                ? ' right-45 bottom-66'
                : item.name === 'C'
                ? 'right-45 bottom-17'
                : 'right-10 bottom-15'
            }`}
          >
            <span className=' font-bold text-md text-white '>{item.total}</span>
          </div>
        ))}

        <GoldenZoneSvg />
      </div>
    </div>
  );
};

export default GoldenZoneClassification;

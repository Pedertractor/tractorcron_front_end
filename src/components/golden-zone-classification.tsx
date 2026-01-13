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
  console.log(totalGoldenZone);
  const structGoldenZone = useMemo(() => {
    const base = [
      { name: 'AA', total: 0, right: 38, bottom: 52 },
      { name: 'A', total: 0, right: 20, bottom: 35 },
      { name: 'B', total: 0, right: 38, bottom: 63 },
      { name: 'C', total: 0, right: 37, bottom: 15 },
      { name: 'D', total: 0, right: 5, bottom: 12 },
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
            className={`absolute right-${item.right} bottom-${item.bottom} h-10 w-10`}
          >
            <span className=' font-bold text-md text-white w-full'>
              {item.total}
            </span>
          </div>
        ))}

        <GoldenZoneSvg />
      </div>
    </div>
  );
};

export default GoldenZoneClassification;

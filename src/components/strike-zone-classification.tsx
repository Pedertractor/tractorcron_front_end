import { useMemo } from 'react';

const StrikeZoneClassification = ({
  totalStrikeZone,
}: {
  totalStrikeZone: { name: string; total: number }[];
}) => {
  const structStrikeZone = useMemo(() => {
    const base = [
      { name: 'C', total: null, color: '#f73600', size: '20' },
      { name: 'B', total: null, color: '#fe8700', size: '20' },
      { name: 'A', total: 0, color: '#094907', size: '30' },
      { name: 'B', total: 0, color: '#fe8700', size: '40' },
      { name: 'C', total: 0, color: '#f73600', size: '50' },
    ];

    return base.map((item) => {
      if (item.total === null) return item;

      const strikeZone = totalStrikeZone.find(
        (zone) => zone.name === item.name
      );

      return {
        ...item,
        total: strikeZone ? strikeZone.total : item.total,
      };
    });
  }, [totalStrikeZone]);

  return (
    <div className='flex flex-col items-center justify-center my-10'>
      <div className=' flex items-center gap-1 relative '>
        <img
          src='./strike_man_2.png'
          alt=''
          className=' absolute right-10 h-43 z-10'
        />
        <div className='rounded-t-md rounded-b-md overflow-auto z-5'>
          {structStrikeZone.map((item, index) => (
            <div
              style={{ height: `${item.size}px` }}
              className={`w-15 text-white font-bold flex items-center justify-center ${
                item.name === 'A'
                  ? 'bg-[#094907]'
                  : item.name === 'B'
                  ? 'bg-[#fe8700]'
                  : 'bg-[#f73600]'
              }`}
              key={index}
            >
              {item.total !== null ? item.total : ' '}
            </div>
          ))}
        </div>
        <div className=' absolute h-7 blur-md rounded-full z-0 w-32 bg-zinc-600 top-38 right-0'></div>
      </div>
    </div>
  );
};

export default StrikeZoneClassification;

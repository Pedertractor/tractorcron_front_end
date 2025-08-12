import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface CharBarProps {
  chartData: {
    name: string;
    value: number;
    time: string;
    percent: number;
  }[];
  fill: string;
}

const chartConfig: ChartConfig = {
  timeCalculate: {
    label: 'segundos',
  },
};

export function ChartBarDefault({ chartData, fill }: CharBarProps) {
  const data = chartData
    .map((item) => {
      const [hours, minutes, seconds] = item.time.split(':').map(Number);

      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      return {
        ...item,
        timeCalculate: totalSeconds,
      };
    })
    .sort((a, b) => b.timeCalculate - a.timeCalculate);
  return (
    <ChartContainer config={chartConfig} className='w-full h-[250px] '>
      <BarChart width={600} height={300} data={data} margin={{ top: 20 }}>
        <CartesianGrid vertical={false} strokeDasharray='3 3' />
        <XAxis
          dataKey='name'
          tickMargin={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            return value.length > 8 ? `${value.slice(0, 8)}...` : `${value}`;
          }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent className='bg-white' />}
        />
        <Bar
          dataKey='timeCalculate'
          radius={[4, 4, 0, 0]}
          barSize={20}
          fill={fill}
        >
          <LabelList dataKey='time' position='top' />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

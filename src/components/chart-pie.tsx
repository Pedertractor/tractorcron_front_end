import { LabelList, Pie, PieChart } from 'recharts';

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
}
const chartConfig = {
  NVAA: {
    label: 'NVAA',
  },
  VAA: {
    label: 'VAA',
  },
  SVAA: {
    label: 'SVAA',
  },
} satisfies ChartConfig;
export function CharPieDefault({ chartData }: CharBarProps) {
  const fillChartData = chartData
    .sort((a, b) => b.name.localeCompare(a.name))
    .map((item, index) => {
      return {
        name: item.name,
        value: item.value,
        time: item.time,
        percent: item.percent,
        fill: `var(--chart-${index + 4})`,
      };
    });
  return (
    <ChartContainer config={chartConfig} className=' mx-auto  max-h-[250px]'>
      <PieChart width={600} height={300} margin={{ top: 20, bottom: 20 }}>
        <ChartTooltip
          content={
            <ChartTooltipContent
              nameKey='name'
              hideLabel
              className='bg-white'
            />
          }
        />
        <Pie
          data={fillChartData}
          dataKey='percent'
          nameKey={'name'}
          label={({ payload, ...props }) => {
            return (
              <text
                cx={props.cx}
                cy={props.cy}
                x={props.x}
                y={props.y}
                textAnchor={props.textAnchor}
                dominantBaseline={props.dominantBaseline}
                fill='#303030'
                className=' font-bold'
              >
                {payload.percent}%
              </text>
            );
          }}
        >
          <LabelList
            className=' font-semibold fill-white'
            dataKey='name'
            stroke='none'
            fontSize={12}
            formatter={(value: keyof typeof chartConfig) =>
              chartConfig[value]?.label
            }
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

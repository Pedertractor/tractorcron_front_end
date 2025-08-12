import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  count: {
    label: 'quantidade',
  },
} satisfies ChartConfig;
import { ListCountChronoanalysisByDayProps } from '@/api/chronoanalysis-api';

export interface ChartLineProps {
  data: ListCountChronoanalysisByDayProps[];
}

const ChartLine = ({ data }: ChartLineProps) => {
  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          top: 25,
          left: 30,
          right: 30,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='day'
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 5)}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent indicator='line' className='bg-white' />
          }
        />
        <Line
          dataKey='count'
          type='bump'
          stroke='var(--chart-3)'
          strokeWidth={1}
          dot={{
            fill: 'var(--chart-3)',
          }}
          activeDot={{
            r: 4,
          }}
        >
          <LabelList
            position='top'
            offset={12}
            className='fill-foreground'
            fontSize={12}
          />
        </Line>
      </LineChart>
    </ChartContainer>
  );
};

export default ChartLine;

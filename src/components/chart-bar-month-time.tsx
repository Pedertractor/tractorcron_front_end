import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  totalTimeSeconds: {
    label: 'segundos',
  },
} satisfies ChartConfig;

const ChartBarMonthTime = ({
  chartData,
}: {
  chartData: { month: string; totalTimeSeconds: number }[];
}) => {
  console.log(chartData);
  return (
    <Card className='w-full h-[22rem] border-border'>
      <CardHeader className=''>
        <CardTitle>Dados por mês</CardTitle>
        <CardDescription>Horas acumuladas por mês</CardDescription>
      </CardHeader>
      <CardContent className=' h-[15rem]'>
        <ChartContainer config={chartConfig} className=' h-full w-full'>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 25,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 3).toUpperCase()}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className='bg-white' />}
            />
            <Bar
              dataKey='totalTimeSeconds'
              className=' fill-background-base-blue-select'
              radius={8}
              barSize={60}
            >
              <LabelList
                dataKey='totalTimeSeconds'
                position='top'
                offset={10}
                className='fill-foreground'
                fontSize={12}
                formatter={(value: number) => {
                  const hours = Math.floor(value / 3600);
                  const minutes = Math.floor((value % 3600) / 60);
                  const seconds = value % 60;
                  return `${String(hours).padStart(2, '0')}:${String(
                    minutes
                  ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartBarMonthTime;

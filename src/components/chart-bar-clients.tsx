import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

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
  value: {
    label: 'quantidade',
  },
} satisfies ChartConfig;

export function DashBoardBarChart({
  chartData,
}: {
  chartData: { name: string; value: number }[];
}) {
  return (
    <Card className=' w-1/2 h-full border-border'>
      <CardHeader className=''>
        <CardTitle>Dados por Clientes</CardTitle>
        <CardDescription>Cronoanálises agrupadas por clientes</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height='100%'>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout='vertical'
              margin={{
                right: 30,
                left: 30,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey='name'
                type='category'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                // tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey='value' type='number' hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent indicator='line' className='bg-white' />
                }
              />
              <Bar
                dataKey='value'
                layout='vertical'
                className=' fill-background-base-blue-active'
                radius={8}
                barSize={30}
              >
                <LabelList
                  dataKey='name'
                  position='insideLeft'
                  offset={8}
                  className=' font-bold  fill-white'
                  fontSize={12}
                />
                <LabelList
                  dataKey='value'
                  position='right'
                  offset={10}
                  className='fill-foreground'
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

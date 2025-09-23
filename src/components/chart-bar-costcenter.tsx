import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
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
    color: '#0f79e4441',
  },
} satisfies ChartConfig;

export function ChartBarCostCenter({
  chartData,
}: {
  chartData: { costcenter: string; value: number }[];
}) {
  return (
    <Card className=' w-1/2 h-full border-border'>
      <CardHeader>
        <CardTitle>Dados com C.C</CardTitle>
        <CardDescription>
          Cronoanálises agrupadas por centro de custo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height='100%'>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                right: 15,
                left: 15,
                top: 25,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='costcenter'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                //   tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent className='bg-white' />}
              />
              <Bar
                dataKey='value'
                // fill='#'
                className=' fill-background-base-blue-select'
                radius={8}
                barSize={60}
              >
                <LabelList
                  dataKey='value'
                  position='top'
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

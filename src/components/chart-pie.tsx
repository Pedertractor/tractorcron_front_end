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

/** Mesma paleta de antes (index + 4 no tema), sempre ligada ao nome — não ao índice após ordenar. */
const CLASSIFICATION_ORDER = ['VAA', 'SVAA', 'NVAA'] as const;

function fillForClassification(name: string): string {
  const key = name.trim().toUpperCase();
  switch (key) {
    case 'VAA':
      return 'var(--chart-4)';
    case 'SVAA':
      return 'var(--chart-5)';
    case 'NVAA':
      return 'var(--chart-6)';
    default:
      return 'var(--chart-3)';
  }
}

const chartConfig = {
  NVAA: {
    label: 'NVAA',
    color: 'var(--chart-6)',
  },
  VAA: {
    label: 'VAA',
    color: 'var(--chart-4)',
  },
  SVAA: {
    label: 'SVAA',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig;

export function CharPieDefault({ chartData }: CharBarProps) {
  const orderIndex = (name: string) => {
    const i = CLASSIFICATION_ORDER.indexOf(
      name.trim().toUpperCase() as (typeof CLASSIFICATION_ORDER)[number],
    );
    return i === -1 ? CLASSIFICATION_ORDER.length : i;
  };

  const fillChartData = [...chartData]
    .sort((a, b) => orderIndex(a.name) - orderIndex(b.name))
    .map((item) => ({
      name: item.name,
      value: item.value,
      time: item.time,
      percent: item.percent,
      fill: fillForClassification(item.name),
    }));
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

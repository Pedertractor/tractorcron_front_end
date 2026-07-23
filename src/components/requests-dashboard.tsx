import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import { ClipboardCheck, ClipboardList, Clock3, Target } from 'lucide-react';
import type { ReactNode } from 'react';

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
import { Skeleton } from '@/components/ui/skeleton';
import { getChronoanalysisTypeLabel } from '@/constants/chronoanalysis-types';
import type { ChronoanalysisTypeValue } from '@/constants/chronoanalysis-types';
import {
  TIMING_TYPE_LABELS,
  type ChronoanalysisRequestStats,
  type TimingType,
} from '@/types/chronoanalysis-request-types';

const pendingStatusConfig = {
  count: { label: 'Quantidade' },
  Atrasado: { label: 'Atrasado', color: '#ef4444' },
  Planejado: { label: 'Planejado', color: '#3b82f6' },
} satisfies ChartConfig;

const processTypeConfig = {
  count: { label: 'Quantidade' },
} satisfies ChartConfig;

const timingTypeConfig = {
  count: { label: 'Quantidade' },
  FIRST_CRON: { label: 'Primeira cronometragem', color: '#ff8630' },
  TIME_REVIEW: { label: 'Revisão de tempo', color: '#eab308' },
  KAIZEN: { label: 'Kaizen', color: '#22c55e' },
} satisfies ChartConfig;

const requesterConfig = {
  count: { label: 'Solicitações' },
} satisfies ChartConfig;

const TIMING_COLORS: Record<TimingType, string> = {
  FIRST_CRON: '#ff8630',
  TIME_REVIEW: '#eab308',
  KAIZEN: '#22c55e',
};

type RequestsDashboardProps = {
  data: ChronoanalysisRequestStats | null;
  loading?: boolean;
};

export function RequestsDashboard({ data, loading }: RequestsDashboardProps) {
  if (loading) {
    return (
      <div className='mt-2 flex flex-col gap-3'>
        <div className='grid grid-cols-2 gap-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-28 w-full rounded-xl' />
          ))}
        </div>
        <div className='grid grid-cols-1 gap-3 lg:grid-cols-2'>
          <Skeleton className='h-72 w-full rounded-xl' />
          <Skeleton className='h-72 w-full rounded-xl' />
          <Skeleton className='h-72 w-full rounded-xl' />
          <Skeleton className='h-72 w-full rounded-xl' />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='mt-4 rounded-lg border border-dashed border-border/25 bg-muted/10 px-4 py-12 text-center'>
        <p className='text-sm font-medium'>Sem dados de solicitações</p>
        <p className='text-muted-foreground mt-1 text-sm'>
          Ajuste o período ou aguarde novas solicitações.
        </p>
      </div>
    );
  }

  const { totals } = data;

  const pendingStatusData = [
    { name: 'Atrasado', count: totals.overdue, fill: '#ef4444' },
    { name: 'Planejado', count: totals.planned, fill: '#3b82f6' },
  ];

  const processTypeData = data.byChronoanalysisType.map((row) => ({
    name: getChronoanalysisTypeLabel(
      row.chronoanalysisType as ChronoanalysisTypeValue,
    ),
    count: row.count,
  }));

  const timingTypeData = data.byTimingType.map((row) => ({
    name: TIMING_TYPE_LABELS[row.timingType],
    timingType: row.timingType,
    count: row.count,
    fill: TIMING_COLORS[row.timingType],
  }));

  const requesterData = data.byRequester.map((row) => ({
    name: row.employeeName,
    shortName: shortenName(row.employeeName),
    count: row.count,
  }));

  return (
    <div className='mt-2 flex flex-col gap-3'>
      <div className='grid grid-cols-2 gap-2 lg:grid-cols-4'>
        <KpiCard
          title='Total'
          description='Solicitações no período'
          value={totals.total}
          icon={<ClipboardList className='size-9 text-initial' />}
        />
        <KpiCard
          title='Executadas'
          description='Solicitações concluídas'
          value={totals.completed}
          icon={<ClipboardCheck className='size-9 text-initial' />}
        />
        <KpiCard
          title='Pendentes'
          description='Aguardando ou em andamento'
          value={totals.pending}
          valueClassName='text-background-blue'
          icon={<Clock3 className='size-9 text-background-blue' />}
        />
        <KpiCard
          title='Atendimento'
          description='Executadas / total'
          value={`${totals.fulfillmentRate}%`}
          icon={<Target className='size-9 text-background-orange' />}
        />
      </div>

      <div className='grid grid-cols-1 gap-3 lg:grid-cols-2'>
        <Card className='border-border'>
          <CardHeader>
            <CardTitle>Status das pendentes</CardTitle>
            <CardDescription>Atrasadas vs planejadas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={pendingStatusConfig}
              className='mx-auto h-[260px] w-full'
            >
              <BarChart data={pendingStatusData} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} strokeDasharray='3 3' />
                <XAxis
                  dataKey='name'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis hide />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent indicator='line' className='bg-white' />
                  }
                />
                <Bar dataKey='count' radius={8} barSize={48}>
                  {pendingStatusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                  <LabelList
                    dataKey='count'
                    position='top'
                    className='fill-foreground text-sm font-semibold'
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className='border-border'>
          <CardHeader>
            <CardTitle>Tipo de solicitação pendente</CardTitle>
            <CardDescription>
              Primeira cronometragem, revisão ou Kaizen
            </CardDescription>
          </CardHeader>
          <CardContent>
            {timingTypeData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ChartContainer
                config={timingTypeConfig}
                className='mx-auto h-[260px] w-full'
              >
                <PieChart>
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
                    data={timingTypeData}
                    dataKey='count'
                    nameKey='name'
                    innerRadius={50}
                    outerRadius={90}
                    strokeWidth={2}
                  >
                    {timingTypeData.map((entry) => (
                      <Cell key={entry.timingType} fill={entry.fill} />
                    ))}
                    <LabelList
                      dataKey='count'
                      className='fill-foreground text-xs font-semibold'
                      stroke='none'
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
            {timingTypeData.length > 0 && (
              <div className='mt-2 flex flex-wrap justify-center gap-3 text-xs'>
                {timingTypeData.map((item) => (
                  <div key={item.timingType} className='flex items-center gap-1.5'>
                    <span
                      className='size-2.5 rounded-full'
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className='text-muted-foreground'>{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='border-border'>
          <CardHeader>
            <CardTitle>Tipo de processo pendente</CardTitle>
            <CardDescription>Cronoanálise por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            {processTypeData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ChartContainer
                config={processTypeConfig}
                className='h-[280px] w-full'
              >
                <BarChart
                  data={processTypeData}
                  layout='vertical'
                  margin={{ left: 8, right: 28 }}
                >
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey='name'
                    type='category'
                    width={110}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={6}
                    tick={{ fontSize: 11 }}
                  />
                  <XAxis type='number' hide />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        indicator='line'
                        className='bg-white'
                      />
                    }
                  />
                  <Bar
                    dataKey='count'
                    fill='#52525b'
                    radius={6}
                    barSize={22}
                  >
                    <LabelList
                      dataKey='count'
                      position='right'
                      className='fill-foreground text-xs font-semibold'
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className='border-border'>
          <CardHeader>
            <CardTitle>Top solicitantes</CardTitle>
            <CardDescription>Quem mais solicitou no período</CardDescription>
          </CardHeader>
          <CardContent>
            {requesterData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ChartContainer
                config={requesterConfig}
                className='h-[280px] w-full'
              >
                <BarChart data={requesterData} margin={{ top: 20 }}>
                  <CartesianGrid vertical={false} strokeDasharray='3 3' />
                  <XAxis
                    dataKey='shortName'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-25}
                    textAnchor='end'
                    height={60}
                  />
                  <YAxis hide />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        indicator='line'
                        className='bg-white'
                        labelFormatter={(_, payload) =>
                          String(payload?.[0]?.payload?.name ?? '')
                        }
                      />
                    }
                  />
                  <Bar dataKey='count' fill='#52525b' radius={6} barSize={28}>
                    <LabelList
                      dataKey='count'
                      position='top'
                      className='fill-foreground text-xs font-semibold'
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  description,
  value,
  icon,
  valueClassName,
}: {
  title: string;
  description: string;
  value: number | string;
  icon: ReactNode;
  valueClassName?: string;
}) {
  return (
    <Card className='border-border shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base'>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='flex items-center gap-3'>
        {icon}
        <span
          className={`text-2xl font-semibold text-initial ${valueClassName ?? ''}`}
        >
          {value}
        </span>
      </CardContent>
    </Card>
  );
}

function EmptyChart() {
  return (
    <div className='flex h-[220px] items-center justify-center text-sm text-muted-foreground'>
      Sem dados no período
    </div>
  );
}

function shortenName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fullName;
  if (parts.length === 1) return parts[0].slice(0, 10);
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

export default RequestsDashboard;

import {
  getActivitiesChartsForDashboard,
  type MovementChartsData,
} from '@/api/activities-api';
import { listDatasInformationsForDashBoard } from '@/api/chronoanalysis-api';
import { listChronoanalist } from '@/api/user';
import { DashBoardBarChart } from '@/components/chart-bar-clients';
import { ChartBarCostCenter } from '@/components/chart-bar-costcenter';
import ChartBarMonthTime from '@/components/chart-bar-month-time';
import { DatePicker } from '@/components/date-picker';
import { GraphicSurveyMovementCharts } from '@/components/graphic-survey-movement-charts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Text from '@/components/ui/text';
import type { listChronoanalistProps } from '@/types/user-types';
import { ReportProps } from '@/types/report-types';
import { CHRONOANALYSIS_TYPE_OPTIONS } from '@/constants/chronoanalysis-types';
import type { ChronoanalysisTypeValue } from '@/constants/chronoanalysis-types';
import { Cog, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

const HomePage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    to: new Date(),
    from: new Date(),
  });

  const [chronoanalists, setChronoanalists] = useState<
    listChronoanalistProps[]
  >([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedChronoanalysisType, setSelectedChronoanalysisType] =
    useState<ChronoanalysisTypeValue | null>(null);

  const [dashBoardData, setDashBoardData] = useState<null | ReportProps>(null);
  const [movementChartsData, setMovementChartsData] =
    useState<MovementChartsData | null>(null);
  const [chartsLoading, setChartsLoading] = useState(false);

  useEffect(() => {
    const loadChronoanalists = async () => {
      const { data, message, status } = await listChronoanalist();
      if (!status) {
        toast.info(message ?? 'Não foi possível carregar os cronoanalistas.');
        return;
      }
      if (data) setChronoanalists(data);
    };
    loadChronoanalists();
  }, []);

  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to) return;

    let cancelled = false;
    setChartsLoading(true);

    (async () => {
      try {
        const [dashResult, chartsResult] = await Promise.all([
          listDatasInformationsForDashBoard(
            dateRange.from!,
            dateRange.to!,
            selectedUserId,
            selectedChronoanalysisType,
          ),
          getActivitiesChartsForDashboard(
            dateRange.from!,
            dateRange.to!,
            selectedUserId,
            selectedChronoanalysisType,
          ),
        ]);

        if (cancelled) return;

        if (dashResult.status && dashResult.data) {
          setDashBoardData(dashResult.data);
        } else {
          toast.error(dashResult.error ?? 'Erro ao carregar o dashboard');
        }

        if (chartsResult.status && chartsResult.data) {
          setMovementChartsData(chartsResult.data);
        } else {
          setMovementChartsData(null);
          toast.error(
            chartsResult.error ?? 'Erro ao carregar o levantamento gráfico',
          );
        }
      } finally {
        if (!cancelled) setChartsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dateRange, dateRange?.from, dateRange?.to, selectedUserId, selectedChronoanalysisType]);

  return (
    <section className='w-full'>
      <div className='mb-6 flex flex-col gap-4 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6'>
        <Text variant='title' as='h1' className='shrink-0 pr-2'>
          Dashboard
        </Text>
        <div className='flex flex-col gap-2 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-end sm:gap-2'>
          <DatePicker value={dateRange} onChange={setDateRange} homePage />
          <Select
            value={
              selectedChronoanalysisType === null
                ? 'all'
                : selectedChronoanalysisType
            }
            onValueChange={(v) =>
              setSelectedChronoanalysisType(
                v === 'all' ? null : (v as ChronoanalysisTypeValue),
              )
            }
          >
            <SelectTrigger className='h-9 w-fit min-w-[220px] max-w-[min(100vw-2rem,320px)] shrink-0 self-center sm:min-w-[240px]'>
              <SelectValue placeholder='Tipo de cronoanálise' />
            </SelectTrigger>
            <SelectContent align='end' sideOffset={4}>
              <SelectItem value='all'>Tipos de cronoanálise</SelectItem>
              {CHRONOANALYSIS_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedUserId === null ? 'all' : String(selectedUserId)}
            onValueChange={(v) =>
              setSelectedUserId(v === 'all' ? null : Number(v))
            }
          >
            <SelectTrigger className='h-9 w-fit min-w-[220px] max-w-[min(100vw-2rem,320px)] shrink-0 self-center sm:min-w-[240px]'>
              <SelectValue placeholder='Cronoanalistas' />
            </SelectTrigger>
            <SelectContent align='end' sideOffset={4}>
              <SelectItem value='all'>Cronoanalistas</SelectItem>
              {chronoanalists.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.employeeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {dashBoardData && (
        <>
          <div className=' flex flex-col gap-2 py-2 mt-2'>
            <div className=' flex gap-2 w-full'>
              <div className='w-full border-border flex p-2 gap-2 shadow-sm border rounded-xl'>
                <Card className='w-full border-border '>
                  <CardHeader>
                    <CardTitle>Cronoanálise realizada</CardTitle>
                    <CardDescription>Total de horas realizadas</CardDescription>
                  </CardHeader>
                  <CardContent className='flex items-center gap-3'>
                    <Timer
                      size={40}
                      className='stroke-background-blue-active'
                    />
                    <span className=' font-semibold text-2xl text-initial'>
                      {dashBoardData.totalTime}
                    </span>
                    <span className=' text-zinc-500 font-semibold '>
                      {dashBoardData.porcent}%
                    </span>
                  </CardContent>
                </Card>
                <Card className='w-full border-border '>
                  <CardHeader>
                    <CardTitle>Meta Cronoanálise</CardTitle>
                    <CardDescription>
                      Meta em total de horas / ano
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='flex items-center gap-3'>
                    <Timer size={40} className='stroke-[#ef8644]' />
                    <span className=' font-semibold text-2xl text-initial'>
                      {dashBoardData.totalTimeGoals}
                    </span>
                  </CardContent>
                </Card>
              </div>

              <Card className='w-4/7 border-border'>
                <CardHeader>
                  <CardTitle>Cronoanálises</CardTitle>
                  <CardDescription>
                    Total de cronoanálises realizadas
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex items-center gap-3'>
                  <div className=' flex items-center justify-center gap-0'>
                    <Timer
                      size={40}
                      className='stroke-background-blue-active'
                    />
                    <Cog size={25} className='stroke-background-blue-active' />
                  </div>
                  <span className=' font-semibold text-2xl text-initial'>
                    {dashBoardData.totalProcess}{' '}
                    {dashBoardData.totalProcess === 1
                      ? 'processo'
                      : 'processos'}
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className=' flex flex-col gap-2 py-2'>
            <div className=' flex gap-3'>
              <ChartBarMonthTime chartData={dashBoardData.groupTotalByMonth} />
            </div>
          </div>

          <div className=' flex flex-col h-fit gap-2 py-2'>
            <div className=' flex gap-3 w-full'>
              <DashBoardBarChart
                chartData={dashBoardData.clientsInformations}
              />

              <ChartBarCostCenter
                chartData={dashBoardData.costCenterInformations}
              />
            </div>
          </div>
        </>
      )}

      {dateRange?.from && dateRange?.to && (
        <div className='mt-2 flex flex-col gap-3 rounded-lg border border-border p-4'>
          <div>
            <h3 className='text-initial font-semibold'>Levantamento gráfico</h3>
            <p className='text-muted-foreground mt-1 text-sm'>
              Soma de tempos de todas as cronoanálises no intervalo
            </p>
          </div>
          <GraphicSurveyMovementCharts
            data={movementChartsData ?? undefined}
            isLoading={chartsLoading}
          />
        </div>
      )}
    </section>
  );
};

export default HomePage;

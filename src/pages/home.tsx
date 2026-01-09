import { listDatasInformationsForDashBoard } from '@/api/chronoanalysis-api';
import { DashBoardBarChart } from '@/components/chart-bar-clients';
import { ChartBarCostCenter } from '@/components/chart-bar-costcenter';
import ChartBarMonthTime from '@/components/chart-bar-month-time';
import { DatePicker } from '@/components/date-picker';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Text from '@/components/ui/text';
import { ReportProps } from '@/types/report-types';
import { Cog, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

const HomePage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    to: new Date(),
    from: new Date(),
  });

  const [dashBoardData, setDashBoardData] = useState<null | ReportProps>(null);

  useEffect(() => {
    const supportDataToDashBoard = async () => {
      if (dateRange && dateRange.from && dateRange.to) {
        const {
          status,
          error,
          data,
        }: {
          status: boolean;
          error: string | null;
          data: ReportProps | null;
        } = await listDatasInformationsForDashBoard(
          dateRange.from,
          dateRange.to
        );

        if (status && data) {
          setDashBoardData(data);
          return;
        }

        toast.error(error);
      }
    };

    supportDataToDashBoard();
  }, [dateRange, dateRange?.from, dateRange?.to]);

  return (
    <section className=' w-full relative'>
      <div className=' absolute top-0 right-[40%] w-fit'>
        <DatePicker value={dateRange} onChange={setDateRange} />
      </div>
      <Text variant={'title'}>Dashboard</Text>
      {dashBoardData && (
        <>
          <div className=' flex flex-col gap-2 py-2 mt-15'>
            <div className=' flex gap-2 w-full'>
              <Card className='w-full border-border '>
                <CardHeader>
                  <CardTitle>Informações gerais</CardTitle>
                  <CardDescription>Total de horas realizadas</CardDescription>
                </CardHeader>
                <CardContent className='flex items-center gap-3'>
                  <Timer size={40} className='stroke-background-blue-active' />
                  <span className=' font-semibold text-2xl text-initial'>
                    {dashBoardData.totalTime}
                  </span>
                </CardContent>
              </Card>
              <Card className='w-full border-border'>
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
    </section>
  );
};

export default HomePage;

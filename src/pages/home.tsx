import {
  DashboardDataProps,
  listDatasInformationsForDashBoard,
} from '@/api/chronoanalysis-api';
import { getTotalChronoanalyzedParts } from '@/api/parts-api';
import { DashBoardBarChart } from '@/components/chart-bar-clients';
import { ChartBarCostCenter } from '@/components/chart-bar-costcenter';
import { DatePicker } from '@/components/date-picker';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Text from '@/components/ui/text';
import { Cog, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

const HomePage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    to: new Date(),
    from: new Date(),
  });
  const [totalChronoanalyzedParts, setTotalChronoanalyzedParts] =
    useState<number>(0);
  const [totalChronoanalyzedPartsRange, setTotalChronoanalyzedPartsRange] =
    useState<number>(0);

  const [dashBoardData, setDashBoardData] = useState<null | DashboardDataProps>(
    null
  );

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
          data: DashboardDataProps | null;
        } = await listDatasInformationsForDashBoard(
          dateRange.from,
          dateRange.to
        );

        if (status && data) {
          const totalParts = data.clientsInformations.reduce(
            (acc, item) => acc + item.value,
            0
          );
          setTotalChronoanalyzedPartsRange(totalParts);
          setDashBoardData(data);
          return;
        }

        toast.error(error);
      }
    };

    supportDataToDashBoard();
  }, [dateRange, dateRange?.from, dateRange?.to]);

  useEffect(() => {
    const supportTotalChronoanalyzedParts = async () => {
      const { status, error, data } = await getTotalChronoanalyzedParts();

      if (!status) return toast.error(error);

      if (status) {
        setTotalChronoanalyzedParts(data.total);
      }
    };

    supportTotalChronoanalyzedParts();
  }, []);

  return (
    <section className=' w-full relative'>
      <div className=' absolute top-0 right-[40%] w-fit'>
        <DatePicker value={dateRange} onChange={setDateRange} />
      </div>
      <Text variant={'title'}>Dashboard</Text>
      <div className=' flex flex-col gap-2 py-2 mt-15'>
        <div className=' flex gap-2 w-full'>
          <Card className='w-full border-border '>
            <CardHeader>
              <CardTitle>Peças Cronometradas Geral</CardTitle>
              <CardDescription>
                Total de peças unicas cronometradas
              </CardDescription>
            </CardHeader>
            <CardContent className='flex items-center gap-3'>
              <div className=' flex items-center justify-center gap-0'>
                <Timer size={40} className='stroke-background-blue-active' />
                <Cog size={25} className='stroke-background-blue-active' />
              </div>
              <span className=' font-semibold text-2xl text-initial'>
                {totalChronoanalyzedParts}{' '}
                {totalChronoanalyzedParts === 1 ? 'peça' : 'peças'}
              </span>
            </CardContent>
          </Card>
          <Card className='w-full border-border'>
            <CardHeader>
              <CardTitle>Peças Cronometradas</CardTitle>
              <CardDescription>
                Total de peças cronometradas -{' '}
                {dateRange?.from?.toLocaleDateString()} -{' '}
                {dateRange?.to?.toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className='flex items-center gap-3'>
              <div className=' flex items-center justify-center gap-0'>
                <Timer size={40} className='stroke-background-blue-active' />
                <Cog size={25} className='stroke-background-blue-active' />
              </div>
              <span className=' font-semibold text-2xl text-initial'>
                {totalChronoanalyzedPartsRange}{' '}
                {totalChronoanalyzedPartsRange === 1 ? 'peça' : 'peças'}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className=' flex flex-col h-fit gap-2 py-2'>
        {dashBoardData && (
          <div className=' flex  gap-3 w-full'>
            <DashBoardBarChart chartData={dashBoardData.clientsInformations} />

            <ChartBarCostCenter
              chartData={dashBoardData.costCenterInformations}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default HomePage;

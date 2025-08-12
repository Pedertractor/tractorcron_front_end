import {
  listChronoanalysis,
  listChronoanalysisProps,
  ListCountChronoanalysisByDay,
  ListCountChronoanalysisByDayProps,
} from '@/api/chronoanalysis-api';
import { getTotalChronoanalyzedParts } from '@/api/parts-api';
import ChartLine from '@/components/chart-line';
import TableChronoanalysis from '@/components/table-chronoanalysis';
import Card from '@/components/ui/card/card';
import Text from '@/components/ui/text';
import { Calendar, Cog, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

const HomePage = () => {
  const [isListChronoanalysis, setListChronoanalysis] = useState<
    listChronoanalysisProps[]
  >([]);
  const [isListCountChronoanalysisByDay, setIsListCountChronoanalysisByDay] =
    useState<ListCountChronoanalysisByDayProps[]>([]);
  const [totalChronoanalyzedParts, setTotalChronoanalyzedParts] =
    useState<number>(0);
  const [totalChronoanalyzedPartsInWeek, setTotalChronoanalyzedPartsInWeek] =
    useState<number>(0);

  useEffect(() => {
    const supportListCountChronoanalysisByDay = async () => {
      const { data, error, status } = await ListCountChronoanalysisByDay();

      if (!status) return toast.info(error);

      if (status && data) {
        setIsListCountChronoanalysisByDay(data);
        setTotalChronoanalyzedPartsInWeek(
          data.reduce((acc, curr) => acc + curr.count, 0)
        );
      }
    };

    supportListCountChronoanalysisByDay();
  }, []);

  useEffect(() => {
    const supportListChronoanalysis = async () => {
      const { data, error, status } = await listChronoanalysis();

      if (!status) return toast.info(error);

      const info: listChronoanalysisProps[] = data;

      if (status) {
        setListChronoanalysis(
          info
            .sort((a, b) => Date.parse(b.startDate) - Date.parse(a.startDate))
            .slice(0, 8)
        );
      }
    };

    supportListChronoanalysis();
  }, []);

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
    <section className='h-[90%]'>
      <Text variant={'title'}>Dashboard</Text>
      <div className=' flex flex-col h-full gap-2 py-2'>
        <div className='flex gap-2 h-full'>
          <Card text='Ultimas cronoanálises' className=' justify-start h-full'>
            <Link to={'/analysis'}>
              <TableChronoanalysis data={isListChronoanalysis} isView />
            </Link>
          </Card>
          <Card text='Semana de cronoanálise' className=' justify-start'>
            <ChartLine data={isListCountChronoanalysisByDay} />
          </Card>
        </div>
        <div className=' flex h-[35%] gap-2 w-full'>
          <Card text='Total de peças' className='justify-start'>
            <div className=' w-full h-full flex items-center gap-6'>
              <div className=' flex items-center justify-center gap-0'>
                <Cog size={40} className='stroke-background-base-blue-select' />
              </div>
              <span className=' font-medium text-2xl text-zinc-100'>
                em breve
              </span>
            </div>
          </Card>
          <Card text='Peças cronometradas' className='justify-start'>
            <div className=' w-full h-full flex items-center gap-6'>
              <div className=' flex items-center justify-center gap-0'>
                <Timer size={40} className='stroke-background-blue-active' />
                <Cog size={25} className='stroke-background-blue-active' />
              </div>
              <span className=' font-semibold text-2xl text-initial'>
                {totalChronoanalyzedParts}{' '}
                {totalChronoanalyzedParts === 1 ? 'peça' : 'peças'}
              </span>
            </div>
          </Card>
          <Card text='Total de cronoanálise - semana' className='justify-start'>
            <div className=' w-full h-full flex items-center gap-6'>
              <div className=' flex items-center justify-center gap-0'>
                <Timer size={40} className='stroke-background-blue-active' />
                <Calendar size={25} className='stroke-background-blue-active' />
              </div>
              <span className=' font-semibold text-2xl text-initial'>
                {totalChronoanalyzedPartsInWeek}{' '}
                {totalChronoanalyzedPartsInWeek === 1 ? 'peça' : 'peças'}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HomePage;

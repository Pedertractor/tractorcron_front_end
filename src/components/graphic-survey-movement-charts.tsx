import type { MovementChartsData } from '@/api/activities-api';
import { ChartBarDefault } from '@/components/chart-bar';
import Loading from '@/components/loading';
import { CharPieDefault } from '@/components/chart-pie';

type GraphicSurveyMovementChartsProps = {
  data: MovementChartsData | undefined;
  isLoading: boolean;
};

export function GraphicSurveyMovementCharts({
  data,
  isLoading,
}: GraphicSurveyMovementChartsProps) {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-2 w-full'>
      <div className='mb-2 h-[300px] w-full rounded-lg border border-border p-2'>
        <h4 className='text-sm font-medium'>Descrição do movimento</h4>
        {isLoading && <Loading />}
        {data && (
          <ChartBarDefault
            chartData={data.activityNameChartData}
            fill='var(--chart-2)'
          />
        )}
      </div>
      <div className='flex w-full items-center justify-center gap-2'>
        <div className='h-full w-1/2 rounded-lg border border-border p-2'>
          <h4 className='text-sm font-medium'>Classificação do movimento</h4>
          {isLoading && <Loading />}
          {data && !isLoading && (
            <CharPieDefault chartData={data.classificationChartData} />
          )}
        </div>

        <div className='h-full w-1/2 rounded-lg border border-border p-2'>
          <h4 className='text-sm font-medium'>Tipo do movimento</h4>
          {isLoading && <Loading />}

          {data && !isLoading && (
            <ChartBarDefault
              chartData={data.typeMovementChartData}
              fill='var(--chart-3)'
            />
          )}
        </div>
      </div>
    </div>
  );
}

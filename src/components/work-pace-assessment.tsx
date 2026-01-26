import { useEffect, useState } from 'react';
import { seedEffort, type seedEffortProps } from '../seed/seed-effort';
import { seedHability, type seedHabilityProps } from '../seed/seed-hability';
import Text from './ui/text';
import Button from './ui/button/button';
import { RegisterActivities } from '@/db/db';

export interface WorkPaceAssessmentProps {
  numberOfParts: number;
  activites: RegisterActivities[];
  setWorkPaceAssessmentDatas: (props: DataWorkPaceProps) => void;
  workPaceAssessmentDatas: null | DataWorkPaceProps;
}

export interface DataWorkPaceProps {
  hability: string;
  habilityPorcent: number;
  effort: string;
  effortPorcent: number;
  efficiency: number;
  timeCalculate: string;
  standardTime: string;
  standardTimeDecimal: number;
  standardTimeDecimalByNumberOfParts: number;
}

const WorkPaceAssessment = ({
  numberOfParts,
  activites,
  setWorkPaceAssessmentDatas,
  workPaceAssessmentDatas,
}: WorkPaceAssessmentProps) => {
  const [hability, setHability] = useState<seedHabilityProps | null>(null);
  const [effort, setEffort] = useState<seedEffortProps | null>(null);

  useEffect(() => {
    if (workPaceAssessmentDatas) {
      const findHability = seedHability.find(
        (item) => item.name === workPaceAssessmentDatas.hability
      );

      const findEffort = seedEffort.find(
        (item) => item.name === workPaceAssessmentDatas.effort
      );
      if (findHability && findEffort) {
        setHability(findHability);
        setEffort(findEffort);
      }
    }
  }, [workPaceAssessmentDatas]);

  useEffect(() => {
    if (hability && effort) {
      const calculateTimeActivites = activites.map((activite) => {
        if (activite.startTime && activite.endTime) {
          const startTimeWorked = new Date(activite.startTime);
          const endTimeWorked = new Date(activite.endTime);

          return Math.round(
            endTimeWorked.getTime() - startTimeWorked.getTime()
          );
        }
      });

      const diffMs = calculateTimeActivites
        .filter((item) => item !== undefined)
        .reduce((acc, value) => acc + value, 0);

      const totalSeconds = Math.round(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const timeCalculate = `${String(hours).padStart(2, '0')}:${String(
        minutes
      ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      let efficiency = 100;

      if (hability.subName === 'F' || hability.subName === 'R') {
        efficiency = efficiency - hability.porcentage;
      } else {
        efficiency = efficiency + hability.porcentage;
      }

      if (effort.subName === 'F' || effort.subName === 'R') {
        efficiency = efficiency - effort.porcentage;
      } else {
        efficiency = efficiency + effort.porcentage;
      }
      const workPaceAssessment = (efficiency / 100) * diffMs;
      const workPaceAssessmentDividedByNumberOfParts =
        workPaceAssessment / numberOfParts;

      const totalSecondsWpa = Math.round(workPaceAssessment / 1000);
      const hoursWpa = Math.floor(totalSecondsWpa / 3600);
      const minutesWpa = Math.floor((totalSecondsWpa % 3600) / 60);
      const secondsWpa = totalSecondsWpa % 60;

      const standardTime = `${String(hoursWpa).padStart(2, '0')}:${String(
        minutesWpa
      ).padStart(2, '0')}:${String(secondsWpa).padStart(2, '0')}`;

      const oneDayMs = 24 * 60 * 60 * 1000;

      const valueFractionOneDay = workPaceAssessment / oneDayMs;
      const valueFractionOneDayByNumberOfParts =
        workPaceAssessmentDividedByNumberOfParts / oneDayMs;

      const data = {
        hability: hability.name,
        habilityPorcent: hability.porcentage,
        effort: effort.name,
        effortPorcent: effort.porcentage,
        efficiency,
        timeCalculate,
        standardTime,
        standardTimeDecimal: +(valueFractionOneDay * 24 * 60).toFixed(2),
        standardTimeDecimalByNumberOfParts: +(
          valueFractionOneDayByNumberOfParts *
          24 *
          60
        ).toFixed(2),
      };

      setWorkPaceAssessmentDatas(data);
    }
  }, [activites, effort, hability, numberOfParts, setWorkPaceAssessmentDatas]);

  return (
    <div className=' h-full flex flex-col  justify-center '>
      <div className=' w-full rounded-lg flex flex-col p-4'>
        <div className=' flex flex-col gap-2'>
          <Text variant={'text-label'}>Habilidade</Text>
          <div className='flex items-center w-full justify-between'>
            {seedHability.map((item) => (
              <Button
                type='button'
                key={item.id}
                onClick={() => setHability(item)}
                variant={`${hability === item ? 'select-blue' : 'default'}`}
                size={'md'}
              >
                {item.subName}
              </Button>
            ))}
          </div>
        </div>
        <div className=' flex flex-col gap-2 mt-5'>
          <Text variant={'text-label'}>Esforço</Text>
          <div className='flex items-center w-full justify-between'>
            {seedEffort.map((item) => (
              <Button
                type='button'
                key={item.id}
                onClick={() => setEffort(item)}
                variant={`${effort === item ? 'select-blue' : 'default'}`}
                size={'md'}
              >
                {item.subName}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className='w-full border border-dashed border-border rounded-lg gap-5 flex flex-col p-4'>
        <Text className=' font-semibold'>Calculo tempo padrão</Text>
        <div className=' flex h-full items-center gap-4 '>
          <div className=' flex-col flex tems-start justify-center w-full'>
            <Text variant={'text-label'}>Habilidade</Text>
            <div className=' border border-dashed border-border rounded-lg p-2 w-full h-15 flex flex-col items-center justify-center'>
              {hability && (
                <Text variant={'sub-title'}>{hability.porcentage}%</Text>
              )}
            </div>
          </div>
          <div className='  min-h-[50px] flex items-end'>
            <Text variant={'text-label'}>X</Text>
          </div>
          <div className=' flex-col flex tems-start justify-center w-full'>
            <Text variant={'text-label'}>Esforço</Text>
            <div className=' border border-dashed border-border rounded-lg p-2 w-full h-15 flex flex-col items-center justify-center'>
              {effort && (
                <Text variant={'sub-title'}>{effort?.porcentage}%</Text>
              )}
            </div>
          </div>
          <div className='  min-h-[50px] flex items-end'>
            <Text variant={'text-label'}>=</Text>
          </div>
          <div className=' flex-col flex tems-start justify-center w-full'>
            <Text variant={'text-label'}>Eficiência</Text>
            <div className=' border border-dashed border-border rounded-lg p-2 w-full h-15 flex flex-col items-center justify-center'>
              {workPaceAssessmentDatas && (
                <Text variant={'sub-title'}>
                  {workPaceAssessmentDatas?.efficiency}%
                </Text>
              )}
            </div>
          </div>
        </div>
        <div className=' flex items-center justify-center gap-4'>
          <div className=' flex-col flex tems-start justify-center w-full'>
            <Text variant={'text-label'}>Tempo geral</Text>
            <div className=' border border-dashed border-border rounded-lg p-2 w-full h-15 flex flex-col items-center justify-center'>
              {workPaceAssessmentDatas && (
                <Text variant={'sub-title'}>
                  {workPaceAssessmentDatas?.timeCalculate}
                </Text>
              )}
            </div>
          </div>
          <div className=' flex-col flex tems-start justify-center w-full'>
            <Text variant={'text-label'}>Tempo padrão</Text>
            <div className=' border border-dashed border-border rounded-lg p-2 w-full h-15 flex flex-col items-center justify-center'>
              {workPaceAssessmentDatas && (
                <Text variant={'sub-title'}>
                  {workPaceAssessmentDatas?.standardTime}
                </Text>
              )}
            </div>
          </div>
          <div className=' flex-col flex tems-start justify-center w-full'>
            <Text variant={'text-label'}>Padrão decimal</Text>
            <div className=' border border-dashed border-border rounded-lg p-2 w-full h-15 flex flex-col items-center justify-center'>
              {workPaceAssessmentDatas && (
                <Text variant={'sub-title'}>
                  {workPaceAssessmentDatas?.standardTimeDecimal}
                </Text>
              )}
            </div>
          </div>
          <div className=' flex-col flex tems-start justify-center w-full'>
            <Text variant={'text-label'}>Padrão decimal / peça</Text>
            <div className=' border border-dashed border-border rounded-lg p-2 w-full h-15 flex flex-col items-center justify-center'>
              {workPaceAssessmentDatas && (
                <Text variant={'sub-title'}>
                  {workPaceAssessmentDatas?.standardTimeDecimalByNumberOfParts}
                </Text>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkPaceAssessment;

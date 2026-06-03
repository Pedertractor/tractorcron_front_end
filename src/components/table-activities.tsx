import type { RegisterActivities } from '../db/db';
import { useLayoutEffect, useRef } from 'react';
import TrashComponent from '../assets/icons/trash-icon.svg?react';
import { deleteActivitie } from '../db/db-functions';
import Icon from './ui/icon';
import LoadingIcon2Component from '../assets/icons/loading-icon-2.svg?react';
import StrikeZoneComponent from './strikezone';
import GoldenZoneComponent from './goldenzone';
import Button from './ui/button/button';

export interface PropsTableActivities {
  allActivities: RegisterActivities[];
  setAttTable?: (props: boolean) => void;
  authFunc?: boolean;
}
const TableActivities = ({
  allActivities: activities,
  setAttTable,
  authFunc,
}: PropsTableActivities) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const previousActivitiesLengthRef = useRef(activities.length);

  useLayoutEffect(() => {
    const hasNewActivity =
      activities.length > previousActivitiesLengthRef.current;

    previousActivitiesLengthRef.current = activities.length;

    if (!hasNewActivity || !scrollRef.current) return;

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [activities]);

  return (
    <div className='rounded-lg border border-border text-sm'>
      <nav className='grid w-full grid-cols-8 rounded-lg rounded-b-none border-b border-border bg-blue-50 py-1 text-center font-semibold'>
        <span>Nº atividade</span>
        <span>Atividade</span>
        <span>Hora início</span>
        <span>Hora fim</span>
        <span className='col-span-2'>golden zone</span>
        <span className={`${!authFunc ? 'col-span-2' : 'col-span-1'}`}>
          strike zone
        </span>
        {!authFunc ? null : <span>Ações</span>}
      </nav>
      <div
        ref={scrollRef}
        className='flex max-h-[290px] min-h-[290px] flex-col overflow-y-auto rounded-lg bg-white'
      >
        {activities.length > 0 &&
          activities.map((activitie, index) => (
            <div
              key={`${activitie.id}-${index}`}
              className='grid w-full grid-cols-8 border-b border-border py-1 text-center'
            >
              <div className='flex items-center justify-center'>
                {activitie.activitieId}
              </div>
              <div className='flex items-center justify-center'>
                {activitie.name.length >= 21
                  ? `${activitie.name.slice(0, 21)}...`
                  : activitie.name}
              </div>
              <div className='flex items-center justify-center'>
                {new Date(activitie.startTime).toLocaleTimeString()}
              </div>
              <div className='flex items-center justify-center'>
                {activitie.endTime ? (
                  new Date(activitie.endTime).toLocaleTimeString()
                ) : (
                  <Icon
                    className='size-4'
                    svg={LoadingIcon2Component}
                    animate
                  />
                )}
              </div>
              <div className='col-span-2 flex w-full items-center justify-center gap-2'>
                <GoldenZoneComponent
                  activitieGoldenZoneId={activitie.goldenZoneId}
                  activitieId={activitie.id}
                  setAttTable={setAttTable}
                />
              </div>
              <div
                className={`flex w-full items-center justify-center gap-2 ${
                  !authFunc ? 'col-span-2' : 'col-span-1'
                }`}
              >
                <StrikeZoneComponent
                  activitieStrikeZoneId={activitie.strikeZoneId}
                  activitieId={activitie.id}
                  setAttTable={setAttTable}
                />
              </div>
              {!authFunc ? null : (
                <div className='flex items-center justify-center'>
                  <Button
                    type='button'
                    svg={TrashComponent}
                    variant={'red'}
                    onClick={() => deleteActivitie(activitie.id, setAttTable)}
                  />
                </div>
              )}
            </div>
          ))}

        {activities.length <= 0 && (
          <p className='flex min-h-[290px] w-full items-center justify-center py-5 text-secondary'>
            nenhuma atividade registrada 📝
          </p>
        )}
      </div>
    </div>
  );
};

export default TableActivities;

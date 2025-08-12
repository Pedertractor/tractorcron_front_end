import type { RegisterActivities } from '../db/db';
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
  return (
    <div className=' border border-border rounded-lg text-sm'>
      <nav className=' w-full bg-blue-50 rounded-b-none rounded-lg grid grid-cols-8 py-1 border-b border-border font-semibold text-center'>
        <span>Nº atividade</span>
        <span>Atividade</span>
        <span>Hora início</span>
        <span>Hora fim</span>
        <span className=' col-span-2'>golden zone</span>
        <span className={`${!authFunc ? 'col-span-2' : 'col-span-1 '}`}>
          strike zone
        </span>
        {!authFunc ? null : <span>Ações</span>}
      </nav>
      <div className=' flex flex-col bg-white overflow-y-auto max-h-[290px] min-h-[290px] rounded-lg'>
        {activities.length > 0 &&
          activities.map((activitie, index) => (
            <div
              key={`${activitie.id}-${index}`}
              className=' w-full grid grid-cols-8 py-1 text-center border-b border-border'
            >
              <div className='flex items-center justify-center'>
                {activitie.activitieId}
              </div>
              <div className=' flex items-center justify-center'>
                {activitie.name.length >= 21
                  ? `${activitie.name.slice(0, 21)}...`
                  : activitie.name}
              </div>
              <div className=' flex items-center justify-center'>
                {new Date(activitie.startTime).toLocaleTimeString()}
              </div>
              <div className=' flex items-center justify-center '>
                {activitie.endTime ? (
                  new Date(activitie.endTime).toLocaleTimeString()
                ) : (
                  <Icon
                    className=' size-4'
                    svg={LoadingIcon2Component}
                    animate
                  />
                )}
              </div>
              <div className='w-full flex items-center justify-center gap-2 col-span-2 '>
                <GoldenZoneComponent
                  activitieGoldenZoneId={activitie.goldenZoneId}
                  activitieId={activitie.id}
                  setAttTable={setAttTable}
                />
              </div>
              <div
                className={`w-full flex items-center justify-center gap-2 ${
                  !authFunc ? 'col-span-2' : 'col-span-1 '
                }`}
              >
                <StrikeZoneComponent
                  activitieStrikeZoneId={activitie.strikeZoneId}
                  activitieId={activitie.id}
                  setAttTable={setAttTable}
                />
              </div>
              {!authFunc ? null : (
                <div className=' flex items-center justify-center'>
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
          <p className=' flex w-full items-center justify-center py-5 text-secondary min-h-[290px] '>
            nenhuma atividade registrada 📝
          </p>
        )}
      </div>
    </div>
  );
};

export default TableActivities;

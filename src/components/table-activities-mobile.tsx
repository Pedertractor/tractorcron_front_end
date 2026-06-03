import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { RegisterActivities } from '../db/db';
import Icon from './ui/icon';
import LoadingIcon2Component from '../assets/icons/loading-icon-2.svg?react';
import ModalActivityZones from './modal-activity-zones';
import Text from './ui/text';

export interface PropsTableActivitiesMobile {
  allActivities: RegisterActivities[];
  setAttTable?: (props: boolean) => void;
  allowDelete?: boolean;
}

const TableActivitiesMobile = ({
  allActivities: activities,
  setAttTable,
  allowDelete = true,
}: PropsTableActivitiesMobile) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const previousActivitiesLengthRef = useRef(activities.length);
  const [selectedActivity, setSelectedActivity] =
    useState<RegisterActivities | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useLayoutEffect(() => {
    const hasNewActivity =
      activities.length > previousActivitiesLengthRef.current;

    previousActivitiesLengthRef.current = activities.length;

    if (!hasNewActivity || !scrollRef.current) return;

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [activities]);

  useEffect(() => {
    if (!modalOpen || !selectedActivity) return;

    const updated = activities.find((item) => item.id === selectedActivity.id);
    if (
      updated &&
      (updated.goldenZoneId !== selectedActivity.goldenZoneId ||
        updated.strikeZoneId !== selectedActivity.strikeZoneId ||
        updated.endTime !== selectedActivity.endTime)
    ) {
      setSelectedActivity(updated);
    }
  }, [activities, modalOpen, selectedActivity]);

  const handleRowClick = (activity: RegisterActivities) => {
    setSelectedActivity(activity);
    setModalOpen(true);
  };

  const hasZonesConfigured = (activity: RegisterActivities) =>
    activity.goldenZoneId != null && activity.strikeZoneId != null;

  return (
    <>
      <div className='rounded-lg border border-border text-xs'>
        <nav className='grid w-full grid-cols-[minmax(0,1fr)_4.25rem_4.25rem_1.25rem] rounded-t-lg border-b border-border bg-blue-50 py-1.5 text-center font-semibold'>
          <span className='text-left pl-1'>atividade</span>
          <span>hora início</span>
          <span>hora fim</span>
          <span aria-hidden='true' />
        </nav>
        <div
          ref={scrollRef}
          className='flex max-h-[9.5rem] min-h-[9.5rem] flex-col overflow-y-auto rounded-b-lg bg-white'
        >
          {activities.length > 0 ? (
            activities.map((activitie, index) => (
              <button
                key={`${activitie.id}-${index}`}
                type='button'
                onClick={() => handleRowClick(activitie)}
                className='grid w-full grid-cols-[minmax(0,1fr)_4.25rem_4.25rem_1.25rem] border-b border-border py-2 text-center last:border-b-0 active:bg-blue-50/60'
              >
                <span className='truncate px-1 text-left'>
                  {activitie.name.length >= 14
                    ? `${activitie.name.slice(0, 14)}...`
                    : activitie.name}
                </span>
                <span>
                  {new Date(activitie.startTime).toLocaleTimeString()}
                </span>
                <span className='flex items-center justify-center'>
                  {activitie.endTime ? (
                    new Date(activitie.endTime).toLocaleTimeString()
                  ) : (
                    <Icon
                      className='size-3.5'
                      svg={LoadingIcon2Component}
                      animate
                    />
                  )}
                </span>
                <span className='flex items-center justify-center'>
                  {hasZonesConfigured(activitie) ? (
                    <CheckCircle2
                      size={13}
                      className='shrink-0 rounded-full bg-green-100 stroke-green-700'
                      aria-label='Golden zone e strike zone definidas'
                    />
                  ) : null}
                </span>
              </button>
            ))
          ) : (
            <p className='flex min-h-[9.5rem] w-full items-center justify-center text-secondary'>
              <Text variant='little-text'>nenhuma atividade registrada 📝</Text>
            </p>
          )}
        </div>
      </div>

      <ModalActivityZones
        activity={selectedActivity}
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setSelectedActivity(null);
        }}
        setAttTable={setAttTable}
        allowDelete={allowDelete}
      />
    </>
  );
};

export default TableActivitiesMobile;

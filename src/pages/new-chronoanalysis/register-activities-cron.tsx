import { useEffect, useState } from 'react';
import Text from '../../components/ui/text';
import PlayIconComponent from '../../assets/icons/play-icon.svg?react';
import {
  handleAddActivitie,
  handleStopActivitie,
  listActivities,
} from '../../db/db-functions';
import type { RegisterActivities, RegisterPresetActivities } from '../../db/db';
import TableActivities from '../../components/table-activities';
import TableActivitiesMobile from '../../components/table-activities-mobile';
import ListActivities from '../../components/list-activities';
import { listPresetActivities } from '../../db/db-functions-preset-activities';

import IconCheckComponent from '../../assets/icons/check-icon.svg?react';
import IconPauseComponent from '../../assets/icons/stoped-icon.svg?react';
import { useNavigate } from 'react-router';
import LabelActivitieInfo from '../../components/label-activities-info';
import Button from '@/components/ui/button/button';

const RegisterActivitiesCronPage = () => {
  const [idRegister] = useState<string | null>(() =>
    localStorage.getItem('idRegister'),
  );
  const [startTime, setStartTime] = useState<string | null>(() =>
    localStorage.getItem('startTime'),
  );
  const [attTable, setAttTable] = useState(false);

  const [allActivities, setAllActivities] = useState<RegisterActivities[]>([]);
  const [pinedActivities, setPinedActivities] = useState<
    RegisterPresetActivities[]
  >([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getPinedActivities = async () => {
      const activities = await listPresetActivities();
      if (activities) setPinedActivities(activities);
    };

    getPinedActivities();
  }, []);

  useEffect(() => {
    const getLocalActivities = async () => {
      const activities = await listActivities();

      if (activities) {
        setAllActivities(activities);
        setStartTime(localStorage.getItem('startTime'));
      }
    };

    if (attTable) {
      getLocalActivities();
      return setAttTable(false);
    }
    getLocalActivities();
  }, [attTable]);

  const hasActivities = allActivities.length > 0;

  return (
    <section className='flex min-h-[calc(100dvh-4.5rem)] flex-col gap-4 md:min-h-0 md:block md:gap-0'>
      {/* Desktop header */}
      <nav className='hidden items-center justify-between md:flex'>
        <Text variant={'title'}>Cronoanálise</Text>
        <div className='flex items-center gap-5'>
          <LabelActivitieInfo text='Identificação' textInfo={idRegister} />
          <LabelActivitieInfo
            svg={PlayIconComponent}
            textInfo={startTime && new Date(startTime).toLocaleDateString()}
            secondTextInfo={
              startTime && new Date(startTime).toLocaleTimeString()
            }
          />
        </div>
      </nav>

      {/* Mobile header */}
      <div className='grid grid-cols-2 gap-2 md:hidden'>
        <div className='flex flex-col gap-1'>
          <Text variant='text-label'>Identificação</Text>
          <span className='truncate rounded-lg border border-border px-2 py-1.5'>
            <Text variant='little-text'>{idRegister}</Text>
          </span>
        </div>
        <div className='flex flex-col gap-1'>
          <Text variant='text-label'>Horário</Text>
          <span className='truncate rounded-lg border border-border px-2 py-1.5'>
            <Text variant='little-text'>
              {startTime
                ? `${new Date(startTime).toLocaleDateString()} - ${new Date(startTime).toLocaleTimeString()}`
                : '-'}
            </Text>
          </span>
        </div>
      </div>

      <div className='md:my-5'>
        <div className='hidden md:block'>
          <TableActivities
            allActivities={allActivities}
            setAttTable={setAttTable}
            authFunc={true}
          />
        </div>
        <div className='md:hidden'>
          <TableActivitiesMobile
            allActivities={allActivities}
            setAttTable={setAttTable}
          />
        </div>
      </div>

      <ListActivities
        setAttTable={setAttTable}
        activities={pinedActivities}
        handleAddActivitie={handleAddActivitie}
      />

      {/* Desktop actions */}
      <div className='mt-5 hidden items-center justify-end gap-5 md:flex'>
        <Button
          size={'md'}
          svg={IconPauseComponent}
          disabled={!hasActivities}
          variant={!hasActivities ? 'default' : 'orange'}
          onClick={() => handleStopActivitie(setAttTable)}
        >
          pausar
        </Button>
        <Button
          size={'md'}
          svg={IconCheckComponent}
          disabled={!hasActivities}
          variant={!hasActivities ? 'default' : 'green'}
          onClick={() => {
            handleStopActivitie();
            navigate('/cronoanalise/revisao');
          }}
        >
          finalizar
        </Button>
      </div>

      {/* Mobile actions */}
      <div className='mt-auto flex items-center justify-end gap-3 pb-3 pt-5 md:hidden'>
        <Button
          size={'mobile'}
          svg={IconPauseComponent}
          disabled={!hasActivities}
          variant={!hasActivities ? 'default' : 'orange'}
          onClick={() => handleStopActivitie(setAttTable)}
          aria-label='Pausar cronoanálise'
        />
        <Button
          size={'mobile'}
          svg={IconCheckComponent}
          disabled={!hasActivities}
          variant={!hasActivities ? 'default' : 'green'}
          onClick={() => {
            handleStopActivitie();
            navigate('/cronoanalise/revisao');
          }}
          aria-label='Finalizar cronoanálise'
        />
      </div>
    </section>
  );
};

export default RegisterActivitiesCronPage;

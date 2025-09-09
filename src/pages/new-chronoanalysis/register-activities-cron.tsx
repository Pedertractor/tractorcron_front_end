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
import ListActivities from '../../components/list-activities';
import { listPresetActivities } from '../../db/db-functions-preset-activities';

import IconCheckComponent from '../../assets/icons/check-icon.svg?react';
import IconPauseComponent from '../../assets/icons/stoped-icon.svg?react';
import { useNavigate } from 'react-router';
import LabelActivitieInfo from '../../components/label-activities-info';
import Button from '@/components/ui/button/button';

const RegisterActivitiesCronPage = () => {
  const [idRegister] = useState<string | null>(() =>
    localStorage.getItem('idRegister')
  );
  const [startTime, setStartTime] = useState<string | null>(() =>
    localStorage.getItem('startTime')
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

  return (
    <section className=''>
      <nav className=' flex items-center justify-between'>
        <Text variant={'title'}>Cronoanálise</Text>

        <div className=' flex items-center gap-5'>
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

      <div className=' my-5'>
        <TableActivities
          allActivities={allActivities}
          setAttTable={setAttTable}
          authFunc={true}
        />
      </div>

      <ListActivities
        setAttTable={setAttTable}
        activities={pinedActivities}
        handleAddActivitie={handleAddActivitie}
      />
      <div className=' w-full flex items-center justify-end mt-5 gap-5'>
        <Button
          size={'md'}
          svg={IconPauseComponent}
          disabled={allActivities.length <= 0 ? true : false}
          variant={allActivities.length <= 0 ? 'default' : 'orange'}
          onClick={() => handleStopActivitie(setAttTable)}
        >
          pausar
        </Button>
        <Button
          size={'md'}
          svg={IconCheckComponent}
          disabled={allActivities.length <= 0 ? true : false}
          variant={allActivities.length <= 0 ? 'default' : 'green'}
          onClick={() => {
            handleStopActivitie();
            navigate('/chronoanalysis/review');
          }}
        >
          finalizar
        </Button>
      </div>
    </section>
  );
};

export default RegisterActivitiesCronPage;

import { Route, Routes } from 'react-router';
import RegisterActivitiesCronPage from '../pages/new-chronoanalysis/register-activities-cron';
import RegisterFinishInformationsPage from '../pages/new-chronoanalysis/register-finish-informations';
import RegisterInitialInformationsPage from '../pages/new-chronoanalysis/register-initial-informations';

const RouterChronoanalysis = () => {
  return (
    <Routes>
      <Route path='' element={<RegisterInitialInformationsPage />} />
      <Route path='activities' element={<RegisterActivitiesCronPage />} />
      <Route path='review' element={<RegisterFinishInformationsPage />} />
    </Routes>
  );
};

export default RouterChronoanalysis;

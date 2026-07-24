import HomePage from './pages/home';
import { Routes } from 'react-router';
import { Route } from 'react-router';
import RouterChronoanalysis from './routers/router-chronoanalysis';
import LoginPage from './pages/login';
import ProtectRoute from './routers/protect-route';
import SideBar from './components/ui/side-bar';
import Analysis from './pages/analysis';
import MagickLinkPage from './pages/magic-link';
import UsersAdminPage from './pages/users-admin';
import ActivitiesAdminPage from './pages/activities-admin';
import RequestChronoanalysisPage from './pages/request-chronoanalysis';
import ChronoanalysisRequestsPage from './pages/chronoanalysis-requests';
import TicketTrackingPage from './pages/ticket-tracking';

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/info/:uuid' element={<MagickLinkPage />} />
      <Route path='/ticket/:id' element={<TicketTrackingPage />} />
      <Route
        path='/solicitar-cronoanalise'
        element={<RequestChronoanalysisPage />}
      />
      <Route
        element={
          <ProtectRoute allowedRoles={['ADMIN', 'USER', 'CHRONOANALIST']} />
        }
      >
        <Route element={<SideBar />}>
          <Route path='/' element={<HomePage />} />
        </Route>
      </Route>

      <Route
        element={<ProtectRoute allowedRoles={['ADMIN', 'CHRONOANALIST']} />}
      >
        <Route element={<SideBar />}>
          <Route path='/cronoanalise/*' element={<RouterChronoanalysis />} />
          <Route path='/solicitacoes' element={<ChronoanalysisRequestsPage />} />
        </Route>
      </Route>
      <Route
        element={<ProtectRoute allowedRoles={['ADMIN', 'CHRONOANALIST']} />}
      >
        <Route element={<SideBar />}>
          <Route path='/relatorio' element={<Analysis />} />
        </Route>
      </Route>
      <Route element={<ProtectRoute allowedRoles={['ADMIN']} />}>
        <Route element={<SideBar />}>
          <Route path='/admin/usuarios' element={<UsersAdminPage />} />
          <Route path='/admin/atividades' element={<ActivitiesAdminPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;

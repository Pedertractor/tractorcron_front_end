import HomePage from './pages/home';
import { Routes } from 'react-router';
import { Route } from 'react-router';
import RouterChronoanalysis from './routers/router-chronoanalysis';
import LoginPage from './pages/login';
import ProtectRoute from './routers/protect-route';
import SideBar from './components/ui/side-bar';
import Analysis from './pages/analysis';

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
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
          <Route path='/chronoanalysis/*' element={<RouterChronoanalysis />} />
        </Route>
      </Route>
      <Route
        element={<ProtectRoute allowedRoles={['ADMIN', 'CHRONOANALIST']} />}
      >
        <Route element={<SideBar />}>
          <Route path='/analysis' element={<Analysis />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;

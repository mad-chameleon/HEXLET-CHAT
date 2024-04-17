import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth, useModal } from '../hooks/index.jsx';

import Navbar from './Navbar.jsx';
import ChatPage from './pages/ChatPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';

import routes from '../routes.js';
import modals from './modals/index.js';
import { startListening } from '../socket/index';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    startListening(dispatch);
  }, [dispatch]);

  const { loggedIn } = useAuth();
  const modal = useModal();

  const Redirect = loggedIn ? <ChatPage /> : <Navigate to={routes.login} />;

  return (
    <>
      <div className="d-flex flex-column h-100">
        <Navbar />
        <Routes>
          <Route path={routes.root} element={Redirect} />
          <Route path={routes.login} element={<LoginPage />} />
          <Route path={routes.signup} element={<RegistrationPage />} />
          <Route path={routes.others} element={<ErrorPage />} />
        </Routes>
      </div>
      { loggedIn && <div className="Toastify">{ modal.isShownToastify && <ToastContainer /> }</div> }
      { modal.isOpen && modals[modal.modalType] }
    </>
  );
};

export default App;

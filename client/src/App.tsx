import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import RegisterPage from './pages/RegisterPage';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './utils/ProtectedRoute';
import Layout from './components/layout/layout';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Modal from './components/ui/ForgotPassModal';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VerificationPage from './pages/VerificationPage';
function App() {
  const { isOpen } = useSelector((state: RootState) => state.modal);
  const error = useSelector((state: RootState) => state.auth.error);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
         //autoClose:5000, // 5 seconds
      });
    }
  },[error]);

  return (
    <>
      {isOpen && <Modal />}
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
        </Route>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset_password/:id/:token" element={<ResetPassword />} />
        <Route path="/auth/verify" element={<VerificationPage />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;

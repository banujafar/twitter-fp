import { Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './utils/ProtectedRoute';
import Layout from './components/layout/layout';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Modal from './components/ui/ForgotPassModal';
import ResetPassword from './pages/ResetPassword';

function App() {
  const { isOpen } = useSelector((state: RootState) => state.modal);
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
        <Route path="/reset_password/:id/:token" element={<ResetPassword/>}/>
      </Routes>
      {/* <h1 className=" text-sm text-cyan-400">Hello world!</h1> */}
    </>
  );
}

export default App;

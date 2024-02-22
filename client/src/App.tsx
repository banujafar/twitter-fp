import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import RegisterPage from './pages/RegisterPage';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './utils/ProtectedRoute';
import Layout from './components/layout/layout';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VerificationPage from './pages/VerificationPage';
import Post from './pages/Post';
import UserProfile from './pages/UserProfile';
import Messages from './pages/Messages';
import Favorites from './pages/Favorites';
import Notifications from './pages/Notifications';
import Suggestions from './pages/Suggestions';
import SearchPage from './pages/SearchPage';
function App() {
  const error = useSelector((state: RootState) => state.auth.error);
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right"
        //autoClose:5000, // 5 seconds
      });
    }
  }, [error]);

  return (
    <>
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
          <Route
            path="/post/:userid/:postid"
            element={
              <Layout>
                <Post />
              </Layout>
            }
          />
          <Route
            path="/profile/:username/"
            element={
              <Layout>
                <UserProfile />
              </Layout>
            }
          />
          <Route
            path="/messages"
            element={
              <Layout>
                <Messages />
              </Layout>
            }
          />
          <Route
            path="/favorites"
            element={
              <Layout>
                <Favorites />
              </Layout>
            }
          />
          <Route
            path="/explore"
            element={
              <Layout>
                <SearchPage />
              </Layout>
            }
          />
          <Route
            path="/notifications"
            element={
              <Layout>
                <Notifications />
              </Layout>
            }
          />
          <Route
            path="/suggestions"
            element={
              <Layout>
                <Suggestions />
              </Layout>
            }
          />
          <Route
            path="/post/:userid/:postid"
            element={
              <Layout>
                <Post />
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

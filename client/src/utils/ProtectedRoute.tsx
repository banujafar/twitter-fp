import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TwitterLoader from '../components/loaders/TwitterLoader';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { checkAuth } from '../store/features/auth/authSlice';
import Login from '../pages/Login';

const ProtectedRoute = () => {
  const { loading, isAuth } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(checkAuth());
        console.log(res.payload);

        if (res.payload?.error) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error during authentication check:', error);
        navigate('/login');
      }
    };

    fetchData();
  }, []);
  
  if (loading) {
    return <TwitterLoader />;
  }

  return isAuth ? <Outlet /> : <Login />;
};

export default ProtectedRoute;

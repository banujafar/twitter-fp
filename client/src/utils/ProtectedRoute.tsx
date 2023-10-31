import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
const ProtectedRoute = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:3000/checkAuth', {
          withCredentials: true,
        });

        if (response.status === 200) {
          const { isAuth } = response.data;
          if (isAuth ) {
            setAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    // Display a loading indicator, or you can return null
    return <div>Loading...</div>;
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

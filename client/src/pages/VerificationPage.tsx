import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'; // Adjust if using a different routing library
import { AppDispatch, RootState } from '../store';
import { verifyEmail } from '../store/features/auth/authSlice';
import TwitterLoader from '../components/loaders/TwitterLoader';

const VerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const getVerifyEmail = async () => {
      try {
        const result = await dispatch(verifyEmail(token));
        console.log(result.payload);
        if (!result.payload.error) {
          setVerificationStatus('Verification successful! Redirecting....');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setVerificationStatus(error);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getVerifyEmail();
  }, [dispatch, token]);

  if (loading) {
    return <TwitterLoader />;
  }
  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="bg-white shadow-md p-4 w-96 rounded-lg">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          verificationStatus && <div className="text-blue-500">{verificationStatus}</div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;

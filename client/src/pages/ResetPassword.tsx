import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { confirmResetPassword, resetPass } from '../store/features/auth/authSlice';
import TwitterLoader from '../components/loaders/TwitterLoader';

const ResetPassword = () => {
  //TODO:WILL BE RECHANGED WITH LOADER
  const [loading, setLoading] = useState(true);
  const [resetError, setResetError] = useState('');
  const { token, id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const result = await dispatch(resetPass({ id, token }));
        if (result.payload) {
          setLoading(false);
        } else {
          setLoading(false);
          setResetError('Link is expired or Invalid params');
        }
      } catch (error) {
        setLoading(false);
        setResetError('An error occurred');
      }
    };

    checkToken();
  }, [token]);

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: async (values) => {
      console.log('Form submitted with values:', values);
      console.log(values);
      const resetData = {
        ...values,
        id,
        token,
      };
      console.log(resetData);
      const result = await dispatch(confirmResetPassword(resetData));
      if (result) {
        navigate('/login');
      } else {
        setResetError('Failed to Reset Password');
        navigate('/register');
      }
    },
  });

  if (loading) {
    return <TwitterLoader />;
  }

  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="bg-white shadow-md p-4 w-96 rounded-lg">
        {resetError ? (
          <div className="text-red-500">{resetError}</div>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block font-bold text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500">{formik.errors.password}</div>
              ) : null}
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block font-bold text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirm_password}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              />
              {formik.touched.confirm_password && formik.errors.confirm_password ? (
                <div className="text-red-500">{formik.errors.confirm_password}</div>
              ) : null}
            </div>

            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

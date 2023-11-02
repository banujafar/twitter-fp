import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { resetPass } from '../store/features/auth/authSlice';
const ResetPassword = () => {
  const [loading, setLoading] = useState(true); // Initialize loading state to true
  const [resetError, setResetError] = useState('');
  const { token, id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  console.log('token', token, id);
  useEffect(() => {
    // Make the initial request to check the token
    const checkToken = async () => {
      try {
        const result = await dispatch(resetPass({ id, token }));
        console.log(result)
        if (result.payload) {
          setLoading(false);
        } else {
            setLoading(false)
          setResetError('Link is expired or Invalid params');
        }
      } catch (error) {
        setLoading(false);
        setResetError('An error occurred'); // Set a generic error message
      }
    };

    checkToken();
  }, [token]);

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: (values) => {
      // Implement your reset password logic here
      console.log('Form submitted with values:', values);
    },
  });

  return (
    <div className="flex justify-center">
      {loading ? (
        <div>Loading...</div>
      ) : resetError ? (
        <div className="error">{resetError}</div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="error">{formik.errors.password}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="error">{formik.errors.confirmPassword}</div>
            ) : null}
          </div>

          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;

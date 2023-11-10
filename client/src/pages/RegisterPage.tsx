import { ErrorMessage, Field, Formik, Form } from 'formik';
import * as Yup from 'yup';
import Aside from '../components/ui/Aside';
import { BsTwitter } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/features/auth/authSlice';
import { AppDispatch, RootState } from '../store';
import TwitterLoader from '../components/loaders/TwitterLoader';
import { useState } from 'react';
import Verification from '../components/ui/Verification';

const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { error, loading } = useSelector((state: RootState) => state.auth);
  const [verification, setVerification] = useState(false);

  if (loading) {
    return <TwitterLoader />;
  }
  return (
    <>
      <div className="flex">
        <Aside />
        {verification ? (
          <Verification />
        ) : (
          <main className="bg-black min-h-screen h-auto w-2/5 lg:w-2/5 md:full sm:w-full xs:w-full">
            <div className="container mx-auto flex justify-center items-center">
              <div className="py-3 px-5">
                <span className="text-gray-300 text-5xl">
                  <BsTwitter />
                </span>
                <h1 className="text-gray-300 text-6xl mb-10 mt-10 font-bold">Happening now</h1>
                <h2 className="text-gray-300 text-3xl mb-8 font-bold">Join Twitter now</h2>

                <div className="">
                  <Formik
                    initialValues={{
                      username: '',
                      email: '',
                      password: '',
                    }}
                    validationSchema={Yup.object().shape({
                      username: Yup.string()
                        .required('Username is required')
                        .max(50, 'Username must be at most 50 characters'),
                      email: Yup.string()
                        .required('Email is required')
                        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Invalid email format'),
                      password: Yup.string()
                        .required('Password is required')
                        .min(8, 'Password must contain from 8 to 50 characters')
                        .max(50, 'Password must contain from 8 to 50 characters'),
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                      const credentials = {
                        username: values.username,
                        email: values.email,
                        password: values.password,
                      };
                      try {
                        const result = await dispatch(registerUser(credentials));

                        if (registerUser.fulfilled.match(result)) {
                          setSubmitting(false);
                          setVerification(true);
                        }
                      } catch (error) {
                        console.error('Login error:', error);
                        setSubmitting(false);
                      }
                    }}
                  >
                    {({ isSubmitting, isValid }) => (
                      <Form>
                        <div className="mb-4">
                          <label htmlFor="username" className="block text-white text-base font-bold mb-2">
                            Username
                          </label>
                          <Field
                            type="text"
                            id="username"
                            name="username"
                            placeholder="username"
                            className=" w-full px-3 py-2 border rounded-2xl focus:outline-none focus:border-blue-500"
                          />
                          <ErrorMessage name="username" component="div" className="text-red-500 text-base" />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="email" className="block text-white text-base font-bold mb-2">
                            Email
                          </label>
                          <Field
                            type="text"
                            id="email"
                            name="email"
                            placeholder="email"
                            className=" w-full px-3 py-2 border rounded-2xl focus:outline-none focus:border-blue-500"
                          />
                          <ErrorMessage name="email" component="div" className="text-red-500 text-base" />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="password" className="block text-white text-base font-bold mb-2">
                            Password
                          </label>
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            placeholder="********"
                            className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:border-blue-500"
                          />
                          <ErrorMessage name="password" component="div" className="text-red-500 text-base" />
                        </div>
                        {error && (
                          <div>
                            <h5 className="text-red-600 font-medium">Error occurred</h5>
                          </div>
                        )}
                        <button
                          type="submit"
                          disabled={isSubmitting || !isValid}
                          className={
                            isValid
                              ? 'hover:bg-blue-400  focus:bg-blue-400 bg-blue-500 text-white mt-3 w-full rounded-2xl py-2 px-6 focus:outline-none'
                              : 'bg-blue-500 text-white mt-3 py-2 px-6 rounded-2xl w-full focus:outline-none'
                          }
                        >
                          Sign Up
                        </button>

                        <p className="text-white mt-5">
                          Already a member?
                          <Link className="ml-1 text-blue-500" to="/login">
                            Login
                          </Link>
                        </p>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
    </>
  );
};

export default RegisterPage;

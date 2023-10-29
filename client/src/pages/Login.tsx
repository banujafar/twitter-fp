import * as React from 'react';
import { Formik, Form, Field } from 'formik';
import Aside from '../components/ui/Aside';
import { BsTwitter } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';

interface MyFormValues {
  userName: string;
  email: string;
  password: string;
}

const Login: React.FC<object> = () => {
  const initialValues: MyFormValues = { userName: '', email: '', password: '' };
  return (
    <div className="flex">
      <Aside />
      <main className="bg-black min-h-screen h-auto w-2/5 lg:w-2/5 md:full sm:w-full xs:w-full flex justify-center items-center ">
        <div className="container mx-auto">
          <div className="py-3 px-5 flex flex-col justify-center items-center w-full gap-4">
            <span className="text-gray-300 text-5xl">
              <BsTwitter />
            </span>
            <Formik
              initialValues={initialValues}
              onSubmit={(values, actions) => {
                console.log({ values, actions });
                alert(JSON.stringify(values, null, 2));
                actions.setSubmitting(false);
              }}
            >
              <Form className="flex flex-col gap-4 w-3/4">
                <Link
                  to="/"
                  className="bg-white mt-20 py-2 px-3 rounded-2xl w-full focus:outline-none flex gap-2 items-center font-semibold"
                >
                  <FcGoogle size={'25'} />
                  <span>Continue with Google</span>
                </Link>
                <Field
                  id="userInfo"
                  name="userInfo"
                  placeholder="Email or Username"
                  className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:border-blue-500"
                />
                <Field
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:border-blue-500"
                />
                <div className="text-white flex gap-2 xs:text-xs sm:text-sm  px-2">
                  <label className="flex gap-2 cursor-pointer">
                    <Field id="remember" type="checkbox" name="remember" value="remember me" />
                    Remember me
                  </label>
                  <Link to={'/recoverPass'}>Forgot password?</Link>
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 text-white mt-20 py-2 px-6 rounded-2xl w-full focus:outline-none"
                >
                  Log in
                </button>
                <div className="flex gap-2 px-2">
                  <span className="text-primaryGray">Don't have an account? </span>
                  <Link to="/register" className=" text-blue-500">
                    Sign up
                  </Link>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Login;

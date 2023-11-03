import * as React from 'react';
import { Formik, Form, Field } from 'formik';
import Aside from '../components/ui/Aside';
import { BsTwitter } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openModal } from '../store/features/modal/modalSlice';
import { loginUser } from '../store/features/auth/authSlice';
import { AppDispatch } from '../store';
interface MyFormValues {
  password: string;
  email: string;
}

const Login: React.FC<object> = () => {
  const initialValues: MyFormValues = { email: '', password: '' };
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenModal = () => {
    dispatch(openModal());
  };
  const handleLoginwithGoogle=()=>{
    //handle google login here
  }
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
              onSubmit={async (values, actions) => {
                const result = await dispatch(loginUser(values));
                if (result) {
                  navigate('/');
                }else{
                  actions.setFieldError('email', "Email or Password is incorrect");
                  actions.setSubmitting(false);
                }
               
              }}
            >
              <Form className="flex flex-col gap-4 w-3/4">
                <Link
                  to="/"
                  className="bg-white mt-20 py-2 px-3 rounded-2xl w-full focus:outline-none flex gap-2 items-center font-semibold"
                >
                  <FcGoogle size={'25'} />
                  <span onClick={handleLoginwithGoogle}>Continue with Google</span>
                </Link>
                <Field
                  id="email"
                  name="email"
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
                  <span onClick={handleOpenModal} className=" cursor-pointer">
                    Forgot password?
                  </span>
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

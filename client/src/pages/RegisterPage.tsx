import { ErrorMessage, Field, Formik, Form } from "formik";
import * as Yup from "yup";
import Aside from "../components/ui/Aside";
import { BsTwitter } from "react-icons/bs";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <>
      <div className="flex w-full h-sceen">
        <Aside />
        <main className="bg-black w-2/5">
          <div className="p-5 flex justify-center items-center">
            <div className="text-gray-400">
              <span className="text-white text-5xl">
                <BsTwitter />
              </span>
              <h1 className="text-white text-6xl mb-10 mt-10 font-bold">
                Happening now
              </h1>
              <h2 className="text-3xl text-white mb-8 font-bold">
                Join Twitter now
              </h2>

              <div className="">
                <Formik
                  initialValues={{
                    username: "",
                    email: "",
                    password: "",
                  }}
                  validationSchema={Yup.object().shape({
                    username: Yup.string().required("Username is required"),
                    email: Yup.string().required("Email is required"),
                    password: Yup.string()
                      .required("Password is required")
                      .min(6, "Password must contain from 6 to 50 characters")
                      .max(50, "Password must contain from 6 to 50 characters"),
                  })}
                  onSubmit={() => {}}
                >
                  {({ isSubmitting, isValid }) => (
                    <Form>
                    <div className="mb-4">
                        <label
                          htmlFor="username"
                          className="block text-white text-base font-bold mb-2"
                        >
                          Username
                        </label>
                        <Field
                          type="text"
                          id="username"
                          name="username"
                          placeholder="username"
                          className=" w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="text-red-500 text-base"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="email"
                          className="block text-white text-base font-bold mb-2"
                        >
                          Email
                        </label>
                        <Field
                          type="text"
                          id="email"
                          name="email"
                          placeholder="email"
                          className=" w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-base"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="password"
                          className="block text-white text-base font-bold mb-2"
                        >
                          Password
                        </label>
                        <Field
                          type="password"
                          id="password"
                          name="password"
                          placeholder="********"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500 text-base"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        className={
                          isValid
                            ? "hover:bg-blue-400  focus:bg-blue-400 bg-blue-500 text-white mt-3 w-full rounded-lg py-2 px-6 focus:outline-none"
                            : "bg-blue-500 text-white mt-3 py-2 px-6 rounded-lg w-full focus:outline-none"
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
      </div>
    </>
  );
};

export default RegisterPage;
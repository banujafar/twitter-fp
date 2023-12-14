import { BsTwitter } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../store/features/modal/modalSlice';
import { AppDispatch } from '../../store';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
//import { resetPassword } from '../../store/features/auth/resetPassword';
import { useState } from 'react';
import { forgotPass } from '../../store/features/auth/authSlice';
const Modal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [successMessage, setSuccessMessage] = useState(''); // Add a state for success message

  const handleCloseModal = () => {
    dispatch(closeModal());
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Invalid email format'),
  });

  return (
    <div className="flex justify-center">
      <div className="z-50 max-w-lg w-2/3 bg-black rounded-lg px-8 pt-8 pb-16 border-gray-700 border-2 fixed mt-16 h-3/4">
        <div className="flex justify-between items-center mb-4 text-gray-700">
          <span className="text-2xl text-gray-700 cursor-pointer" onClick={handleCloseModal}>
            X
          </span>
          <BsTwitter className="text-4xl" />
        </div>
        <div className="text-gray-800 h-full">
          <h1 className="text-2xl font-semibold mb-2">Find your Twitter account</h1>
          <p className="text-sm text-gray-600 mb-8">
            Enter the email associated with your account to change your password.
          </p>
          <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
              const email = values.email;
              const result = await dispatch(forgotPass({ email }));
              if (result) {
                setSuccessMessage('Email sent successfully');
              } else {
                setSuccessMessage('Failed');
              }

              resetForm();
            }}
          >
            <Form>
              <Field
                type="text"
                id="email"
                name="email"
                placeholder="Email Address"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
              <ErrorMessage name="email" component="div" className="text-red-500" />

              <button className="w-full bg-blue-500 text-white rounded mt-2 py-2 hover:bg-blue-600" type="submit">
                Submit
              </button>
            </Form>
          </Formik>
          {successMessage && <div className="text-white mt-4 flex justify-center">{successMessage}</div>}
        </div>
      </div>
      <div
        className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-80 w-full h-full top-0 left-0"
        onClick={handleCloseModal}
      ></div>
    </div>
  );
};

export default Modal;

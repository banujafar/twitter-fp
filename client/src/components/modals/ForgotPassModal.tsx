import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { forgotPass } from '../../store/features/auth/authSlice';
import { setIsOpen } from '../../store/features/modal/modalSlice';
import Modal from './Modal';
const ForgotPassModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [successMessage, setSuccessMessage] = useState('');

  const handleCloseModal = () => {
    dispatch(setIsOpen({ id: 'modalForgotPass', isOpen: false }));
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Invalid email format'),
  });

  return (
    <Modal
      modal={{
        modalId: 'modalForgotPass',
        modalContent: (
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
                    setTimeout(() => {
                      handleCloseModal();
                    }, 1000);
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

                  <button
                    className="w-full bg-blue-500 text-white rounded mt-2 py-2 hover:bg-blue-600"
                    type="submit"
                  >
                    Submit
                  </button>
                </Form>
              </Formik>
              {successMessage && <div className="text-black mt-4 flex justify-center">{successMessage}</div>}
            </div>
        ),
      }}
    />
  );
};

export default ForgotPassModal;
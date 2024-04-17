import { Button, Form } from 'react-bootstrap';

import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/index.jsx';

import routes from '../../routes.js';

import { sendRegistrationData } from '../../requests';
import { useRegistrationFormSchema } from '../../schemas/index';
import RegistrationFormAlert from './RegistrationFormAlert';

const RegistrationForm = () => {
  const { t } = useTranslation();
  const inputRef = useRef();
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

  const registrationSchema = useRegistrationFormSchema(t);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: registrationSchema,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setRegistrationFailed(false);
      try {
        const { username, password } = values;
        const { data } = await sendRegistrationData({ username, password });
        localStorage.setItem('user', JSON.stringify(data));
        auth.logIn();
        const { from } = location.state || { from: { pathname: routes.root } };
        navigate(from);
      } catch (error) {
        if (error.isAxiosError && error.response.status === 409) {
          setRegistrationFailed(true);
          inputRef.current.select();
        }
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} className="w-100 pt-0">
      <h1 className="text-center mb-4">{t('form.signUp')}</h1>
      {registrationFailed && <RegistrationFormAlert />}
      <Form.Group className="mb-3" controlId="username">
        <Form.Control
          className="form-input"
          ref={inputRef}
          type="text"
          name="username"
          autoComplete="username"
          placeholder={t('form.fields.username')}
          required
          value={formik.values.username}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          isInvalid={(formik.errors.username && formik.touched.username) || registrationFailed}
        />
        <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Control
          className="form-input"
          type="password"
          name="password"
          placeholder={t('form.fields.password')}
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={(formik.errors.password && formik.touched.password) || registrationFailed}
        />
        <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="passwordConfirmation">
        <Form.Control
          className="form-input"
          type="password"
          name="passwordConfirmation"
          autoComplete="passwordConfirmation"
          placeholder={t('form.fields.passwordConfirmation')}
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={
            // eslint-disable-next-line max-len
            (formik.errors.passwordConfirmation && formik.touched.passwordConfirmation) || registrationFailed
          }
        />
        <Form.Control.Feedback type="invalid">{formik.errors.passwordConfirmation}</Form.Control.Feedback>
      </Form.Group>
      <Button variant="btn btn-green" type="submit" className="w-100 reg-btn-sm">
        {t('form.signUpBtn')}
      </Button>
    </Form>
  );
};

export default RegistrationForm;

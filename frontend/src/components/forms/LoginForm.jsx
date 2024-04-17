import { Form, Button } from 'react-bootstrap';

import { AxiosError } from 'axios';

import { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useAuth } from '../../hooks/index.jsx';

import routes from '../../routes.js';
import { sendLoginData } from '../../requests';

const LoginForm = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

  const [authFailed, setAuthFailed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      setAuthFailed(false);
      try {
        const { data } = await sendLoginData(values);
        localStorage.setItem('user', JSON.stringify(data));
        auth.logIn();
        const { from } = location.state || { from: { pathname: routes.root } };
        navigate(from);
      } catch (error) {
        setSubmitting(false);
        if (error instanceof AxiosError && error.response.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        throw (error);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} className="pt-0">
      <h1 className="text-center mb-4">{t('form.signIn')}</h1>
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
          onChange={formik.handleChange}
          isInvalid={authFailed}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Control
          className="form-input"
          type="password"
          name="password"
          placeholder={t('form.fields.password')}
          required
          onChange={formik.handleChange}
          isInvalid={authFailed}
        />
        <Form.Control.Feedback type="invalid">{t('errors.loginFailed')}</Form.Control.Feedback>
      </Form.Group>
      <Button variant="btn" type="submit" className="btn-green w-100 mb-3">
        {t('form.signInBtn')}
      </Button>
    </Form>
  );
};

export default LoginForm;

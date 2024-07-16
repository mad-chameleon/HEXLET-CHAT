import {
  Modal,
  FormGroup,
  FormControl,
  Button,
  Form,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setLocale } from 'yup';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { useModal } from '../../hooks/index';
import { setCurrentChannelId, setLastAddedBy } from '../../store/slices/channelsSlice';
import filterProfanityWords from '../../dictionary';
import { useFetchChannelMutation } from '../../services/channelsApi';
import handleFetchErrors from '../../utils';
import usePrevious from '../../hooks/usePrevious';

const AddChannelModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { hideModal } = useModal();

  const channels = useSelector((state) => state.channels.channelsData);
  const { userInfo: { username } } = useSelector((state) => state.user);

  const channelNames = channels.map(({ name }) => name);

  const inputRef = useRef();

  const [fetchChannel, { isLoading: isAddingChannel }] = useFetchChannelMutation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  setLocale({
    mixed: {
      notOneOf: () => t('errors.modalErrors.notOneOf'),
      required: () => t('errors.modalErrors.required'),
    },
    string: {
      min: () => t('errors.modalErrors.min'),
      max: () => t('errors.modalErrors.max'),
    },
  });

  const addChannelSchema = Yup.object().shape({
    name: Yup
      .string()
      .required()
      .min(3)
      .max(20)
      .transform((channelName) => channelName.trim())
      .notOneOf(channelNames),
  });

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: addChannelSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const preparedData = { name: filterProfanityWords(values.name.trim()) };
      const { data, error } = await fetchChannel(preparedData);
      if (error) {
        handleFetchErrors(error, t);
        return;
      }
      dispatch(setCurrentChannelId({ id: data.id, name: username }));
      dispatch(setLastAddedBy({ name: username }));
    },
  });

  const prevChannelsLength = usePrevious(channels.length);

  useEffect(() => {
    if (prevChannelsLength !== undefined && channels.length > prevChannelsLength) {
      hideModal();
      toast.success(t('toasts.channelCreated'));
    }
  }, [channels.length, prevChannelsLength, dispatch]);

  return (
    <Modal centered show onHide={() => hideModal()}>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.addChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              className="mb-2"
              ref={inputRef}
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={formik.errors.name && formik.touched.name}
              disabled={isAddingChannel}
            />
            <Form.Label className="visually-hidden" htmlFor="name">{t('chat.channelName')}</Form.Label>
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
            <div className="d-flex justify-content-end mt-4">
              <Button
                type="button"
                variant="secondary"
                className="me-2"
                onClick={() => hideModal()}
                disabled={isAddingChannel}
              >
                {t('form.cancelBtn')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isAddingChannel}
              >
                {t('form.sendBtn')}
              </Button>
            </div>
          </FormGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannelModal;

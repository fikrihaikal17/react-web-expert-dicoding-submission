import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthGuardMessage from '../components/AuthGuardMessage';
import useInput from '../hooks/useInput';
import useI18n from '../hooks/useI18n';
import { asyncCreateThread } from '../states/thunks';

function NewThreadPage() {
  const authUser = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, onTitleChange] = useInput('');
  const [category, onCategoryChange] = useInput('');
  const [body, onBodyChange] = useInput('');
  const { t } = useI18n();

  useEffect(() => {
    document.title = t('newThread.titlePage');
  }, [t]);

  async function onSubmit(event) {
    event.preventDefault();

    const success = await dispatch(asyncCreateThread({ title, body, category }));

    if (success) {
      navigate('/');
    }
  }

  return (
    <section className="page-section">
      <section className="section-block">
        <h2 className="section-title">{t('newThread.title')}</h2>

        {!authUser && (
          <AuthGuardMessage message={t('newThread.loginRequiredCreate')} />
        )}

        <form className="form-stack" onSubmit={onSubmit}>
          <input
            type="text"
            name="title"
            placeholder={t('newThread.titlePlaceholder')}
            value={title}
            onChange={onTitleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder={t('newThread.categoryPlaceholder')}
            value={category}
            onChange={onCategoryChange}
            required
          />
          <textarea
            name="body"
            placeholder={t('newThread.bodyPlaceholder')}
            rows={7}
            value={body}
            onChange={onBodyChange}
            required
          />
          <button type="submit" className="button button--primary" disabled={!authUser}>
            {t('newThread.publish')}
          </button>
        </form>
      </section>
    </section>
  );
}

export default NewThreadPage;

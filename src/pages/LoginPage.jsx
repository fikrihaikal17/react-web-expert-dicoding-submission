import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import useI18n from '../hooks/useI18n';
import { asyncLoginUser } from '../states/thunks';

function LoginPage() {
  const authUser = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { t } = useI18n();

  useEffect(() => {
    document.title = t('auth.loginTitlePage');
  }, [t]);

  if (authUser) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(values) {
    const { email, password } = values;

    const success = await dispatch(asyncLoginUser({ email, password }));

    if (success) {
      navigate('/');
    }
  }

  return (
    <section className="page-section">
      <section className="section-block auth-card">
        <h2 className="section-title">{t('auth.loginTitle')}</h2>

        <form className="form-stack" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            name="email"
            placeholder={t('auth.emailPlaceholder')}
            {...register('email', { required: true })}
            required
          />
          <input
            type="password"
            name="password"
            placeholder={t('auth.passwordPlaceholder')}
            {...register('password', { required: true })}
            required
          />
          <button type="submit" className="button button--primary">{t('auth.loginButton')}</button>
        </form>

        <p className="auth-copy">
          {t('auth.noAccount')} <Link className="auth-link" to="/register">{t('auth.registerHere')}</Link>.
        </p>
      </section>
    </section>
  );
}

export default LoginPage;

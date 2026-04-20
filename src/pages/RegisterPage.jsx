import { useEffect, useState } from 'react';
import { BiHide, BiShow } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import useI18n from '../hooks/useI18n';
import { asyncRegisterUser } from '../states/thunks';

function RegisterPage() {
  const authUser = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [confirmPassword, onConfirmPasswordChange] = useInput('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useI18n();

  const hasPasswordInput = password.length > 0 || confirmPassword.length > 0;
  const isPasswordMatch = password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;
  const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    document.title = t('auth.registerTitlePage');
  }, [t]);

  if (authUser) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      return;
    }

    const success = await dispatch(asyncRegisterUser({ name, email, password }));

    if (success) {
      navigate('/login');
    }
  }

  return (
    <section className="page-section">
      <section className="section-block auth-card">
        <h2 className="section-title">{t('auth.registerTitle')}</h2>

        <form className="form-stack" onSubmit={onSubmit}>
          <input
            type="text"
            name="name"
            placeholder={t('auth.namePlaceholder')}
            value={name}
            onChange={onNameChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChange={onEmailChange}
            required
          />
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChange={onPasswordChange}
              required
              minLength={6}
            />
            <button
              type="button"
              className="password-field__toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              title={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
            >
              {showPassword ? <BiHide /> : <BiShow />}
            </button>
          </div>

          <div className="password-field">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder={t('auth.confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChange={onConfirmPasswordChange}
              required
              minLength={6}
            />
            <button
              type="button"
              className="password-field__toggle"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              title={showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}
            >
              {showConfirmPassword ? <BiHide /> : <BiShow />}
            </button>
          </div>

          <p
            className={`password-hint ${isPasswordMatch ? 'password-hint--ok' : ''} ${isPasswordMismatch ? 'password-hint--error' : ''}`}
            aria-live="polite"
          >
            {hasPasswordInput ? (isPasswordMatch ? t('auth.passwordMatch') : t('auth.passwordNotMatch')) : ''}
          </p>

          <button type="submit" className="button button--primary" disabled={isPasswordMismatch}>
            {t('auth.registerButton')}
          </button>
        </form>

        <p className="auth-copy">
          {t('auth.haveAccount')} <Link className="auth-link" to="/login">{t('auth.loginNow')}</Link>.
        </p>
      </section>
    </section>
  );
}

export default RegisterPage;

import { Link } from 'react-router-dom';
import useI18n from '../hooks/useI18n';

function AuthGuardMessage({ message }) {
  const { t } = useI18n();

  return (
    <p className="auth-guard-message">
      {message} <Link to="/login">{t('auth.loginRequiredHere')}</Link>.
    </p>
  );
}

export default AuthGuardMessage;

import { Link } from 'react-router-dom';
import useI18n from '../hooks/useI18n';

function NotFoundPage() {
  const { t } = useI18n();

  return (
    <section className="page-section">
      <section className="section-block not-found">
        <h2 className="section-title">{t('notFound.title')}</h2>
        <p>{t('notFound.message')}</p>
        <Link className="auth-link" to="/">{t('notFound.backHome')}</Link>
      </section>
    </section>
  );
}

export default NotFoundPage;

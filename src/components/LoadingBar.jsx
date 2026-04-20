import { useSelector } from 'react-redux';
import useI18n from '../hooks/useI18n';
import { selectIsLoading } from '../states/loadingSlice';

function LoadingBar() {
  const isLoading = useSelector(selectIsLoading);
  const { t } = useI18n();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="loading-bar" aria-label={t('common.loadingData')} role="status">
      <div className="loading-bar__inner" />
    </div>
  );
}

export default LoadingBar;

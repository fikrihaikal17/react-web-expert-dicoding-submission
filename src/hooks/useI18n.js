import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getText } from '../i18n';

function useI18n() {
  const language = useSelector((state) => state.preferences.language);

  const t = useCallback((key, params) => {
    return getText(language, key, params);
  }, [language]);

  return { language, t };
}

export default useI18n;

import translations from './translations';

function getValueByPath(object, keyPath) {
  return keyPath.split('.').reduce((current, key) => current?.[key], object);
}

function interpolate(text, params) {
  if (typeof text !== 'string') {
    return text;
  }

  return Object.entries(params).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    text,
  );
}

function getText(language, key, params = {}) {
  const activeLanguage = translations[language] ? language : 'id';
  const fallback = translations.id;

  const rawValue = getValueByPath(translations[activeLanguage], key) ??
    getValueByPath(fallback, key) ??
    key;

  return interpolate(rawValue, params);
}

export { getText };

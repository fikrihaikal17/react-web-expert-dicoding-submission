import { useEffect, useState } from 'react';
import useI18n from './useI18n';
import { translateHtml, translateText } from '../utils/translator';

function useAutoTranslateText(value, targetLanguage = 'en') {
  const sourceValue = value || '';
  const { language } = useI18n();
  const [translatedPayload, setTranslatedPayload] = useState({
    source: '',
    value: '',
  });
  const shouldTranslate = Boolean(sourceValue.trim()) && language === targetLanguage;

  useEffect(() => {
    if (!shouldTranslate) {
      return undefined;
    }

    let isCancelled = false;

    translateText(sourceValue, targetLanguage).then((nextValue) => {
      if (!isCancelled) {
        setTranslatedPayload({
          source: sourceValue,
          value: nextValue,
        });
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [shouldTranslate, sourceValue, targetLanguage]);

  if (!shouldTranslate) {
    return sourceValue;
  }

  if (translatedPayload.source !== sourceValue) {
    return sourceValue;
  }

  return translatedPayload.value || sourceValue;
}

function useAutoTranslateHtml(value, targetLanguage = 'en') {
  const sourceValue = value || '';
  const { language } = useI18n();
  const [translatedPayload, setTranslatedPayload] = useState({
    source: '',
    value: '',
  });
  const shouldTranslate = Boolean(sourceValue.trim()) && language === targetLanguage;

  useEffect(() => {
    if (!shouldTranslate) {
      return undefined;
    }

    let isCancelled = false;

    translateHtml(sourceValue, targetLanguage).then((nextValue) => {
      if (!isCancelled) {
        setTranslatedPayload({
          source: sourceValue,
          value: nextValue,
        });
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [shouldTranslate, sourceValue, targetLanguage]);

  if (!shouldTranslate) {
    return sourceValue;
  }

  if (translatedPayload.source !== sourceValue) {
    return sourceValue;
  }

  return translatedPayload.value || sourceValue;
}

export { useAutoTranslateHtml, useAutoTranslateText };

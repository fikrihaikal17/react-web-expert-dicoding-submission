const CACHE_STORAGE_KEY = 'auto-translate-cache-v1';
const MAX_CACHE_ENTRIES = 500;

const runtimeCache = new Map();
const pendingRequests = new Map();
let storageLoaded = false;

function canUseBrowserStorage() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function loadStorageCache() {
  if (storageLoaded || !canUseBrowserStorage()) {
    return;
  }

  storageLoaded = true;

  try {
    const rawValue = localStorage.getItem(CACHE_STORAGE_KEY);

    if (!rawValue) {
      return;
    }

    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      return;
    }

    parsed.forEach(([key, value]) => {
      if (typeof key === 'string' && typeof value === 'string') {
        runtimeCache.set(key, value);
      }
    });
  } catch {
    localStorage.removeItem(CACHE_STORAGE_KEY);
  }
}

function persistStorageCache() {
  if (!canUseBrowserStorage()) {
    return;
  }

  try {
    const serialized = JSON.stringify([...runtimeCache.entries()]);
    localStorage.setItem(CACHE_STORAGE_KEY, serialized);
  } catch {
    // Ignore storage failures and keep runtime cache only.
  }
}

function getCacheKey(targetLanguage, value) {
  return `${targetLanguage}::${value}`;
}

function setCachedTranslation(cacheKey, translatedValue) {
  if (runtimeCache.has(cacheKey)) {
    runtimeCache.delete(cacheKey);
  }

  runtimeCache.set(cacheKey, translatedValue);

  if (runtimeCache.size > MAX_CACHE_ENTRIES) {
    const oldestKey = runtimeCache.keys().next().value;
    runtimeCache.delete(oldestKey);
  }

  persistStorageCache();
}

async function requestTranslation(value, targetLanguage) {
  const query = encodeURIComponent(value);
  const endpoint = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${query}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error('Translation request failed');
  }

  const payload = await response.json();

  if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
    throw new Error('Translation payload is invalid');
  }

  const translatedValue = payload[0]
    .map((segment) => (Array.isArray(segment) ? segment[0] : ''))
    .join('')
    .trim();

  return translatedValue || value;
}

async function translateText(value, targetLanguage = 'en') {
  if (!value || !String(value).trim()) {
    return value;
  }

  loadStorageCache();

  const normalizedValue = String(value);
  const cacheKey = getCacheKey(targetLanguage, normalizedValue);

  if (runtimeCache.has(cacheKey)) {
    return runtimeCache.get(cacheKey);
  }

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }

  const requestPromise = requestTranslation(normalizedValue, targetLanguage)
    .then((translatedValue) => {
      setCachedTranslation(cacheKey, translatedValue);
      return translatedValue;
    })
    .catch(() => normalizedValue)
    .finally(() => {
      pendingRequests.delete(cacheKey);
    });

  pendingRequests.set(cacheKey, requestPromise);
  return requestPromise;
}

function collectTextNodes(rootNode) {
  const textNodes = [];

  const walk = (node) => {
    node.childNodes.forEach((childNode) => {
      if (childNode.nodeType === Node.TEXT_NODE) {
        if (childNode.nodeValue && childNode.nodeValue.trim()) {
          textNodes.push(childNode);
        }

        return;
      }

      if (childNode.nodeType === Node.ELEMENT_NODE) {
        walk(childNode);
      }
    });
  };

  walk(rootNode);
  return textNodes;
}

async function translateHtml(value, targetLanguage = 'en') {
  if (!value || !String(value).trim()) {
    return value;
  }

  if (typeof DOMParser === 'undefined') {
    return value;
  }

  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(`<div id="auto-translate-root">${value}</div>`, 'text/html');
  const root = parsedDocument.querySelector('#auto-translate-root');

  if (!root) {
    return value;
  }

  const textNodes = collectTextNodes(root);

  if (!textNodes.length) {
    return value;
  }

  const translatedNodes = await Promise.all(
    textNodes.map(async (textNode) => {
      const rawValue = textNode.nodeValue || '';
      const trimmedValue = rawValue.trim();
      const leadingWhitespace = rawValue.match(/^\s*/)?.[0] || '';
      const trailingWhitespace = rawValue.match(/\s*$/)?.[0] || '';
      const translatedValue = await translateText(trimmedValue, targetLanguage);

      return {
        textNode,
        value: `${leadingWhitespace}${translatedValue}${trailingWhitespace}`,
      };
    }),
  );

  translatedNodes.forEach(({ textNode, value: translatedValue }) => {
    textNode.nodeValue = translatedValue;
  });

  return root.innerHTML;
}

export { translateHtml, translateText };

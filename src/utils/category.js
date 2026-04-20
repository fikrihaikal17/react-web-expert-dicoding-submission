function normalizeCategory(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized || 'umum';
}

function getCategoryTone(value) {
  const category = normalizeCategory(value);
  const tones = ['sky', 'mint', 'amber', 'rose'];

  const hash = [...category].reduce((total, char) => total + char.charCodeAt(0), 0);
  return tones[hash % tones.length];
}

export { getCategoryTone, normalizeCategory };

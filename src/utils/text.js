function stripHtmlTags(value) {
  if (!value) {
    return '';
  }

  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncateText(value, maxLength = 140) {
  if (!value || value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}...`;
}

export { stripHtmlTags, truncateText };

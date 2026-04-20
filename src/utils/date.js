import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import 'dayjs/locale/id';

dayjs.extend(relativeTime);
function formatRelativeDate(value, language = 'id') {
  const locale = language === 'en' ? 'en' : 'id';
  return dayjs(value).locale(locale).fromNow();
}

export { formatRelativeDate };

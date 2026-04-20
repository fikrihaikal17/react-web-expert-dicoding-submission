import { BiCommentDetail, BiTime } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { useAutoTranslateText } from '../hooks/useAutoTranslate';
import useI18n from '../hooks/useI18n';
import { getCategoryTone, normalizeCategory } from '../utils/category';
import { formatRelativeDate } from '../utils/date';
import { stripHtmlTags, truncateText } from '../utils/text';
import VoteButtons from './VoteButtons';

function ThreadItem({
  authUserId,
  onDownVote,
  onUpVote,
  owner,
  thread,
}) {
  const { language, t } = useI18n();
  const cleanBody = stripHtmlTags(thread.body);
  const normalizedCategory = normalizeCategory(thread.category);
  const categoryTone = getCategoryTone(thread.category);
  const translatedCategory = useAutoTranslateText(normalizedCategory);
  const translatedTitle = useAutoTranslateText(thread.title);
  const translatedBody = useAutoTranslateText(cleanBody);

  return (
    <article className="thread-item">
      <p className={`thread-item__category thread-item__category--${categoryTone}`}>#{translatedCategory}</p>
      <Link to={`/threads/${thread.id}`} className="thread-item__title-link">
        <h3 className="thread-item__title">{translatedTitle}</h3>
      </Link>
      {translatedBody && <p className="thread-item__body">{truncateText(translatedBody, 180)}</p>}

      <div className="thread-item__meta-row">
        <VoteButtons
          upCount={thread.upVotesBy.length}
          downCount={thread.downVotesBy.length}
          isUpVoted={thread.upVotesBy.includes(authUserId)}
          isDownVoted={thread.downVotesBy.includes(authUserId)}
          onUpVote={onUpVote}
          onDownVote={onDownVote}
        />
        <p className="thread-item__meta">
          <BiCommentDetail />
          <span>{t('thread.commentsCount', { count: thread.totalComments })}</span>
        </p>
        <p className="thread-item__meta">
          <BiTime />
          <span>{formatRelativeDate(thread.createdAt, language)}</span>
        </p>
      </div>

      <div className="thread-item__owner">
        {owner?.avatar ? (
          <img className="avatar avatar--small" src={owner.avatar} alt={owner.name} />
        ) : (
          <div className="avatar avatar--small avatar--fallback">
            {owner?.name?.slice(0, 2).toUpperCase() || '??'}
          </div>
        )}
        <p>
          {t('thread.createdBy', { name: owner?.name || t('thread.unknownUser') })}
        </p>
      </div>
    </article>
  );
}

export default ThreadItem;

import { BiTime } from 'react-icons/bi';
import { useAutoTranslateHtml } from '../hooks/useAutoTranslate';
import useI18n from '../hooks/useI18n';
import { formatRelativeDate } from '../utils/date';
import VoteButtons from './VoteButtons';

function CommentItem({
  authUserId,
  comment,
  onDownVote,
  onUpVote,
}) {
  const { language } = useI18n();
  const translatedCommentContent = useAutoTranslateHtml(comment.content);

  return (
    <article className="comment-item">
      <div className="comment-item__header">
        <div className="comment-item__owner">
          {comment.owner.avatar ? (
            <img className="avatar avatar--small" src={comment.owner.avatar} alt={comment.owner.name} />
          ) : (
            <div className="avatar avatar--small avatar--fallback">
              {comment.owner.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <p className="comment-item__name">{comment.owner.name}</p>
        </div>
        <p className="comment-item__time">
          <BiTime />
          <span>{formatRelativeDate(comment.createdAt, language)}</span>
        </p>
      </div>

      <div
        className="comment-item__content"
        dangerouslySetInnerHTML={{ __html: translatedCommentContent }}
      />

      <VoteButtons
        upCount={comment.upVotesBy.length}
        downCount={comment.downVotesBy.length}
        isUpVoted={comment.upVotesBy.includes(authUserId)}
        isDownVoted={comment.downVotesBy.includes(authUserId)}
        onUpVote={onUpVote}
        onDownVote={onDownVote}
      />
    </article>
  );
}

export default CommentItem;

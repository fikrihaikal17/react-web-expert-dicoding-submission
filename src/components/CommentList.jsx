import CommentItem from './CommentItem';
import useI18n from '../hooks/useI18n';

function CommentList({ authUserId, comments, onDownVoteComment, onUpVoteComment }) {
  const { t } = useI18n();

  if (!comments.length) {
    return <p className="empty-state">{t('thread.noComment')}</p>;
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          authUserId={authUserId}
          onUpVote={() => onUpVoteComment(comment.id)}
          onDownVote={() => onDownVoteComment(comment.id)}
        />
      ))}
    </div>
  );
}

export default CommentList;

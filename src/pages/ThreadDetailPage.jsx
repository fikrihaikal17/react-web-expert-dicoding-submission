import { useEffect, useState } from 'react';
import { BiTime } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AuthGuardMessage from '../components/AuthGuardMessage';
import CommentList from '../components/CommentList';
import VoteButtons from '../components/VoteButtons';
import { useAutoTranslateHtml, useAutoTranslateText } from '../hooks/useAutoTranslate';
import useInput from '../hooks/useInput';
import useI18n from '../hooks/useI18n';
import {
  asyncClearThreadDetail,
  asyncCreateComment,
  asyncReceiveThreadDetail,
  asyncToggleCommentVote,
  asyncToggleThreadVote,
} from '../states/thunks';
import { getCategoryTone, normalizeCategory } from '../utils/category';
import { formatRelativeDate } from '../utils/date';

function ThreadDetailPage() {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.authUser);
  const threadDetail = useSelector((state) => state.threadDetail);
  const [comment, onCommentChange, setComment] = useInput('');
  const [isSendingComment, setIsSendingComment] = useState(false);
  const { language, t } = useI18n();
  const normalizedCategory = normalizeCategory(threadDetail?.category);
  const categoryTone = getCategoryTone(threadDetail?.category);
  const translatedCategory = useAutoTranslateText(threadDetail ? normalizedCategory : '');
  const translatedTitle = useAutoTranslateText(threadDetail?.title || '');
  const translatedBody = useAutoTranslateHtml(threadDetail?.body || '');

  useEffect(() => {
    dispatch(asyncReceiveThreadDetail(threadId));

    return () => {
      dispatch(asyncClearThreadDetail());
    };
  }, [dispatch, threadId]);

  useEffect(() => {
    document.title = t('thread.detailTitle');
  }, [t]);

  if (!threadDetail) {
    return (
      <section className="page-section">
        <section className="section-block">
          <p className="empty-state">{t('thread.loadingDetail')}</p>
        </section>
      </section>
    );
  }

  function onUpVoteThread() {
    dispatch(asyncToggleThreadVote({ threadId, targetVote: 'up' }));
  }

  function onDownVoteThread() {
    dispatch(asyncToggleThreadVote({ threadId, targetVote: 'down' }));
  }

  function onUpVoteComment(commentId) {
    dispatch(asyncToggleCommentVote({ threadId, commentId, targetVote: 'up' }));
  }

  function onDownVoteComment(commentId) {
    dispatch(asyncToggleCommentVote({ threadId, commentId, targetVote: 'down' }));
  }

  async function onSubmitComment(event) {
    event.preventDefault();

    if (isSendingComment) {
      return;
    }

    setIsSendingComment(true);

    try {
      const success = await dispatch(asyncCreateComment({
        threadId,
        content: comment,
      }));

      if (success) {
        setComment('');
      }
    } finally {
      setIsSendingComment(false);
    }
  }

  return (
    <section className="page-section">
      <article className="section-block thread-detail">
        <p className={`thread-item__category thread-item__category--${categoryTone}`}>
          #{translatedCategory}
        </p>
        <h2 className="section-title">{translatedTitle}</h2>

        <div className="thread-detail__owner">
          <img className="avatar" src={threadDetail.owner.avatar} alt={threadDetail.owner.name} />
          <div>
            <p className="thread-detail__owner-name">{threadDetail.owner.name}</p>
            <p className="thread-item__meta">
              <BiTime />
              <span>{formatRelativeDate(threadDetail.createdAt, language)}</span>
            </p>
          </div>
        </div>

        <div
          className="thread-detail__body"
          dangerouslySetInnerHTML={{ __html: translatedBody }}
        />

        <VoteButtons
          upCount={threadDetail.upVotesBy.length}
          downCount={threadDetail.downVotesBy.length}
          isUpVoted={threadDetail.upVotesBy.includes(authUser?.id)}
          isDownVoted={threadDetail.downVotesBy.includes(authUser?.id)}
          onUpVote={onUpVoteThread}
          onDownVote={onDownVoteThread}
        />
      </article>

      <section className="section-block">
        <h3 className="section-title section-title--small">{t('thread.giveComment')}</h3>

        {!authUser && (
          <AuthGuardMessage message={t('notify.mustLoginCreateComment')} />
        )}

        <form className="form-stack" onSubmit={onSubmitComment}>
          <textarea
            placeholder={t('thread.commentPlaceholder')}
            rows={4}
            value={comment}
            onChange={onCommentChange}
            disabled={!authUser || isSendingComment}
            required
          />
          <button
            type="submit"
            className={`button button--primary ${isSendingComment ? 'button--sending' : ''}`}
            disabled={!authUser || isSendingComment}
            aria-busy={isSendingComment}
          >
            {isSendingComment ? t('thread.sendingComment') : t('thread.sendComment')}
          </button>

          {isSendingComment && (
            <div className="comment-submit-status" role="status" aria-live="polite">
              <span>{t('thread.sendingHint')}</span>
              <span className="comment-submit-status__dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </div>
          )}
        </form>
      </section>

      <section className="section-block">
        <h3 className="section-title section-title--small">
          {t('thread.commentsTitle', { count: threadDetail.comments.length })}
        </h3>

        <CommentList
          comments={threadDetail.comments}
          authUserId={authUser?.id}
          onUpVoteComment={onUpVoteComment}
          onDownVoteComment={onDownVoteComment}
        />
      </section>
    </section>
  );
}

export default ThreadDetailPage;

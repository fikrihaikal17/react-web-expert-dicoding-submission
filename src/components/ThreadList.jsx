import ThreadItem from './ThreadItem';
import useI18n from '../hooks/useI18n';

function ThreadList({
  authUserId,
  threads,
  threadOwnerMap,
  onDownVoteThread,
  onUpVoteThread,
}) {
  const { t } = useI18n();

  if (!threads.length) {
    return (
      <p className="empty-state">
        {t('home.emptyThread')}
      </p>
    );
  }

  return (
    <div className="thread-list">
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          thread={thread}
          owner={threadOwnerMap[thread.ownerId]}
          authUserId={authUserId}
          onUpVote={() => onUpVoteThread(thread.id)}
          onDownVote={() => onDownVoteThread(thread.id)}
        />
      ))}
    </div>
  );
}

export default ThreadList;

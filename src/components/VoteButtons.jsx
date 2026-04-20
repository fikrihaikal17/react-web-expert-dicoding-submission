import { BiDislike, BiLike } from 'react-icons/bi';
import useI18n from '../hooks/useI18n';

function VoteButtons({
  downCount,
  isDownVoted,
  isUpVoted,
  onDownVote,
  onUpVote,
  upCount,
}) {
  const { t } = useI18n();

  return (
    <div className="vote-buttons">
      <button
        type="button"
        className={`vote-button ${isUpVoted ? 'vote-button--active-up' : ''}`}
        onClick={onUpVote}
        aria-label={t('vote.up')}
      >
        <BiLike />
        <span>{upCount}</span>
      </button>
      <button
        type="button"
        className={`vote-button ${isDownVoted ? 'vote-button--active-down' : ''}`}
        onClick={onDownVote}
        aria-label={t('vote.down')}
      >
        <BiDislike />
        <span>{downCount}</span>
      </button>
    </div>
  );
}

export default VoteButtons;

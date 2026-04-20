import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useI18n from '../hooks/useI18n';
import { asyncPopulateLeaderboards } from '../states/thunks';

function LeaderboardsPage() {
  const dispatch = useDispatch();
  const leaderboards = useSelector((state) => state.leaderboards);
  const threads = useSelector((state) => state.threads);
  const users = useSelector((state) => state.users);
  const { t } = useI18n();

  const preparedLeaderboards = useMemo(() => {
    const userMap = new Map(users.map((user) => [user.id, user]));
    const groupedByUserId = new Map();

    leaderboards.forEach((item) => {
      const userId = item.user?.id;

      if (!userId) {
        return;
      }

      const existing = groupedByUserId.get(userId);

      if (!existing) {
        groupedByUserId.set(userId, {
          user: {
            ...item.user,
            ...(userMap.get(userId) || {}),
          },
          score: item.score,
        });
        return;
      }

      groupedByUserId.set(userId, {
        user: {
          ...existing.user,
          ...item.user,
          ...(userMap.get(userId) || {}),
        },
        score: existing.score + item.score,
      });
    });

    const creatorIds = new Set(threads.map((thread) => thread.ownerId).filter(Boolean));

    creatorIds.forEach((ownerId) => {
      if (groupedByUserId.has(ownerId)) {
        return;
      }

      const creatorProfile = userMap.get(ownerId);

      if (!creatorProfile) {
        return;
      }

      groupedByUserId.set(ownerId, {
        user: creatorProfile,
        score: 0,
      });
    });

    return [...groupedByUserId.values()].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.user.name.localeCompare(b.user.name);
    });
  }, [leaderboards, threads, users]);

  useEffect(() => {
    document.title = t('leaderboard.titlePage');
    dispatch(asyncPopulateLeaderboards());
  }, [dispatch, t]);

  function onRefreshLeaderboards() {
    dispatch(asyncPopulateLeaderboards());
  }

  return (
    <section className="page-section">
      <section className="section-block">
        <div className="section-title-row">
          <h2 className="section-title">{t('leaderboard.title')}</h2>
          <button type="button" className="button button--primary" onClick={onRefreshLeaderboards}>
            {t('common.reload')}
          </button>
        </div>

        <div className="leaderboard-head">
          <p>{t('leaderboard.user')}</p>
          <p>{t('leaderboard.score')}</p>
        </div>

        <div className="leaderboard-list">
          {!preparedLeaderboards.length && (
            <p className="empty-state">{t('leaderboard.empty')}</p>
          )}

          {preparedLeaderboards.map((item) => (
            <article key={item.user.id} className="leaderboard-item">
              <div className="leaderboard-item__user">
                {item.user.avatar ? (
                  <img className="avatar" src={item.user.avatar} alt={item.user.name} />
                ) : (
                  <div className="avatar avatar--fallback">
                    {item.user.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <p>{item.user.name}</p>
              </div>
              <p className="leaderboard-item__score">{item.score}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default LeaderboardsPage;

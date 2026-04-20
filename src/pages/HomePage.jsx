import { useEffect, useMemo } from 'react';
import { BiMessageSquareAdd } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter';
import useI18n from '../hooks/useI18n';
import ThreadList from '../components/ThreadList';
import { setActiveCategory } from '../states/categoriesSlice';
import { asyncToggleThreadVote } from '../states/thunks';
import { normalizeCategory } from '../utils/category';

function HomePage() {
  const dispatch = useDispatch();
  const threads = useSelector((state) => state.threads);
  const users = useSelector((state) => state.users);
  const authUser = useSelector((state) => state.authUser);
  const activeCategory = useSelector((state) => state.categories);
  const { t } = useI18n();

  const threadOwnerMap = useMemo(() => Object.fromEntries(
    users.map((user) => [user.id, user]),
  ), [users]);

  const categories = useMemo(() => [
    ...new Set(threads.map((thread) => normalizeCategory(thread.category))),
  ], [threads]);

  const visibleThreads = useMemo(() => {
    if (activeCategory === 'all') {
      return threads;
    }

    return threads.filter(
      (thread) => normalizeCategory(thread.category) === activeCategory,
    );
  }, [activeCategory, threads]);

  useEffect(() => {
    document.title = t('home.title');
  }, [t]);

  function onChangeCategory(category) {
    dispatch(setActiveCategory(category));
  }

  function onUpVoteThread(threadId) {
    dispatch(asyncToggleThreadVote({ threadId, targetVote: 'up' }));
  }

  function onDownVoteThread(threadId) {
    dispatch(asyncToggleThreadVote({ threadId, targetVote: 'down' }));
  }

  return (
    <section className="page-section">
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onChangeCategory={onChangeCategory}
      />

      <section className="section-block">
        <div className="section-title-row">
          <h2 className="section-title">{t('home.availableDiscussions')}</h2>
          {authUser && (
            <Link to="/threads/new" className="primary-action-link">
              <BiMessageSquareAdd />
              <span>{t('home.createThread')}</span>
            </Link>
          )}
        </div>

        <ThreadList
          threads={visibleThreads}
          threadOwnerMap={threadOwnerMap}
          authUserId={authUser?.id}
          onUpVoteThread={onUpVoteThread}
          onDownVoteThread={onDownVoteThread}
        />
      </section>
    </section>
  );
}

export default HomePage;

import { useEffect, useMemo, useState } from 'react';
import { BiCommentDots, BiCog, BiMessageSquareDetail } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { useAutoTranslateText } from '../hooks/useAutoTranslate';
import useI18n from '../hooks/useI18n';
import { setLanguage, setTheme } from '../states/preferencesSlice';
import { normalizeCategory } from '../utils/category';
import { formatRelativeDate } from '../utils/date';
import { stripHtmlTags, truncateText } from '../utils/text';

const TAB_SETTINGS = 'settings';
const TAB_THREADS = 'threads';
const TAB_REPLIES = 'replies';

function ProfileThreadHistoryItem({ language, thread, t }) {
  const translatedTitle = useAutoTranslateText(thread.title);
  const translatedCategory = useAutoTranslateText(normalizeCategory(thread.category));

  return (
    <article key={thread.id} className="history-item">
      <div>
        <p className="history-item__title">{translatedTitle}</p>
        <p className="history-item__meta">{t('profile.atCategory', { category: translatedCategory })}</p>
        <p className="history-item__meta">{formatRelativeDate(thread.createdAt, language)}</p>
      </div>
      <Link className="history-item__link" to={`/threads/${thread.id}`}>{t('profile.viewThread')}</Link>
    </article>
  );
}

function ProfileReplyHistoryItem({ comment, language, t }) {
  const translatedComment = useAutoTranslateText(truncateText(stripHtmlTags(comment.content), 170));
  const translatedThreadTitle = useAutoTranslateText(comment.threadTitle);

  return (
    <article key={comment.id} className="history-item history-item--stacked">
      <p className="history-item__title">{translatedComment}</p>
      <p className="history-item__meta">{t('profile.postedInThread', { title: translatedThreadTitle })}</p>
      <p className="history-item__meta">{formatRelativeDate(comment.createdAt, language)}</p>
      <Link className="history-item__link" to={`/threads/${comment.threadId}`}>{t('profile.viewThread')}</Link>
    </article>
  );
}

function ProfilePage() {
  const [activeTab, setActiveTab] = useState(TAB_SETTINGS);
  const authUser = useSelector((state) => state.authUser);
  const threads = useSelector((state) => state.threads);
  const threadActivities = useSelector((state) => state.activities.threads);
  const commentsHistory = useSelector((state) => state.activities.comments);
  const { theme, language } = useSelector((state) => state.preferences);
  const dispatch = useDispatch();
  const { t } = useI18n();

  const threadHistory = useMemo(() => {
    const fromApi = threads.filter((thread) => thread.ownerId === authUser?.id);

    const merged = new Map();

    [...threadActivities, ...fromApi].forEach((thread) => {
      merged.set(thread.id, thread);
    });

    return [...merged.values()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [authUser?.id, threadActivities, threads]);

  useEffect(() => {
    document.title = t('profile.titlePage');
  }, [t]);

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  function onChangeTheme(event) {
    dispatch(setTheme(event.target.value));
  }

  function onChangeLanguage(event) {
    dispatch(setLanguage(event.target.value));
  }

  function renderSettings() {
    return (
      <div className="profile-panel">
        <h3 className="section-title section-title--small">{t('profile.accountInfo')}</h3>

        <div className="profile-info-grid">
          <p className="profile-info-label">{t('profile.accountName')}</p>
          <p>{authUser.name}</p>
          <p className="profile-info-label">{t('profile.accountEmail')}</p>
          <p>{authUser.email || t('profile.unknownEmail')}</p>
        </div>

        <div className="profile-settings-grid">
          <label htmlFor="themeSelect">{t('profile.displayTheme')}</label>
          <select id="themeSelect" value={theme} onChange={onChangeTheme}>
            <option value="light">{t('theme.light')}</option>
            <option value="dark">{t('theme.dark')}</option>
          </select>

          <label htmlFor="languageSelect">{t('profile.displayLanguage')}</label>
          <select id="languageSelect" value={language} onChange={onChangeLanguage}>
            <option value="id">{t('language.id')}</option>
            <option value="en">{t('language.en')}</option>
          </select>
        </div>
      </div>
    );
  }

  function renderThreadHistory() {
    if (!threadHistory.length) {
      return <p className="empty-state">{t('profile.emptyThreads')}</p>;
    }

    return (
      <div className="history-list">
        {threadHistory.map((thread) => (
          <ProfileThreadHistoryItem
            key={thread.id}
            thread={thread}
            language={language}
            t={t}
          />
        ))}
      </div>
    );
  }

  function renderReplyHistory() {
    if (!commentsHistory.length) {
      return <p className="empty-state">{t('profile.emptyReplies')}</p>;
    }

    return (
      <div className="history-list">
        {commentsHistory.map((comment) => (
          <ProfileReplyHistoryItem
            key={comment.id}
            comment={comment}
            language={language}
            t={t}
          />
        ))}
      </div>
    );
  }

  return (
    <section className="page-section">
      <section className="section-block">
        <h2 className="section-title">{t('profile.title')}</h2>
        <p className="profile-subtitle">{t('profile.subtitle')}</p>

        <div className="profile-tabs" role="tablist" aria-label={t('common.profile')}>
          <button
            type="button"
            role="tab"
            className={`profile-tab ${activeTab === TAB_SETTINGS ? 'profile-tab--active' : ''}`}
            onClick={() => setActiveTab(TAB_SETTINGS)}
          >
            <BiCog />
            <span>{t('profile.tabSettings')}</span>
          </button>
          <button
            type="button"
            role="tab"
            className={`profile-tab ${activeTab === TAB_THREADS ? 'profile-tab--active' : ''}`}
            onClick={() => setActiveTab(TAB_THREADS)}
          >
            <BiMessageSquareDetail />
            <span>{t('profile.tabThreads')}</span>
          </button>
          <button
            type="button"
            role="tab"
            className={`profile-tab ${activeTab === TAB_REPLIES ? 'profile-tab--active' : ''}`}
            onClick={() => setActiveTab(TAB_REPLIES)}
          >
            <BiCommentDots />
            <span>{t('profile.tabReplies')}</span>
          </button>
        </div>
      </section>

      <section className="section-block">
        {activeTab === TAB_SETTINGS && renderSettings()}
        {activeTab === TAB_THREADS && (
          <>
            <h3 className="section-title section-title--small">{t('profile.yourThreads')}</h3>
            {renderThreadHistory()}
          </>
        )}
        {activeTab === TAB_REPLIES && (
          <>
            <h3 className="section-title section-title--small">{t('profile.yourReplies')}</h3>
            {renderReplyHistory()}
          </>
        )}
      </section>
    </section>
  );
}

export default ProfilePage;

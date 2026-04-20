import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import LoadingBar from './components/LoadingBar';
import HomePage from './pages/HomePage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import LoginPage from './pages/LoginPage';
import NewThreadPage from './pages/NewThreadPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import useI18n from './hooks/useI18n';
import { asyncPreloadProcess } from './states/thunks';

function App() {
  const dispatch = useDispatch();
  const preload = useSelector((state) => state.preload);
  const { theme, language } = useSelector((state) => state.preferences);
  const { t } = useI18n();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language]);

  if (preload) {
    return (
      <div className="preload-screen" role="status" aria-label={t('common.loadingApp')}>
        <div className="preload-screen__orbital" aria-hidden="true">
          <span className="preload-screen__ring preload-screen__ring--outer" />
          <span className="preload-screen__ring preload-screen__ring--inner" />
          <span className="preload-screen__core" />
        </div>
        <h1 className="preload-screen__title">{t('common.appName')}</h1>
        <p className="preload-screen__subtitle">{t('common.preparingForum')}</p>
        <div className="preload-screen__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="preload-screen__progress" aria-hidden="true">
          <div className="preload-screen__progress-inner" />
        </div>
      </div>
    );
  }

  return (
    <>
      <LoadingBar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="threads/new" element={<NewThreadPage />} />
            <Route path="threads/:threadId" element={<ThreadDetailPage />} />
            <Route path="leaderboards" element={<LeaderboardsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

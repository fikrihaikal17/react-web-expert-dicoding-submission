import { useEffect, useRef } from 'react';
import {
  BiBarChartAlt2,
  BiLogInCircle,
  BiLogOutCircle,
  BiMessageSquareDetail,
  BiMoon,
  BiSun,
  BiUserCircle,
} from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { asyncLogoutUser } from '../states/thunks';
import useI18n from '../hooks/useI18n';
import { hideLoading, showLoading } from '../states/loadingSlice';
import { setLanguage, setTheme } from '../states/preferencesSlice';
import { notifyConfirm } from '../utils/notify';

function navItemClassName({ isActive }) {
  return isActive ? 'bottom-nav__item active' : 'bottom-nav__item';
}

function AppLayout() {
  const authUser = useSelector((state) => state.authUser);
  const { language, theme } = useSelector((state) => state.preferences);
  const { t } = useI18n();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  async function onLogout() {
    const result = await notifyConfirm({
      title: t('notify.logoutConfirmTitle'),
      message: t('notify.logoutConfirmMessage'),
      confirmText: t('notify.logoutConfirmYes'),
      cancelText: t('notify.logoutConfirmNo'),
    });

    if (!result.isConfirmed) {
      return;
    }

    dispatch(asyncLogoutUser());
    navigate('/');
  }

  function onToggleTheme() {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  }

  function onChangeLanguage(nextLanguage) {
    dispatch(setLanguage(nextLanguage));
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    dispatch(showLoading());

    const timeoutId = setTimeout(() => {
      dispatch(hideLoading());
    }, 320);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, location.pathname, location.search, location.hash]);

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="app-container top-bar__inner">
          <h1 className="top-bar__title">{t('common.appName')}</h1>
          <div className="top-bar__actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={onToggleTheme}
              aria-label={t('theme.toggleLabel')}
              title={t('theme.toggleLabel')}
            >
              {theme === 'dark' ? <BiSun /> : <BiMoon />}
              <span>{theme === 'dark' ? t('theme.light') : t('theme.dark')}</span>
            </button>

            <div className="language-toggle" role="group" aria-label={t('language.toggleLabel')}>
              <button
                type="button"
                className={`language-toggle__button ${language === 'id' ? 'language-toggle__button--active' : ''}`}
                onClick={() => onChangeLanguage('id')}
                title={t('language.id')}
              >
                ID
              </button>
              <button
                type="button"
                className={`language-toggle__button ${language === 'en' ? 'language-toggle__button--active' : ''}`}
                onClick={() => onChangeLanguage('en')}
                title={t('language.en')}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="app-container content-wrapper">
        <Outlet />
      </main>

      <nav className="bottom-nav" aria-label={t('common.mainNavigation')}>
        <div className={`app-container bottom-nav__inner ${authUser ? 'bottom-nav__inner--with-profile' : ''}`}>
          <NavLink to="/" className={navItemClassName}>
            <BiMessageSquareDetail />
            <span>{t('common.threads')}</span>
          </NavLink>
          <NavLink to="/leaderboards" className={navItemClassName}>
            <BiBarChartAlt2 />
            <span>{t('common.leaderboards')}</span>
          </NavLink>
          {authUser ? (
            <>
              <NavLink to="/profile" className={navItemClassName}>
                <BiUserCircle />
                <span>{t('common.profile')}</span>
              </NavLink>
              <button type="button" className="bottom-nav__item bottom-nav__button" onClick={onLogout}>
                <BiLogOutCircle />
                <span>{t('common.logout')}</span>
              </button>
            </>
          ) : (
            <NavLink to="/login" className={navItemClassName}>
              <BiLogInCircle />
              <span>{t('common.login')}</span>
            </NavLink>
          )}
        </div>
      </nav>
    </div>
  );
}

export default AppLayout;

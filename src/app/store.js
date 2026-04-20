import { configureStore } from '@reduxjs/toolkit';
import activitiesReducer from '../states/activitiesSlice';
import authUserReducer from '../states/authUserSlice';
import categoriesReducer from '../states/categoriesSlice';
import leaderboardsReducer from '../states/leaderboardsSlice';
import loadingReducer from '../states/loadingSlice';
import preferencesReducer from '../states/preferencesSlice';
import preloadReducer from '../states/preloadSlice';
import threadDetailReducer from '../states/threadDetailSlice';
import threadsReducer from '../states/threadsSlice';
import usersReducer from '../states/usersSlice';

const store = configureStore({
  reducer: {
    activities: activitiesReducer,
    authUser: authUserReducer,
    categories: categoriesReducer,
    leaderboards: leaderboardsReducer,
    loading: loadingReducer,
    preferences: preferencesReducer,
    preload: preloadReducer,
    threadDetail: threadDetailReducer,
    threads: threadsReducer,
    users: usersReducer,
  },
});

export default store;

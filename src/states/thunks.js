import {
  createComment,
  createThread,
  downVoteComment,
  downVoteThread,
  getAccessToken,
  getAllThreads,
  getAllUsers,
  getLeaderboards,
  getOwnProfile,
  getThreadDetail,
  login,
  neutralVoteComment,
  neutralVoteThread,
  putAccessToken,
  register,
  removeAccessToken,
  upVoteComment,
  upVoteThread,
} from '../api/forumApi';
import { getText } from '../i18n';
import {
  addCommentActivity,
  addThreadActivity,
  clearActivities,
  mergeCommentActivities,
} from './activitiesSlice';
import { setAuthUser, unsetAuthUser } from './authUserSlice';
import { setActiveCategory } from './categoriesSlice';
import { hideLoading, showLoading } from './loadingSlice';
import { setLeaderboards } from './leaderboardsSlice';
import { setPreload } from './preloadSlice';
import {
  addThread,
  applyThreadVote,
  increaseThreadCommentCount,
  setThreads,
} from './threadsSlice';
import {
  addCommentToDetail,
  applyCommentVoteInDetail,
  applyThreadVoteInDetail,
  clearThreadDetail,
  setThreadDetail,
} from './threadDetailSlice';
import { setUsers } from './usersSlice';
import { notifyError, notifySuccess, notifyWarning } from '../utils/notify';

function createThreadActivity(thread, ownerName) {
  return {
    id: thread.id,
    title: thread.title,
    category: thread.category,
    createdAt: thread.createdAt,
    ownerName,
  };
}

function createCommentActivity(comment, threadId, threadTitle) {
  return {
    id: comment.id,
    threadId,
    threadTitle,
    content: comment.content,
    createdAt: comment.createdAt,
  };
}

function getThreadTitleById(state, threadId) {
  const foundThread = state.threads.find((thread) => thread.id === threadId);

  if (foundThread) {
    return foundThread.title;
  }

  if (state.threadDetail?.id === threadId) {
    return state.threadDetail.title;
  }

  return 'Thread';
}

function resolveLanguage(getState) {
  return getState().preferences.language;
}

function getCurrentVote(entity, userId) {
  if (!entity || !userId) {
    return 'neutral';
  }

  if (entity.upVotesBy.includes(userId)) {
    return 'up';
  }

  if (entity.downVotesBy.includes(userId)) {
    return 'down';
  }

  return 'neutral';
}

function getNextVote(currentVote, targetVote) {
  return currentVote === targetVote ? 'neutral' : targetVote;
}

function runThreadVoteRequest(threadId, voteType) {
  if (voteType === 'up') {
    return upVoteThread(threadId);
  }

  if (voteType === 'down') {
    return downVoteThread(threadId);
  }

  return neutralVoteThread(threadId);
}

function runCommentVoteRequest({ threadId, commentId, voteType }) {
  if (voteType === 'up') {
    return upVoteComment({ threadId, commentId });
  }

  if (voteType === 'down') {
    return downVoteComment({ threadId, commentId });
  }

  return neutralVoteComment({ threadId, commentId });
}

function asyncPreloadProcess() {
  return async (dispatch, getState) => {
    dispatch(showLoading());

    try {
      const token = getAccessToken();

      if (token) {
        dispatch(clearActivities());
        const authUser = await getOwnProfile();
        dispatch(setAuthUser(authUser));
      }

      const [users, threads, leaderboards] = await Promise.all([
        getAllUsers(),
        getAllThreads(),
        getLeaderboards(),
      ]);

      dispatch(setUsers(users));
      dispatch(setThreads(threads));
      dispatch(setLeaderboards(leaderboards));
    } catch (error) {
      const language = resolveLanguage(getState);
      removeAccessToken();
      dispatch(unsetAuthUser());
      notifyError(error.message, getText(language, 'notify.errorTitle'));
    } finally {
      dispatch(setPreload(false));
      dispatch(hideLoading());
    }
  };
}

function asyncRegisterUser({ name, email, password }) {
  return async (dispatch, getState) => {
    dispatch(showLoading());

    try {
      const language = resolveLanguage(getState);
      await register({ name, email, password });
      notifySuccess(
        getText(language, 'notify.registerSuccess'),
        getText(language, 'notify.successTitle'),
      );
      return true;
    } catch (error) {
      const language = resolveLanguage(getState);
      notifyError(error.message, getText(language, 'notify.errorTitle'));
      return false;
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncLoginUser({ email, password }) {
  return async (dispatch, getState) => {
    dispatch(showLoading());

    try {
      const language = resolveLanguage(getState);
      const token = await login({ email, password });
      putAccessToken(token);
      dispatch(clearActivities());

      const authUser = await getOwnProfile();
      dispatch(setAuthUser(authUser));
      notifySuccess(
        getText(language, 'notify.welcome', { name: authUser.name }),
        getText(language, 'notify.successTitle'),
      );
      return true;
    } catch (error) {
      const language = resolveLanguage(getState);
      notifyError(error.message, getText(language, 'notify.errorTitle'));
      return false;
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncLogoutUser() {
  return (dispatch) => {
    removeAccessToken();
    dispatch(unsetAuthUser());
    dispatch(setActiveCategory('all'));
    dispatch(clearActivities());
  };
}

function asyncCreateThread({ title, body, category }) {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    const language = resolveLanguage(getState);

    if (!authUser) {
      notifyWarning(
        getText(language, 'notify.mustLoginCreateThread'),
        getText(language, 'notify.accessDenied'),
      );
      return false;
    }

    dispatch(showLoading());

    try {
      const thread = await createThread({ title, body, category });

      dispatch(addThread(thread));

      dispatch(addThreadActivity(createThreadActivity(
        thread,
        authUser.name,
      )));

      return true;
    } catch (error) {
      notifyError(error.message, getText(language, 'notify.errorTitle'));
      return false;
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncReceiveThreadDetail(threadId) {
  return async (dispatch, getState) => {
    const authUser = getState().authUser;
    dispatch(showLoading());

    try {
      const detailThread = await getThreadDetail(threadId);
      dispatch(setThreadDetail(detailThread));

      if (authUser) {
        const ownedComments = detailThread.comments
          .filter((comment) => comment.owner.id === authUser.id)
          .map((comment) => createCommentActivity(comment, threadId, detailThread.title));

        if (ownedComments.length) {
          dispatch(mergeCommentActivities(ownedComments));
        }
      }
    } catch (error) {
      const language = resolveLanguage(getState);
      notifyError(error.message, getText(language, 'notify.errorTitle'));
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncClearThreadDetail() {
  return (dispatch) => {
    dispatch(clearThreadDetail());
  };
}

function asyncCreateComment({ threadId, content }) {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    const language = resolveLanguage(getState);

    if (!authUser) {
      notifyWarning(
        getText(language, 'notify.mustLoginCreateComment'),
        getText(language, 'notify.accessDenied'),
      );
      return false;
    }

    dispatch(showLoading());

    try {
      const comment = await createComment({ threadId, content });
      dispatch(addCommentToDetail(comment));
      dispatch(increaseThreadCommentCount(threadId));
      dispatch(addCommentActivity(createCommentActivity(
        comment,
        threadId,
        getThreadTitleById(getState(), threadId),
      )));
      return true;
    } catch (error) {
      notifyError(error.message, getText(language, 'notify.errorTitle'));
      return false;
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncToggleThreadVote({ threadId, targetVote }) {
  return async (dispatch, getState) => {
    const { authUser, threads, threadDetail } = getState();
    const language = resolveLanguage(getState);

    if (!authUser) {
      notifyWarning(
        getText(language, 'notify.mustLoginVote'),
        getText(language, 'notify.accessDenied'),
      );
      return;
    }

    const thread = threads.find((item) => item.id === threadId) ||
      (threadDetail && threadDetail.id === threadId ? threadDetail : null);

    const previousVote = getCurrentVote(thread, authUser.id);
    const nextVote = getNextVote(previousVote, targetVote);

    dispatch(applyThreadVote({ threadId, userId: authUser.id, voteType: nextVote }));
    dispatch(applyThreadVoteInDetail({ threadId, userId: authUser.id, voteType: nextVote }));

    try {
      await runThreadVoteRequest(threadId, nextVote);
    } catch (error) {
      dispatch(applyThreadVote({ threadId, userId: authUser.id, voteType: previousVote }));
      dispatch(applyThreadVoteInDetail({ threadId, userId: authUser.id, voteType: previousVote }));
      notifyError(error.message, getText(language, 'notify.errorTitle'));
    }
  };
}

function asyncToggleCommentVote({ threadId, commentId, targetVote }) {
  return async (dispatch, getState) => {
    const { authUser, threadDetail } = getState();
    const language = resolveLanguage(getState);

    if (!authUser) {
      notifyWarning(
        getText(language, 'notify.mustLoginVote'),
        getText(language, 'notify.accessDenied'),
      );
      return;
    }

    if (!threadDetail) {
      return;
    }

    const comment = threadDetail.comments.find((item) => item.id === commentId);
    const previousVote = getCurrentVote(comment, authUser.id);
    const nextVote = getNextVote(previousVote, targetVote);

    dispatch(applyCommentVoteInDetail({
      commentId,
      userId: authUser.id,
      voteType: nextVote,
    }));

    try {
      await runCommentVoteRequest({ threadId, commentId, voteType: nextVote });
    } catch (error) {
      dispatch(applyCommentVoteInDetail({
        commentId,
        userId: authUser.id,
        voteType: previousVote,
      }));
      notifyError(error.message, getText(language, 'notify.errorTitle'));
    }
  };
}

function asyncPopulateLeaderboards() {
  return async (dispatch, getState) => {
    dispatch(showLoading());

    try {
      const leaderboards = await getLeaderboards();
      dispatch(setLeaderboards(leaderboards));
    } catch (error) {
      const language = resolveLanguage(getState);
      notifyError(error.message, getText(language, 'notify.errorTitle'));
    } finally {
      dispatch(hideLoading());
    }
  };
}

export {
  asyncClearThreadDetail,
  asyncCreateComment,
  asyncCreateThread,
  asyncLoginUser,
  asyncLogoutUser,
  asyncPopulateLeaderboards,
  asyncPreloadProcess,
  asyncReceiveThreadDetail,
  asyncRegisterUser,
  asyncToggleCommentVote,
  asyncToggleThreadVote,
};

import {
  createComment,
  getOwnProfile,
  login,
  putAccessToken,
} from '../../api/forumApi';
import { notifyError, notifySuccess } from '../../utils/notify';
import { asyncCreateComment, asyncLoginUser } from '../thunks';

jest.mock('../../api/forumApi', () => ({
  createComment: jest.fn(),
  createThread: jest.fn(),
  downVoteComment: jest.fn(),
  downVoteThread: jest.fn(),
  getAccessToken: jest.fn(),
  getAllThreads: jest.fn(),
  getAllUsers: jest.fn(),
  getLeaderboards: jest.fn(),
  getOwnProfile: jest.fn(),
  getThreadDetail: jest.fn(),
  login: jest.fn(),
  neutralVoteComment: jest.fn(),
  neutralVoteThread: jest.fn(),
  putAccessToken: jest.fn(),
  register: jest.fn(),
  removeAccessToken: jest.fn(),
  upVoteComment: jest.fn(),
  upVoteThread: jest.fn(),
}));

jest.mock('../../utils/notify', () => ({
  notifyConfirm: jest.fn(),
  notifyError: jest.fn(),
  notifySuccess: jest.fn(),
  notifyWarning: jest.fn(),
}));

/**
 * Skenario test:
 * - should dispatch login flow actions and return true when login success.
 * - should create comment via API, dispatch related actions, and return true.
 */

describe('thunks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle asyncLoginUser success flow', async () => {
    login.mockResolvedValue('token-123');
    getOwnProfile.mockResolvedValue({
      id: 'user-1',
      name: 'User Test',
      email: 'user@test.com',
      avatar: 'https://example.com/avatar.png',
    });

    const dispatch = jest.fn();
    const getState = () => ({
      preferences: {
        language: 'id',
      },
    });

    const result = await asyncLoginUser({
      email: 'user@test.com',
      password: 'secret',
    })(dispatch, getState);

    const dispatchedTypes = dispatch.mock.calls.map(([action]) => action.type);

    expect(result).toBe(true);
    expect(login).toHaveBeenCalledWith({
      email: 'user@test.com',
      password: 'secret',
    });
    expect(putAccessToken).toHaveBeenCalledWith('token-123');
    expect(dispatchedTypes).toEqual(expect.arrayContaining([
      'loading/showLoading',
      'activities/clearActivities',
      'authUser/setAuthUser',
      'loading/hideLoading',
    ]));
    expect(notifySuccess).toHaveBeenCalled();
    expect(notifyError).not.toHaveBeenCalled();
  });

  it('should create comment through API and dispatch comment actions', async () => {
    createComment.mockResolvedValue({
      id: 'comment-1',
      content: 'Komentar baru',
      createdAt: '2026-04-20T10:00:00.000Z',
      owner: {
        id: 'user-1',
        name: 'User Test',
        avatar: 'https://example.com/avatar.png',
      },
      upVotesBy: [],
      downVotesBy: [],
    });

    const dispatch = jest.fn();
    const getState = () => ({
      authUser: {
        id: 'user-1',
      },
      preferences: {
        language: 'id',
      },
      threadDetail: {
        id: 'thread-1',
        title: 'Thread Satu',
      },
      threads: [],
    });

    const result = await asyncCreateComment({
      threadId: 'thread-1',
      content: 'Komentar baru',
    })(dispatch, getState);

    const dispatchedTypes = dispatch.mock.calls.map(([action]) => action.type);

    expect(result).toBe(true);
    expect(createComment).toHaveBeenCalledWith({
      threadId: 'thread-1',
      content: 'Komentar baru',
    });
    expect(dispatchedTypes).toEqual(expect.arrayContaining([
      'loading/showLoading',
      'threadDetail/addCommentToDetail',
      'threads/increaseThreadCommentCount',
      'activities/addCommentActivity',
      'loading/hideLoading',
    ]));
    expect(notifyError).not.toHaveBeenCalled();
  });
});

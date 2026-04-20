import reducer, {
  addCommentToDetail,
  applyCommentVoteInDetail,
} from '../threadDetailSlice';

/**
 * Skenario test:
 * - should append a new comment to thread detail.
 * - should apply down-vote to a specific comment and remove existing up-vote.
 */

describe('threadDetailSlice reducer', () => {
  it('should add comment into thread detail', () => {
    const initialState = {
      id: 'thread-1',
      comments: [
        {
          id: 'comment-1',
          content: 'Komentar pertama',
          upVotesBy: [],
          downVotesBy: [],
        },
      ],
    };

    const nextState = reducer(
      initialState,
      addCommentToDetail({
        id: 'comment-2',
        content: 'Komentar kedua',
        upVotesBy: [],
        downVotesBy: [],
      }),
    );

    expect(nextState.comments).toHaveLength(2);
    expect(nextState.comments[1].id).toBe('comment-2');
  });

  it('should apply down-vote on selected comment', () => {
    const initialState = {
      id: 'thread-1',
      comments: [
        {
          id: 'comment-1',
          content: 'Komentar pertama',
          upVotesBy: ['user-1'],
          downVotesBy: [],
        },
      ],
    };

    const nextState = reducer(
      initialState,
      applyCommentVoteInDetail({
        commentId: 'comment-1',
        userId: 'user-1',
        voteType: 'down',
      }),
    );

    expect(nextState.comments[0].upVotesBy).toEqual([]);
    expect(nextState.comments[0].downVotesBy).toEqual(['user-1']);
  });
});

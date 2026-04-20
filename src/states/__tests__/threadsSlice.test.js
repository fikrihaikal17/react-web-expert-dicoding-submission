import reducer, {
  applyThreadVote,
  increaseThreadCommentCount,
} from '../threadsSlice';

/**
 * Skenario test:
 * - should increment totalComments for matching thread id.
 * - should apply up-vote and neutralize previous vote state for a thread.
 */

describe('threadsSlice reducer', () => {
  it('should increment thread comment count', () => {
    const initialState = [
      {
        id: 'thread-1',
        totalComments: 2,
      },
      {
        id: 'thread-2',
        totalComments: 4,
      },
    ];

    const nextState = reducer(
      initialState,
      increaseThreadCommentCount('thread-1'),
    );

    expect(nextState[0].totalComments).toBe(3);
    expect(nextState[1].totalComments).toBe(4);
  });

  it('should apply up-vote to selected thread and remove opposite vote', () => {
    const initialState = [
      {
        id: 'thread-1',
        upVotesBy: [],
        downVotesBy: ['user-1'],
      },
    ];

    const nextState = reducer(
      initialState,
      applyThreadVote({
        threadId: 'thread-1',
        userId: 'user-1',
        voteType: 'up',
      }),
    );

    expect(nextState[0].upVotesBy).toEqual(['user-1']);
    expect(nextState[0].downVotesBy).toEqual([]);
  });
});

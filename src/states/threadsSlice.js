import { createSlice } from '@reduxjs/toolkit';

function applyVoteState(entity, userId, voteType) {
  const nextEntity = {
    ...entity,
    upVotesBy: entity.upVotesBy.filter((id) => id !== userId),
    downVotesBy: entity.downVotesBy.filter((id) => id !== userId),
  };

  if (voteType === 'up') {
    nextEntity.upVotesBy = [...nextEntity.upVotesBy, userId];
  }

  if (voteType === 'down') {
    nextEntity.downVotesBy = [...nextEntity.downVotesBy, userId];
  }

  return nextEntity;
}

const threadsSlice = createSlice({
  name: 'threads',
  initialState: [],
  reducers: {
    setThreads: (state, action) => action.payload,
    addThread: (state, action) => [action.payload, ...state],
    increaseThreadCommentCount: (state, action) => state.map((thread) => {
      if (thread.id !== action.payload) {
        return thread;
      }

      return {
        ...thread,
        totalComments: (thread.totalComments || 0) + 1,
      };
    }),
    applyThreadVote: (state, action) => {
      const { threadId, userId, voteType } = action.payload;

      return state.map((thread) => {
        if (thread.id !== threadId) {
          return thread;
        }

        return applyVoteState(thread, userId, voteType);
      });
    },
  },
});

export const {
  addThread,
  applyThreadVote,
  increaseThreadCommentCount,
  setThreads,
} = threadsSlice.actions;

export default threadsSlice.reducer;

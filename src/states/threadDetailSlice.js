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

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: null,
  reducers: {
    setThreadDetail: (state, action) => action.payload,
    clearThreadDetail: () => null,
    addCommentToDetail: (state, action) => {
      if (!state) {
        return state;
      }

      return {
        ...state,
        comments: [...state.comments, action.payload],
      };
    },
    applyThreadVoteInDetail: (state, action) => {
      if (!state || state.id !== action.payload.threadId) {
        return state;
      }

      const { userId, voteType } = action.payload;
      return applyVoteState(state, userId, voteType);
    },
    applyCommentVoteInDetail: (state, action) => {
      if (!state) {
        return state;
      }

      const { commentId, userId, voteType } = action.payload;

      return {
        ...state,
        comments: state.comments.map((comment) => {
          if (comment.id !== commentId) {
            return comment;
          }

          return applyVoteState(comment, userId, voteType);
        }),
      };
    },
  },
});

export const {
  addCommentToDetail,
  applyCommentVoteInDetail,
  applyThreadVoteInDetail,
  clearThreadDetail,
  setThreadDetail,
} = threadDetailSlice.actions;

export default threadDetailSlice.reducer;

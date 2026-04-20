import { createSlice } from '@reduxjs/toolkit';

const activitiesSlice = createSlice({
  name: 'activities',
  initialState: {
    threads: [],
    comments: [],
  },
  reducers: {
    addThreadActivity: (state, action) => {
      const nextItem = action.payload;
      const filtered = state.threads.filter((item) => item.id !== nextItem.id);

      return {
        ...state,
        threads: [nextItem, ...filtered],
      };
    },
    addCommentActivity: (state, action) => {
      const nextItem = action.payload;
      const filtered = state.comments.filter((item) => item.id !== nextItem.id);

      return {
        ...state,
        comments: [nextItem, ...filtered],
      };
    },
    mergeCommentActivities: (state, action) => {
      const incoming = action.payload;
      const mergedMap = new Map(state.comments.map((item) => [item.id, item]));

      incoming.forEach((item) => {
        mergedMap.set(item.id, item);
      });

      return {
        ...state,
        comments: [...mergedMap.values()].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      };
    },
    clearActivities: () => ({
      threads: [],
      comments: [],
    }),
  },
});

export const {
  addCommentActivity,
  addThreadActivity,
  clearActivities,
  mergeCommentActivities,
} = activitiesSlice.actions;

export default activitiesSlice.reducer;

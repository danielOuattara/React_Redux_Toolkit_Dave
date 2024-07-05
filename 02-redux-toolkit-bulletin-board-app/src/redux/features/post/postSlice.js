import { createSlice, nanoid } from "@reduxjs/toolkit";
import { postInitialState } from "./postInitialState";
// import { addPost } from "./postActions";

const postSlice = createSlice({
  name: "post",
  initialState: postInitialState,
  reducers: {
    addPost: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            userId,
            date: new Date().toISOString(),
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          },
        };
      },
    },

    addReaction(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      } else {
        return;
      }
    },
  },

  /* OK */
  // extraReducers: (builder) => {
  //   builder.addCase(addPost, (state, action) => {
  //     state.push(action.payload);
  //   });
  // },
});

export const postActions = postSlice.actions;

/* really useful ?? */
// export const selectAllPosts = (state) => state.posts;

export default postSlice.reducer;

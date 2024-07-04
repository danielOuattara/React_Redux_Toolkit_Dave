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
          },
        };
      },
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

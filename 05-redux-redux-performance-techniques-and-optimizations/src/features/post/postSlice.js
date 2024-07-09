// https://reselect.js.org/api/createselector/

import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import {
  addNewPost,
  deletePost,
  fetchPosts,
  updatePost,
} from "./postExtraActions";

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const postInitialState = postsAdapter.getInitialState({
  status: "idle",
  error: null,
  counter: 0,
});

//-------

const postSlice = createSlice({
  name: "post",
  initialState: postInitialState,
  reducers: {
    // addPost kept for legacy
    addPost: {
      reducer(state, action) {
        postsAdapter.addOne(state, action.payload);
      },
      prepare({ title, body, userId }) {
        return {
          payload: {
            id: nanoid(),
            title,
            body,
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
      const existingPost = state.entities[postId]; // since state normalization
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },

    increaseCounter(state) {
      state.counter += 1;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";

        // adding date & reactions
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), {
            minutes: min++,
          }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        });
        // Add any fetched posts to the array
        postsAdapter.upsertMany(state, loadedPosts); // using state normalization
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch posts";
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.userId = parseInt(action.payload.userId, 10);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        postsAdapter.addOne(state, action.payload); // using state normalization
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }
        action.payload.date = new Date().toISOString();
        postsAdapter.upsertOne(state, action.payload); // using state normalization
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }
        postsAdapter.removeOne(state, action.payload.id); // using state normalization
      });
  },
});

/* 
getSelectors() creates these selectors and we rename
them with aliases using destructuring
*/

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts);

export const postActions = postSlice.actions;

export default postSlice.reducer;

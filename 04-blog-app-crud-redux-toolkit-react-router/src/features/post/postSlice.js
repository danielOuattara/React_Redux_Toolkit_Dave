import { createSlice, nanoid } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import {
  addNewPost,
  deletePost,
  fetchPosts,
  updatePost,
} from "./postExtraActions";

const postInitialState = {
  posts: [],
  status: "idle",
  error: null,
};

//-------

const postSlice = createSlice({
  name: "post",
  initialState: postInitialState,
  reducers: {
    addPost: {
      reducer(state, action) {
        state.posts.push(action.payload);
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
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
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
        state.posts = [...state.posts, ...loadedPosts];
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

        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        action.payload.date = new Date().toISOString();
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = [...posts, action.payload];
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = [...posts];
      });
  },
});

export const findPostById = (state, postId) =>
  state.posts.posts.find((post) => post.id === postId);

export const postActions = postSlice.actions;

export default postSlice.reducer;

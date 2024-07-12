import { createSelector, createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from "./userExtraActions";

const usersInitialState = [];

const userSlice = createSlice({
  name: "users",
  initialState: usersInitialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (_state, action) => {
      return action.payload;
    });
  },
});

export const findUserById = (state, userId) =>
  state.users.find((user) => user.id === userId);

export const findUserPosts = (state, userId) => {
  return state.posts.posts.filter((post) => post.userId === Number(userId));
};

//---

const selectAllPosts = (state) => state.posts.posts;

export const selectUserPosts = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId),
);

export const userAction = userSlice.actions;

export default userSlice.reducer;

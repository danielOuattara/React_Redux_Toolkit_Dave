import { createSlice } from "@reduxjs/toolkit";
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

export const userAction = userSlice.actions;

export default userSlice.reducer;

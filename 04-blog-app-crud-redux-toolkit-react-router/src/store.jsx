import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";
import postReducer from "./features/post/postSlice";
import userReducer from "./features/user/userSlice";
const store = configureStore({
  reducer: {
    counter: counterReducer,
    posts: postReducer,
    users: userReducer,
  },
});

export default store;

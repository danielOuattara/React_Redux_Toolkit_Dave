import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";

import userReducer from "./features/user/userSlice";
import { apiSlice } from "./features/api/apiSlice";
const store = configureStore({
  reducer: {
    counter: counterReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    users: userReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;

import { createAction, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const POST_URL = "https://jsonplaceholder.typicode.com/posts?_limit=21";

//------
export const addPost = createAction(
  "post/addPost",
  function prepare(title, body) {
    return {
      payload: {
        id: nanoid(),
        title,
        body,
      },
    };
  },
);

//-------

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_data, _thunkAPI) => {
    try {
      const res = await axios.get(POST_URL);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return Promise.reject(new Error(error.response.data.message));
      } else if (error instanceof Error) {
        return Promise.reject(new Error(error.message));
      } else {
        return Promise.reject(new Error("An unknown error occurred"));
      }
    }
  },
);

//-------

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (data, _thunkAPI) => {
    try {
      const res = await axios.post(POST_URL, data);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return Promise.reject(new Error(error.response.data.message));
      } else if (error instanceof Error) {
        return Promise.reject(new Error(error.message));
      } else {
        return Promise.reject(new Error("An unknown error occurred"));
      }
    }
  },
);

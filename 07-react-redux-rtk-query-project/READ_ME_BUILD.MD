# 07 react redux rtk query project

In this Redux advanced tutorial, we will use React, Redux Toolkit, and RTK Query to completely transition a blog project from Axios async thunks to RTK Query, normalized state and optimistic updates.

## (01:05) Starter Source Code

- starter code is the full code from the 05 folder

## (01:46) JSON Server

- copy data from `https://github.com/gitdagray/react_redux_toolkit/blob/main/07_lesson/data/db.json`

- paste to `07-.../data/db.json` . `data` folder is at the root the project folder

- add json-server as local dev dependency

- install json-server as dev-dependency:\
`npm i -D json-server@0.17.4`

- start json-server locally:\
`./node_modules/json-server/lib/cli/bin.js --watch data/db.json --port 3500`

## (03:50) Create an api slice

```js
// src/features/api/apiSlice.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "<http://localhost:3500>" }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({}),
});
```

## (05:43) Update postSlice to an extended api slice

```js
// https://reselect.js.org/api/createselector/


import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({  }),
});

// ...

```

## (08:54) getPosts endpoint method

```js
// https://reselect.js.org/api/createselector/

// ...

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts",
      transformResponse: (responseData) => {
        let min = 1
        const loadedPosts = responseData.map((post) => {
          if (!post.date) {
            post.date = sub(new Date(), { minutes: min++ })..toISOString();
          }
          if (!post.reactions) {
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              rocket: 0,
              coffee: 0,
            };
          }
          return post;
        });
        // to normalize the state
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => [
        { type: "Post", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Post", id })),
      ],
    }),
  }),
});

// ...
```

## (13:19) Update the postsSlice selectors

```js
// https://reselect.js.org/api/createselector/

// ...

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = extendedApiSlice;

/** return the whole query result object */
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

/** creates memoized selector */
const selectPostsData = createSelector(
  selectPostsResult,
  (postResult) => postResult.data, // normalize state object wit ids & entities
);

/** getSelectors() creates these selectors and 
we rename them with aliases using destructuring */

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors(
  (state) => selectPostsData(state) ?? initialState,
);
```

## (15:50) Reconfigure the store

```js
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
```

## (17:51) Update index.js

```jsx
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import store from "./store";

import { fetchUsers } from "./features/user/userExtraActions";
import { extendedApiSlice } from "./features/post/postSlice";

store.dispatch(fetchUsers());
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
```

## (18:59) PostsList component

```jsx
import { useSelector } from "react-redux";
import PostsExcerpt from "./PostExcerpt";
import { selectPostIds, useGetPostsQuery } from "./postSlice";

export default function PostList() {
  const { isLoading, isSuccess, isError, error } = useGetPostsQuery();
  const orderedPostIds = useSelector(selectPostIds);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isSuccess) {
    return (
      <section>
        {orderedPostIds.map((postId) => (
          <PostsExcerpt key={postId} postId={postId} />
        ))}
      </section>
    );
  }

  if (isError);
  return <p>{error}</p>;
}

```

## (21:18) PostAuthor component

```jsx
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function PostAuthor({ userId }) {
  const users = useSelector((state) => state.users);

  const author = users.find((user) => user.id === userId);

  return (
    <span>
      by{" "}
      {author ? (
        <Link to={`/user/${userId}`}>{author.name}</Link>
      ) : (
        "Unknown author"
      )}
    </span>
  );
}

```

## (22:21) getPostsByUserId endpoint method

```js
// /src/features/post/postSlice.js
getPostsByUserId: builder.query({
    query: (id) => `/posts/?userId=${id}`,
    transformResponse: (responseData) => {
    let min = 1;
    const loadedPosts = responseData.map((post) => {
        if (!post.date) {
        post.date = sub(new Date(), { minutes: min++ }).toISOString();
        }
        if (!post.reactions) {
        post.reactions = {
            thumbsUp: 0,
            wow: 0,
            rocket: 0,
            coffee: 0,
        };
        }
        return post;
    });
    // to normalize the state
    return postsAdapter.setAll(initialState, loadedPosts);
    },
    providesTags: (result, error, arg) => [...result.ids.map((id) => ({ type: "Post", id }))];
}),
```

## (24:50) addNewPost endpoint method

```js
// /src/features/post/postSlice.js

addNewPost: builder.mutation({
    query: (initialPost) => ({
    url: "/posts",
    method: "POST",
    body: {
        ...initialPost,
        userId: Number(initialPost.userId),
        date: new Date().toISOString(),
        reactions: {
        thumbsUp: 0,
        wow: 0,
        rocket: 0,
        coffee: 0,
        },
    },
    }),
    invalidatesTags: [{ type: "Post", id: "LIST" }],
}),
```

## (26:09) updatePost endpoint method

```jsx
// /src/features/post/postSlice.js

updatePost: builder.mutation({
    query: (initialPost) => ({
    url: `/posts/${initialPost.id}`,
    method: "PUT",
    body: {
        ...initialPost,
        date: new Date().toISOString(),
    },
    }),
    invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
}),
```

## (27:13) deletePost endpoint method

```js
// /src/features/post/postSlice.js

deletePost: builder.mutation({
    query: (id) => ({
    url: `/posts/${id}`,
    method: "DELETE",
    }),
    invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
}),
```

## (27:58) Export the auto-generated hooks

```js
// /src/features/post/postSlice.js

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = extendedApiSlice;
```

## (28:30) AddPostForm component

```jsx
import { useState } from "react";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "./postSlice";

export default function AddPostForm() {
  const [addNewPost, { isLoading }] = useAddNewPostMutation();

  const navigate = useNavigate();
  const users = useSelector((state) => state.users);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState("");

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleBodyChange = (e) => setBody(e.target.value);
  const handleAuthorChange = (e) => setUserId(e.target.value);

  const canSave = [title, body, userId].every(Boolean) && !isLoading;

  const submitSavePost = async () => {
    if (canSave) {
      try {
        await addNewPost({ title, body, userId }).unwrap();
        setTitle("");
        setBody("");
        setUserId("");
        navigate("/");
      } catch (error) {
        console.error("Failed to save the post: ", error);
      }
    }
  };

  return (
    <section>
      <h2>Add a New Post Javascript</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={handleTitleChange}
        />

        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={handleAuthorChange}>
          <option value="">-- Select an author --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={body}
          onChange={handleBodyChange}
        />

        <button type="button" onClick={submitSavePost} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
}
```

## (30:57) EditPostForm component

```jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  selectPostById,
  useDeletePostMutation,
  useUpdatePostMutation,
} from "./postSlice";

export default function EditPostForm() {
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const navigate = useNavigate();

  const { postId } = useParams();
  const post = useSelector((state) => selectPostById(state, Number(postId)));

  const users = useSelector((state) => {
    return state.users;
  });

  const [title, setTitle] = useState(post?.title);
  const [body, setBody] = useState(post?.body);
  const [userId, setUserId] = useState(post?.userId);

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleBodyChange = (e) => setBody(e.target.value);
  const handleAuthorChange = (e) => setUserId(Number(e.target.value));

  const canSave = [title, body, userId].every(Boolean) && !isLoading;

  const submitSavePost = async () => {
    if (canSave) {
      try {
        await updatePost({
          id: post.id,
          title,
          body,
          userId,
        }).unwrap();

        setTitle("");
        setBody("");
        setUserId("");
        navigate(`/post/${postId}`);
      } catch (err) {
        console.error("Failed to save the post", err);
      }
    }
  };

  const submitDeletePost = async () => {
    try {
      deletePost({ id: post.id }).unwrap();
      setTitle("");
      setBody("");
      setUserId("");
      navigate("/");
    } catch (err) {
      console.error("Failed to delete the post", err);
    }
  };

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={handleTitleChange}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={handleAuthorChange}>
          <option value=""></option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={body}
          onChange={handleBodyChange}
        />
        <button type="button" onClick={submitSavePost} disabled={!canSave}>
          Update Post
        </button>
        <button
          className="deleteButton"
          type="button"
          onClick={submitDeletePost}
        >
          Delete Post
        </button>
      </form>
    </section>
  );
}
```

## (33:13) UserPage component

```jsx
import { useSelector } from "react-redux";
import { findUserById } from "./userSlice";
import { Link, useParams } from "react-router-dom";
import { useGetPostsByUserIdQuery } from "./../post/postSlice";

export default function UserPage() {
  const { userId } = useParams(); // string | undefined
  const user = useSelector((state) => findUserById(state, Number(userId)));

  const {
    data: userPosts,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsByUserIdQuery(userId);

  if (isLoading) {
    return (
      <section>
        <h2>{user?.name}</h2>
        <p>Loading ...</p>
      </section>
    );
  }

  if (isSuccess) {
    const { ids, entities } = userPosts;
    return (
      <section>
        <h2>{user?.name}</h2>
        <ol>
          {ids.map((id) => (
            <li key={id}>
              <Link to={`/post/${id}`}>{entities[id].title}</Link>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  if (isError) {
    return <p>{error}</p>;
  }
}
```

## (36:04) Header component

```jsx
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="Header">
      <h1>Redux Blog</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="post">Post</Link>
          </li>
          <li>
            <Link to="users">Users</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
```

## (37:00) Optimistic Updates for Reactions

```js
// 
addReaction: builder.mutation({
  query: ({ postId, reactions }) => ({
    url: `posts/${postId}`,
    method: "PATCH",
    // In a real app, we'd probably need to base this on user ID somehow
    // so that a user can't do the same reaction more than once
    body: { reactions },
  }),
  async onQueryStarted(
    { postId, reactions },
    { dispatch, queryFulfilled },
  ) {
    // `updateQueryData` requires the endpoint name and cache key arguments,
    // so it knows which piece of cache state to update
    const patchResult = dispatch(
      extendedApiSlice.util.updateQueryData(
        "getPosts",
        undefined,
        (draft) => {
          // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
          const post = draft.entities[postId];
          if (post) post.reactions = reactions;
        },
      ),
    );
    try {
      await queryFulfilled;
    } catch {
      patchResult.undo();
    }
  },
}),

// ...

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation,
} = extendedApiSlice;
```

## (42:49) ReactionButtons component

```jsx
import { useAddReactionMutation } from "./postSlice";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

export default function PostButtonsReaction({ post }) {
  const [addReaction] = useAddReactionMutation();
  return (
    <div>
      {Object.entries(reactionEmoji).map(([name, emoji]) => (
        <button
          key={name}
          type="button"
          className="reactionButton"
          onClick={() => {
            const newValue = post.reactions[name] + 1;
            addReaction({
              postId: post.id,
              reactions: { ...post.reactions, [name]: newValue },
            });
          }}
        >
          {emoji} {post.reactions[name]}
        </button>
      ))}
    </div>
  );
}

```

## (44:57) View Redux state cache and network requests with dev tools

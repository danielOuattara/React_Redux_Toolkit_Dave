#  06 react redux rtk query crud example

## (00:46) Project dependencies

- package.json partial:

  ```json
    "dependencies": {
    "@fortawesome/fontawesome-svg-core": "^6.5.2",
    "@fortawesome/free-solid-svg-icons": "^6.5.2",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "@reduxjs/toolkit": "^2.2.6",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-redux": "^9.1.2",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
   "devDependencies": {
    "json-server": "^0.17.4"
  }
  ```

## (01:41) React v18 index changes

```jsx
// /src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

## (02:17) JSON Server

- install json-server as dev-dependency:\
`npm i -D json-server`

- start json-server locally:\
`./node_modules/json-server/lib/cli/bin.js --watch data/db.json --port 3500`

## (03:48) App and TodoList components

- App.jsx

```jsx
import TodoList from "./features/todos/TodoList";
export default function App() {
return <TodoList />;
}
```

## (05:07) Create an api slice

```js
// src/features/todos/api/apiSlice.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => "/todos",
    }),
  }),
});

export const { useGetTodosQuery } = apiSlice;
```

## (08:47) ApiProvider in index.jsx

- wrap `App.jsx` with `ApiProvider` component and `apiSlice` api

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./features/todos/api/apiSlice";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ApiProvider api={apiSlice}>
      <App />
    </ApiProvider>
  </React.StrictMode>,
);
```

## (09:57) Apply useGetTodosQuery in TodoList

```jsx
// /src/features/todos/TodoList.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useGetTodosQuery } from "../api/apiSlice";

export default function TodoList() {
  const [newTodo, setNewTodo] = useState("");

  const {
    data: todos,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTodosQuery();

  const handleSubmit = (e) => {
    e.preventDefault();
    //addTodo
    setNewTodo("");
  };

  return (
    <main>
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-todo">Enter a new todo item</label>
        <div className="new-todo">
          <input
            type="text"
            id="new-todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter new todo"
          />
        </div>
        <button className="submit">
          <FontAwesomeIcon icon={faUpload} />
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {!isLoading && isSuccess && JSON.stringify(todos)}
      {isError && <p>{error}</p>}
    </main>
  );
}
```

## (12:30) Adding mutations to the slice

```js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => ({
        url: "/todos",
      }),
    }),
    addTodo: builder.mutation({
      query: (todo) => ({
        url: "/todos",
        method: "POST",
        body: todo,
      }),
    }),
    updateTodo: builder.mutation({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: "PUT",
        body: todo,
      }),
    }),
    patchTodo: builder.mutation({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: "PATCH",
        body: todo,
      }),
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `/todos/${id}`,
        method: "DELETE",
        body: id,
      }),
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  usePatchTodoMutation,
  useDeleteTodoMutation,
} = apiSlice;
```

## (15:21) Apply mutation hooks in TodoList

```jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  usePatchTodoMutation,
  useDeleteTodoMutation,
} from "../api/apiSlice";

export default function TodoList() {
  const [newTodo, setNewTodo] = useState("");

  const {
    data: todos,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTodosQuery();

  const [addTodo] = useAddTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [patchTodo] = usePatchTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo({
      userId: 1,
      title: newTodo,
      completed: false,
    });
    setNewTodo("");
  };

  return (
    <main>
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-todo">Enter a new todo item</label>
        <div className="new-todo">
          <input
            type="text"
            id="new-todo"
            value={newTodo}
            placeholder="Enter new todo"
            onChange={(e) => setNewTodo(e.target.value)}
          />
        </div>
        <button className="submit">
          <FontAwesomeIcon icon={faUpload} />
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {!isLoading &&
        isSuccess &&
        todos.map((todo) => (
          <article key={todo.id}>
            <div className="todo">
              <input
                type="checkbox"
                name="completed"
                id="completed"
                onChange={() =>
                  updateTodo({ ...todo, completed: !todo.completed })
                }
              />
              <label htmlFor={todo.id}>{todo.title}</label>
            </div>
            <button className="trash" onClick={() => deleteTodo(todo.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </article>
        ))}
      {isError && <p>{error}</p>}
    </main>
  );
}
```

## (18:08) Cached data

```js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  tagTypes: ["Todos"],
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => ({
        url: "/todos",
      }),
      transformResponse: (res) => res.sort((a, b) => b.id - a.id),
      providesTags: ["Todos"],
    }),
    addTodo: builder.mutation({
      query: (todo) => {
        const date = Date.now();
        return {
          url: "/todos",
          method: "POST",
          body: { ...todo, date },
        };
      },
      invalidatesTags: ["Todos"],
    }),
    updateTodo: builder.mutation({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: "PUT",
        body: todo,
      }),
      invalidatesTags: ["Todos"],
    }),
    patchTodo: builder.mutation({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: "PATCH",
        body: todo,
      }),
      invalidatesTags: ["Todos"],
    }),
    deleteTodo: builder.mutation({
      query: ({ id }) => ({
        url: `/todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todos"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  usePatchTodoMutation,
  useDeleteTodoMutation,
} = apiSlice;
```

## (19:14) Tags, invalidating cache, and auto-refetching

(21:48) Transforming the response

```js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  tagTypes: ["Todos"],
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => ({
        url: "/todos",
      }),
      providesTags: ["Todos"],
      transformResponse: (res) => res.sort((a, b) => b.id - a.id), // New !
    }),

    // ...
  })
  // ...
})
```

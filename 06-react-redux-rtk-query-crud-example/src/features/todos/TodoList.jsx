import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  //   usePatchTodoMutation,
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
  //   const [patchTodo] = usePatchTodoMutation();
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

  let errorMessage = null;

  if (isError) {
    if ("status" in error) {
      // FetchBaseQueryError
      const fetchBaseQueryError = error;
      errorMessage =
        "error" in fetchBaseQueryError
          ? fetchBaseQueryError.error
          : JSON.stringify(fetchBaseQueryError.data);
    } else {
      // SerializedError
      const serializedError = error;
      errorMessage = serializedError.message ?? "An unknown error occurred";
    }
  }

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
            <button
              className="trash"
              onClick={() => deleteTodo({ id: todo.id })}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </article>
        ))}
      {isError && <p>{errorMessage}</p>}
    </main>
  );
}

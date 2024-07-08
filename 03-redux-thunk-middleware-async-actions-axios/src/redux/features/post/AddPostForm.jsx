import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost } from "./postExtraActions";

export default function AddPostForm() {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState("");
  const [addPostRequestStatus, setAddPostRequestStatus] = useState("idle");

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setBody(e.target.value);
  const onAuthorChanged = (e) => setUserId(e.target.value);

  const canSave =
    [title, body, userId].every(Boolean) && addPostRequestStatus === "idle";

  const savePost = () => {
    if (canSave) {
      try {
        setAddPostRequestStatus("pending");
        dispatch(addNewPost({ title, body, userId })).unwrap();
        setTitle("");
        setBody("");
        setUserId("");
      } catch (error) {
        console.error("Failed to save the post: ", error);
      } finally {
        setAddPostRequestStatus("idle");
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
          onChange={onTitleChanged}
        />

        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
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
          onChange={onContentChanged}
        />

        <button type="button" onClick={savePost} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
}

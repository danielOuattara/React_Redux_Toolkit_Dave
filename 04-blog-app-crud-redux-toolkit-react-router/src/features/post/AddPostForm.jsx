import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost } from "./postExtraActions";
import { useNavigate } from "react-router-dom";

export default function AddPostForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.users);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState("");
  const [requestStatus, setRequestStatus] = useState("idle");

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleBodyChange = (e) => setBody(e.target.value);
  const handleAuthorChange = (e) => setUserId(e.target.value);

  const canSave =
    [title, body, userId].every(Boolean) && requestStatus === "idle";

  const submitSavePost = () => {
    if (canSave) {
      try {
        setRequestStatus("pending");
        dispatch(addNewPost({ title, body, userId })).unwrap();
        setTitle("");
        setBody("");
        setUserId("");
        navigate("/");
      } catch (error) {
        console.error("Failed to save the post: ", error);
      } finally {
        setRequestStatus("idle");
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

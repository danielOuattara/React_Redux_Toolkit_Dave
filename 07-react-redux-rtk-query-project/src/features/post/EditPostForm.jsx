import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { selectPostById } from "./postSlice";
import { useUpdatePostMutation, useDeletePostMutation } from "./postSlice";

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

import { useSelector } from "react-redux";
import { selectPostById } from "./postSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import PostButtonsReaction from "./PostButtonsReaction";
import { Link, useParams } from "react-router-dom";

export default function PostPage() {
  // retrieve postId
  const { postId } = useParams();

  const post = useSelector((state) =>
    selectPostById(state, parseInt(postId, 10)),
  );

  if (!post) {
    return (
      <section>
        <h2>Post not found</h2>
      </section>
    );
  } else {
    return (
      <article>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        <p className="postCredit">
          <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
          <PostAuthor userId={post.userId} />
          <TimeAgo timestamp={post.date} />
        </p>
        <PostButtonsReaction post={post} />
      </article>
    );
  }
}

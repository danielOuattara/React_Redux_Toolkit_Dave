import { useSelector } from "react-redux";
import PostsExcerpt from "./PostExcerpt";
import { selectPostIds } from "./postSlice";

export default function PostList() {
  const orderedPostIds = useSelector(selectPostIds);
  const { status, error } = useSelector((state) => state.posts);

  if (status === "loading") {
    return <p>Loading...</p>;
  } else if (status === "succeeded") {
    return (
      <section>
        {orderedPostIds.map((postId) => (
          <PostsExcerpt key={postId} postId={postId} />
        ))}
      </section>
    );
  } else {
    return <p>{error}</p>;
  }
}

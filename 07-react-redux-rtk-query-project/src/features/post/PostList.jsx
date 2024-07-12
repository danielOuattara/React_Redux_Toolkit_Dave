import { useSelector } from "react-redux";
import PostsExcerpt from "./PostExcerpt";
import { selectPostIds } from "./postSlice";
import { useGetPostsQuery } from "./postSlice";

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

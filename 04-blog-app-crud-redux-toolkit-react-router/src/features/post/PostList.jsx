import { useSelector } from "react-redux";
import PostsExcerpt from "./PostExcerpt";

export default function PostList() {
  const { posts, status, error } = useSelector((state) => state.posts);

  if (status === "loading") {
    return <p>Loading...</p>;
  } else if (status === "succeeded") {
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
    return (
      <section>
        {orderedPosts.map((post) => (
          <PostsExcerpt key={post.id} post={post} />
        ))}
      </section>
    );
  } else {
    return <p>{error}</p>;
  }
}

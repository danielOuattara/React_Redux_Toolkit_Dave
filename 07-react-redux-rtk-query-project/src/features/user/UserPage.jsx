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

import { useSelector } from "react-redux";
import { findUserById, selectUserPosts } from "./userSlice";
import { Link, useParams } from "react-router-dom";

export default function UserPage() {
  const { userId } = useParams(); // string | undefined
  const user = useSelector((state) => findUserById(state, Number(userId)));

  // const userPosts = useSelector((state) =>
  //   findUserPosts(state, Number(userId)),
  // );

  /* NOTE: Without using 'createSelector()', re-renders happens.*/
  const userPosts = useSelector((state) =>
    selectUserPosts(state, Number(userId)),
  );

  return (
    <section>
      <h2>{user?.name}</h2>

      <ol>
        {userPosts.map((post) => (
          <li key={post.id}>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { postActions } from "../features/post/postSlice";

export default function Header() {
  const { counter } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  return (
    <header className="Header">
      <h1>Redux Blog</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="post">Post</Link>
          </li>
          <li>
            <Link to="users">Users</Link>
          </li>
        </ul>
      </nav>
      <button onClick={() => dispatch(postActions.increaseCounter())}>
        click {counter}
      </button>
    </header>
  );
}

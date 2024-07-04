import { useSelector } from "react-redux";

export default function PostAuthor({ userId }) {
  const users = useSelector((state) => state.users);

  const author = users.find((user) => user.id === userId);

  return <span>by {author ? author.name : "Unknown author"}</span>;
}

import { useDispatch } from "react-redux";
import { postActions } from "./postSlice";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

export default function PostButtonsReaction({ post }) {
  const dispatch = useDispatch();
  return (
    <div>
      {Object.entries(reactionEmoji).map(([name, emoji]) => (
        <button
          key={name}
          type="button"
          className="reactionButton"
          onClick={() =>
            dispatch(
              postActions.addReaction({ postId: post.id, reaction: name }),
            )
          }
        >
          {emoji} {post.reactions[name]}
        </button>
      ))}
    </div>
  );
}

import { useAddReactionMutation } from "./postSlice";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

export default function PostButtonsReaction({ post }) {
  const [addReaction] = useAddReactionMutation();
  return (
    <div>
      {Object.entries(reactionEmoji).map(([name, emoji]) => (
        <button
          key={name}
          type="button"
          className="reactionButton"
          onClick={() => {
            const newValue = post.reactions[name] + 1;
            addReaction({
              postId: post.id,
              reactions: { ...post.reactions, [name]: newValue },
            });
          }}
        >
          {emoji} {post.reactions[name]}
        </button>
      ))}
    </div>
  );
}

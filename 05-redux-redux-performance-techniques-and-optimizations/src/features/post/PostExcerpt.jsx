// import PostAuthor from "./PostAuthor";
// import TimeAgo from "./TimeAgo";
// import PostButtonsReaction from "./PostButtonsReaction";
// import { Link } from "react-router-dom";

// export default function PostsExcerpt({ post }) {
//   return (
//     <article>
//       <h2>{post.title}</h2>
//       <p className="excerpt">{post.body.substring(0, 65)}...</p>
//       <p className="postCredit">
//         <Link to={`/post/${post.id}`}>View Post</Link>
//         <PostAuthor userId={post.userId} />
//         <TimeAgo timestamp={post.date} />
//       </p>
//       <PostButtonsReaction post={post} />
//     </article>
//   );
// }

//-------------------------------------------------- # Memo Solution 1

// import PostAuthor from "./PostAuthor";
// import TimeAgo from "./TimeAgo";
// import PostButtonsReaction from "./PostButtonsReaction";
// import { Link } from "react-router-dom";
// import React from "react";

// const PostsExcerpt = ({ post }) => {
//   return (
//     <article>
//       <h2>{post.title}</h2>
//       <p className="excerpt">{post.body.substring(0, 65)}...</p>
//       <p className="postCredit">
//         <Link to={`/post/${post.id}`}>View Post</Link>
//         <PostAuthor userId={post.userId} />
//         <TimeAgo timestamp={post.date} />
//       </p>
//       <PostButtonsReaction post={post} />
//     </article>
//   );
// };

// export default React.memo(PostsExcerpt);

//-------------------------------------------------- # Memo Solution 2

// import React from "react";
// import PostAuthor from "./PostAuthor";
// import TimeAgo from "./TimeAgo";
// import PostButtonsReaction from "./PostButtonsReaction";
// import { Link } from "react-router-dom";

// const PostsExcerpt = ({ post }) => {
//   return (
//     <article>
//       <h2>{post.title}</h2>
//       <p className="excerpt">{post.body.substring(0, 65)}...</p>
//       <p className="postCredit">
//         <Link to={`/post/${post.id}`}>View Post</Link>
//         <PostAuthor userId={post.userId} />
//         <TimeAgo timestamp={post.date} />
//       </p>
//       <PostButtonsReaction post={post} />
//     </article>
//   );
// };

// // Comparison function for memoization
// const areEqual = (prevProps, nextProps) => {
//   return (
//     prevProps.post.id === nextProps.post.id &&
//     prevProps.post.title === nextProps.post.title &&
//     prevProps.post.body === nextProps.post.body &&
//     prevProps.post.userId === nextProps.post.userId &&
//     prevProps.post.date === nextProps.post.date
//   );
// };

// export default React.memo(PostsExcerpt, areEqual);

//-------------------------------------------------- # using state normalization

import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import PostButtonsReaction from "./PostButtonsReaction";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectPostById } from "./postSlice";

export default function PostsExcerpt({ postId }) {
  const post = useSelector((state) => selectPostById(state, postId));
  return (
    <article>
      <h2>{post.title}</h2>
      <p className="excerpt">{post.body.substring(0, 75)}...</p>
      <p className="postCredit">
        <Link to={`/post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <PostButtonsReaction post={post} />
    </article>
  );
}

import PostList from "./redux/features/post/PostList";
import AddPostForm from "./redux/features/post/AddPostForm";

export default function App() {
  return (
    <main className="App">
      <AddPostForm />
      <PostList />
    </main>
  );
}

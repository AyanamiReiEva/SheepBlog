import { getAllPosts } from "@/lib/posts";
import { NotesClient } from "@/components/notes-client";

export default function NotesPage() {
  const posts = getAllPosts();
  return <NotesClient posts={posts} />;
}

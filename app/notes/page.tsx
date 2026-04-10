import { getAllPosts } from "@/lib/posts";
import { NotesClient } from "@/components/notes-client";

export default async function NotesPage() {
  const posts = await getAllPosts();
  return <NotesClient posts={posts} />;
}

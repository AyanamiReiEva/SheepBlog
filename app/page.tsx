import { getAllPosts } from "@/lib/posts";
import { HomeClient } from "@/components/home-client";
import type { PostMetadata } from "@/lib/posts";

export default async function Home() {
  const posts = await getAllPosts();
  return <HomeClient posts={posts} />;
}

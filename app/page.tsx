import { getAllPosts } from "@/lib/posts";
import { HomeClient } from "@/components/home-client";
import type { PostMetadata } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();
  return <HomeClient posts={posts} />;
}

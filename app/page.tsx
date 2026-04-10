import { getAllPosts, getAllPostsSortedByViews } from '@/lib/posts';
import { HomeClient } from '@/components/home-client';
import type { PostMetadata } from '@/lib/posts';

export default async function Home() {
  const posts = await getAllPosts();
  const postsSortedByViews = await getAllPostsSortedByViews();
  return <HomeClient posts={posts} postsSortedByViews={postsSortedByViews} />;
}

import { notFound } from 'next/navigation';
import {
  getPostMetadata,
  getPostContent,
  getAllPostSlugs,
  renderMarkdownToHtml,
} from '@/lib/posts';
import { incrementViews } from '@/lib/views';
import { PostContent } from '@/components/post-content';
import type { PostMetadata } from '@/lib/posts';

export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error('[generateStaticParams] Failed to get slugs:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function loadPostData(decodedSlug: string) {
  const metadata = await getPostMetadata(decodedSlug);
  const content = await getPostContent(decodedSlug);
  const html = await renderMarkdownToHtml(content);
  // 增加浏览量
  let views = metadata.views || 0;
  try {
    views = await incrementViews(decodedSlug);
  } catch (error) {
    console.warn('[PostPage] Failed to increment views:', error);
  }
  return { metadata: { ...metadata, views }, html };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  let postData: { metadata: PostMetadata; html: string };
  try {
    postData = await loadPostData(decodedSlug);
  } catch (error) {
    console.error(`[PostPage] Failed to load post "${decodedSlug}":`, error);
    notFound();
  }

  return <PostContent metadata={postData.metadata} html={postData.html} />;
}

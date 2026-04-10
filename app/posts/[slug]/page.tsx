import { notFound } from 'next/navigation';
import {
  getPostMetadata,
  getPostContent,
  getAllPostSlugs,
  renderMarkdownToHtml,
} from '@/lib/posts';
import { PostContent } from '@/components/post-content';

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  let metadata;
  let content;
  let html;

  try {
    metadata = await getPostMetadata(decodedSlug);
    content = await getPostContent(decodedSlug);
    html = await renderMarkdownToHtml(content);
  } catch {
    notFound();
  }

  return <PostContent metadata={metadata} html={html} />;
}

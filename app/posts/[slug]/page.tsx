import { notFound } from "next/navigation";
import { getPostMetadata, getPostContent, getAllPostSlugs } from "@/lib/posts";
import { PostContent } from "@/components/post-content";

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let metadata;
  let content;

  try {
    metadata = getPostMetadata(slug);
    content = getPostContent(slug);
  } catch {
    notFound();
  }

  return <PostContent metadata={metadata} content={content} />;
}

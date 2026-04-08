import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostMetadata, getPostContent, getAllPostSlugs } from "@/lib/posts";

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  let metadata;
  let content;

  try {
    metadata = getPostMetadata(params.slug);
    content = getPostContent(params.slug);
  } catch {
    notFound();
  }

  return (
    <article className="max-w-content mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-[var(--primary)] hover:underline mb-8 inline-block">
        ← 返回首页
      </Link>

      <header className="mb-8">
        <time className="text-sm text-[var(--muted-foreground)]">
          {new Date(metadata.date).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h1 className="text-3xl font-serif font-semibold mt-2 mb-4">{metadata.title}</h1>
        <p className="text-[var(--muted-foreground)] text-lg">{metadata.description}</p>
        {metadata.tags.length > 0 && (
          <div className="flex gap-2 mt-4">
            {metadata.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-[var(--muted)] text-[var(--muted-foreground)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="border-t pt-8">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
        </div>
      </div>
    </article>
  );
}

function renderMarkdown(content: string): string {
  let html = content
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-serif font-semibold mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-serif font-semibold mt-10 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-serif font-semibold mt-10 mb-4">$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-[var(--border)] pl-4 my-4 text-[var(--muted-foreground)]">$1</blockquote>')
    .replace(/\n\n/g, '</p><p class="my-4 leading-relaxed">')
    .replace(/\n/g, '<br>');

  return `<p class="my-4 leading-relaxed">${html}</p>`;
}

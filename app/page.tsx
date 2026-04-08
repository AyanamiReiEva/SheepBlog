import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-serif font-semibold mb-4">欢迎来到我的博客</h1>
        <p className="text-[var(--muted-foreground)] leading-relaxed">
          这里是我的个人空间，分享技术文章、学习笔记和思考。
        </p>
      </div>

      <section>
        <h2 className="text-xl font-serif font-semibold mb-6">最新文章</h2>
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/posts/${post.slug}`}>
                <div className="flex flex-col gap-2">
                  <time className="text-sm text-[var(--muted-foreground)]">
                    {new Date(post.date).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h3 className="text-lg font-serif font-semibold group-hover:text-[var(--primary)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[var(--muted-foreground)] leading-relaxed">
                    {post.description}
                  </p>
                  {post.tags.length > 0 && (
                    <div className="flex gap-2 mt-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-[var(--muted)] text-[var(--muted-foreground)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

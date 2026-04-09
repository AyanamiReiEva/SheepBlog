"use client";

import Link from "next/link";
import type { PostMetadata } from "@/lib/posts";

interface PostListProps {
  posts: PostMetadata[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {posts.map((post) => (
        <article key={post.slug} style={{ cursor: 'pointer' }}>
          <Link href={`/posts/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <time style={{
                fontSize: '14px',
                color: 'var(--color-muted-foreground)',
              }}>
                {new Date(post.date).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                fontFamily: 'var(--font-serif)',
                margin: 0,
                color: 'var(--color-foreground)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-foreground)'}
              >
                {post.title}
              </h3>
              <p style={{
                color: 'var(--color-muted-foreground)',
                lineHeight: 1.7,
                margin: 0,
              }}>
                {post.description}
              </p>
              {post.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        backgroundColor: 'var(--color-muted)',
                        color: 'var(--color-muted-foreground)',
                        borderRadius: '3px',
                      }}
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
  );
}

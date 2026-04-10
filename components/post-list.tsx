'use client';

import Link from 'next/link';
import type { PostMetadata } from '@/lib/posts';

interface PostListProps {
  posts: PostMetadata[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {posts.map((post) => (
        <article key={post.slug} style={{ cursor: 'pointer' }}>
          <Link
            href={`/posts/${post.slug}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '24px',
                padding: '24px 0',
                borderBottom: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-background)',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-muted)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
              }}
            >
              {/* 缩略图占位 */}
              <div
                style={{
                  width: '120px',
                  height: '80px',
                  backgroundColor: 'var(--color-muted)',
                  borderRadius: '8px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                }}
              >
                📄
              </div>

              {/* 内容区 */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-serif)',
                    margin: 0,
                    color: 'var(--color-foreground)',
                    lineHeight: 1.3,
                  }}
                >
                  {post.title}
                </h3>
                <p
                  style={{
                    color: 'var(--color-muted-foreground)',
                    lineHeight: 1.6,
                    margin: 0,
                    fontSize: '14px',
                  }}
                >
                  {post.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <time
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-muted-foreground)',
                    }}
                  >
                    {new Date(post.date).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  {post.views !== undefined && (
                    <span
                      style={{
                        fontSize: '13px',
                        color: 'var(--color-muted-foreground)',
                      }}
                    >
                      {post.views} 次浏览
                    </span>
                  )}
                  {post.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '12px',
                            padding: '2px 8px',
                            backgroundColor: 'var(--color-muted)',
                            color: 'var(--color-muted-foreground)',
                            borderRadius: '12px',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

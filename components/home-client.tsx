'use client';

import { useState } from 'react';
import { PostList } from '@/components/post-list';
import type { PostMetadata } from '@/lib/posts';

interface HomeClientProps {
  posts: PostMetadata[];
  postsSortedByViews: PostMetadata[];
}

export function HomeClient({ posts, postsSortedByViews }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');

  return (
    <div
      style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '48px 32px',
        display: 'flex',
        gap: '64px',
      }}
    >
      {/* 主内容区 */}
      <div style={{ flex: 1 }}>
        {/* 热门推荐 - 卡片横向排列 */}
        <section style={{ marginBottom: '48px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 700,
                margin: 0,
                fontFamily: 'var(--font-sans)',
              }}
            >
              热门推荐
            </h2>
            <a
              href="#"
              style={{
                fontSize: '14px',
                color: 'var(--color-primary)',
                textDecoration: 'none',
              }}
            >
              查看全部 →
            </a>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
            }}
          >
            {postsSortedByViews.slice(0, 3).map((post) => (
              <PopularCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        {/* 标签切换区 */}
        <section>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginBottom: '24px',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <button
              onClick={() => setActiveTab('latest')}
              style={{
                fontSize: '16px',
                fontWeight: activeTab === 'latest' ? 700 : 400,
                padding: '12px 0',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color:
                  activeTab === 'latest'
                    ? 'var(--color-foreground)'
                    : 'var(--color-muted-foreground)',
                borderBottom:
                  activeTab === 'latest'
                    ? '2px solid var(--color-foreground)'
                    : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              最新
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              style={{
                fontSize: '16px',
                fontWeight: activeTab === 'popular' ? 700 : 400,
                padding: '12px 0',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color:
                  activeTab === 'popular'
                    ? 'var(--color-foreground)'
                    : 'var(--color-muted-foreground)',
                borderBottom:
                  activeTab === 'popular'
                    ? '2px solid var(--color-foreground)'
                    : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              热门
            </button>
            <button
              style={{
                fontSize: '16px',
                fontWeight: 400,
                padding: '12px 0',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: 'var(--color-muted-foreground)',
                borderBottom: '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              讨论
            </button>
          </div>
          <PostList posts={activeTab === 'latest' ? posts : postsSortedByViews} />
        </section>
      </div>

      {/* 侧边栏 */}
      <aside style={{ width: '340px', flexShrink: 0 }}>
        <div
          style={{
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 700,
              margin: '0 0 8px 0',
              fontFamily: 'var(--font-serif)',
            }}
          >
            关于 SheepBlog
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--color-muted-foreground)',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            这里是我的个人空间，分享技术文章、学习笔记和思考。All AI research is based on a
            foundation of math and coding.
          </p>
        </div>

        <div
          style={{
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '24px',
            backgroundColor: 'var(--color-muted)',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              margin: '0 0 16px 0',
            }}
          >
            订阅我的邮件列表，获取最新文章通知。
          </p>
          <button
            style={{
              width: '100%',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 700,
              color: 'white',
              backgroundColor: '#cc0000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            输入你的邮箱
          </button>
        </div>
      </aside>
    </div>
  );
}

function PopularCard({ post }: { post: PostMetadata }) {
  return (
    <a
      href={`/posts/${post.slug}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
      }}
    >
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          overflow: 'hidden',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          willChange: 'transform',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '';
          e.currentTarget.style.transform = '';
        }}
      >
        <div
          style={{
            height: '120px',
            backgroundColor: 'var(--color-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
          }}
        >
          📄
        </div>
        <div style={{ padding: '16px' }}>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--color-muted-foreground)',
              margin: '0 0 8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>
              {new Date(post.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'short',
              })}
            </span>
            {post.views !== undefined && <span>• {post.views} 浏览</span>}
          </p>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              margin: 0,
              lineHeight: 1.4,
              fontFamily: 'var(--font-serif)',
            }}
          >
            {post.title}
          </h4>
        </div>
      </div>
    </a>
  );
}

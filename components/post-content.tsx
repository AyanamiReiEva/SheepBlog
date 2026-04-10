'use client';

import { useState, useEffect, useCallback } from 'react';
import { BackLink } from './back-link';
import { Heart, MessageCircle, Repeat2, Share2, Check } from 'lucide-react';
import { Comments } from './comments';
import type { PostMetadata } from '@/lib/posts';

interface PostContentProps {
  metadata: PostMetadata;
  html: string;
}

export function PostContent({ metadata, html }: PostContentProps) {
  const [liked, setLiked] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`liked-${metadata.slug}`) === 'true';
    }
    return false;
  });
  const [likeCount, setLikeCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`likeCount-${metadata.slug}`);
      return saved ? parseInt(saved, 10) : 524;
    }
    return 524;
  });
  const [commentCount, setCommentCount] = useState(0);
  const [shared, setShared] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(true);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
      localStorage.setItem(`liked-${metadata.slug}`, 'false');
      localStorage.setItem(`likeCount-${metadata.slug}`, (likeCount - 1).toString());
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
      localStorage.setItem(`liked-${metadata.slug}`, 'true');
      localStorage.setItem(`likeCount-${metadata.slug}`, (likeCount + 1).toString());
    }
  };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
    if (navigator.share) {
      navigator.share({
        title: metadata.title,
        text: metadata.description,
        url: window.location.href,
      });
    }
  };

  const handleCommentClick = () => {
    setCommentsExpanded(!commentsExpanded);
  };

  const handleCommentCountChange = useCallback((count: number) => {
    setCommentCount(count);
  }, []);

  return (
    <article
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '60px 32px 80px',
      }}
    >
      <BackLink href="/">← 返回首页</BackLink>

      {/* 文章标题区 */}
      <header style={{ marginTop: '40px', marginBottom: '48px' }}>
        <h1
          style={{
            fontSize: '42px',
            fontWeight: 700,
            fontFamily: 'var(--font-serif)',
            marginBottom: '20px',
            marginTop: 0,
            lineHeight: 1.15,
            color: 'var(--color-foreground)',
            letterSpacing: '-0.02em',
          }}
        >
          {metadata.title}
        </h1>
        <p
          style={{
            fontSize: '20px',
            color: 'var(--color-muted-foreground)',
            lineHeight: 1.6,
            margin: '0 0 32px 0',
          }}
        >
          {metadata.description}
        </p>

        {/* 作者信息 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              overflow: 'hidden',
              boxShadow: '0 4px 14px rgba(102, 126, 234, 0.3)',
            }}
          >
            🐑
          </div>
          <div>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-foreground)',
                marginBottom: '4px',
              }}
            >
              SHEEPBLOG, PHD
            </div>
            <div
              style={{
                fontSize: '14px',
                color: 'var(--color-muted-foreground)',
              }}
            >
              {new Date(metadata.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* 互动按钮区 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '24px',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ActionButton
              icon={liked ? <Heart size={20} fill="#e11d48" /> : <Heart size={20} />}
              count={likeCount}
              onClick={handleLike}
              active={liked}
              activeColor="#e11d48"
            />
            <ActionButton
              icon={<MessageCircle size={20} />}
              count={commentCount}
              onClick={handleCommentClick}
              active={commentsExpanded}
            />
            <ActionButton icon={<Repeat2 size={20} />} count={51} />
          </div>
          <button
            onClick={handleShare}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              border: '1px solid var(--color-border)',
              borderRadius: '24px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--color-foreground)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-muted)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {shared ? <Check size={18} /> : <Share2 size={18} />}
            {shared ? '已分享' : 'Share'}
          </button>
        </div>
      </header>

      {/* 正文内容 */}
      <div
        className="prose-content"
        style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '48px',
        }}
      >
        <style jsx global>{`
          .prose-content h1 {
            font-size: 36px;
            font-weight: 700;
            font-family: var(--font-serif);
            margin-top: 0;
            margin-bottom: 24px;
            color: var(--color-foreground);
            line-height: 1.2;
            letter-spacing: -0.02em;
          }
          .prose-content h2 {
            font-size: 28px;
            font-weight: 700;
            font-family: var(--font-serif);
            margin-top: 56px;
            margin-bottom: 20px;
            color: var(--color-foreground);
            line-height: 1.3;
            letter-spacing: -0.01em;
            padding-bottom: 8px;
            border-bottom: 2px solid var(--color-border);
          }
          .prose-content h3 {
            font-size: 22px;
            font-weight: 600;
            font-family: var(--font-serif);
            margin-top: 40px;
            margin-bottom: 16px;
            color: var(--color-foreground);
            line-height: 1.4;
          }
          .prose-content h4 {
            font-size: 18px;
            font-weight: 600;
            margin-top: 32px;
            margin-bottom: 12px;
            color: var(--color-foreground);
          }
          .prose-content p {
            margin: 20px 0;
            line-height: 1.85;
            color: var(--color-foreground);
            font-size: 18px;
            letter-spacing: 0.01em;
          }
          .prose-content p:first-of-type {
            margin-top: 0;
          }
          .prose-content blockquote {
            border-left: 4px solid #6366f1;
            padding: 20px 24px;
            margin: 32px 0;
            color: var(--color-foreground);
            font-size: 19px;
            font-style: italic;
            background: linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%);
            border-radius: 0 12px 12px 0;
          }
          .prose-content blockquote p {
            margin: 0;
            font-size: 19px;
          }
          .prose-content code {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            padding: 3px 8px;
            border-radius: 6px;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            font-size: 0.88em;
            color: #e11d48;
            font-weight: 500;
          }
          .prose-content pre {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            padding: 24px;
            border-radius: 12px;
            overflow-x: auto;
            margin: 28px 0;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          }
          .prose-content pre code {
            background: transparent;
            padding: 0;
            color: #e5e7eb;
            font-size: 15px;
            line-height: 1.7;
            font-weight: 400;
          }
          .prose-content ul,
          .prose-content ol {
            margin: 24px 0;
            padding-left: 28px;
            color: var(--color-foreground);
            font-size: 18px;
          }
          .prose-content li {
            margin: 10px 0;
            line-height: 1.8;
          }
          .prose-content ul li {
            list-style-type: '•  ';
            padding-left: 8px;
          }
          .prose-content ol li {
            padding-left: 6px;
          }
          .prose-content a {
            color: #6366f1;
            text-decoration: none;
            font-weight: 500;
            border-bottom: 1px solid rgba(99, 102, 241, 0.3);
            transition: all 0.2s ease;
          }
          .prose-content a:hover {
            color: #4f46e5;
            border-bottom-color: #6366f1;
          }
          .prose-content table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 32px 0;
            font-size: 16px;
            overflow: hidden;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          }
          .prose-content th,
          .prose-content td {
            padding: 16px 20px;
            text-align: left;
            color: var(--color-foreground);
            border-bottom: 1px solid var(--color-border);
          }
          .prose-content th {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #475569;
          }
          .prose-content tr:last-child td {
            border-bottom: none;
          }
          .prose-content tr:hover td {
            background-color: rgba(99, 102, 241, 0.03);
          }
          .prose-content img {
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 32px 0;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          }
          .prose-content hr {
            border: none;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--color-border), transparent);
            margin: 48px 0;
          }
          .prose-content strong {
            font-weight: 600;
            color: var(--color-foreground);
          }
          .prose-content em {
            font-style: italic;
          }
          .prose-content del {
            text-decoration: line-through;
            color: var(--color-muted-foreground);
          }
        `}</style>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      {/* 评论区 */}
      <div style={{ marginTop: '64px' }}>
        <Comments
          postSlug={metadata.slug}
          isExpanded={commentsExpanded}
          onCommentCountChange={handleCommentCountChange}
        />
      </div>
    </article>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  count: number;
  onClick?: () => void;
  active?: boolean;
  activeColor?: string;
}

function ActionButton({ icon, count, onClick, active, activeColor }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        border: `1px solid ${active && activeColor ? activeColor : active ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: '24px',
        backgroundColor: active
          ? activeColor
            ? `${activeColor}10`
            : 'var(--color-muted)'
          : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        fontSize: '14px',
        fontWeight: 500,
        color: active && activeColor ? activeColor : 'var(--color-foreground)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          if (!active) {
            e.currentTarget.style.backgroundColor = 'var(--color-muted)';
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = 'var(--color-border)';
          e.currentTarget.style.transform = 'translateY(0)';
        } else if (!activeColor) {
          e.currentTarget.style.backgroundColor = 'var(--color-muted)';
          e.currentTarget.style.borderColor = 'var(--color-primary)';
        }
      }}
    >
      {icon}
      <span>{count}</span>
    </button>
  );
}

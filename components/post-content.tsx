"use client";

import { useState, useEffect, useCallback } from "react";
import { BackLink } from "./back-link";
import { Heart, MessageCircle, Repeat2, Share2, Check } from "lucide-react";
import { Comments } from "./comments";
import type { PostMetadata } from "@/lib/posts";

interface PostContentProps {
  metadata: PostMetadata;
  content: string;
}

export function PostContent({ metadata, content }: PostContentProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(524);
  const [commentCount, setCommentCount] = useState(0);
  const [shared, setShared] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(true);

  // 从本地存储读取状态
  useEffect(() => {
    const savedLiked = localStorage.getItem(`liked-${metadata.slug}`);
    const savedLikeCount = localStorage.getItem(`likeCount-${metadata.slug}`);
    if (savedLiked === 'true') {
      setLiked(true);
    }
    if (savedLikeCount) {
      setLikeCount(parseInt(savedLikeCount, 10));
    }
  }, [metadata.slug]);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(prev => prev - 1);
      localStorage.setItem(`liked-${metadata.slug}`, 'false');
      localStorage.setItem(`likeCount-${metadata.slug}`, (likeCount - 1).toString());
    } else {
      setLiked(true);
      setLikeCount(prev => prev + 1);
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
    <article style={{
      maxWidth: '760px',
      margin: '0 auto',
      padding: '48px 24px',
    }}>
      <BackLink href="/">← 返回首页</BackLink>

      {/* 文章标题区 */}
      <header style={{ marginTop: '32px', marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 700,
          fontFamily: 'var(--font-serif)',
          marginBottom: '12px',
          marginTop: 0,
          lineHeight: 1.2,
          color: 'var(--color-foreground)',
        }}>
          {metadata.title}
        </h1>
        <p style={{
          fontSize: '20px',
          color: 'var(--color-muted-foreground)',
          lineHeight: 1.5,
          margin: '0 0 24px 0',
        }}>
          {metadata.description}
        </p>

        {/* 作者信息 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            overflow: 'hidden',
          }}>
            🐑
          </div>
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              SHEEPBLOG, PHD
            </div>
            <div style={{
              fontSize: '14px',
              color: 'var(--color-muted-foreground)',
            }}>
              {new Date(metadata.date).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* 互动按钮区 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '16px',
          borderTop: '1px solid var(--color-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ActionButton
              icon={liked ? <Heart size={20} fill="#cc0000" /> : <Heart size={20} />}
              count={likeCount}
              onClick={handleLike}
              active={liked}
              activeColor="#cc0000"
            />
            <ActionButton
              icon={<MessageCircle size={20} />}
              count={commentCount}
              onClick={handleCommentClick}
              active={commentsExpanded}
            />
            <ActionButton
              icon={<Repeat2 size={20} />}
              count={51}
            />
          </div>
          <button
            onClick={handleShare}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              border: '1px solid var(--color-border)',
              borderRadius: '20px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              color: 'var(--color-foreground)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-muted)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {shared ? <Check size={18} /> : <Share2 size={18} />}
            {shared ? '已分享' : 'Share'}
          </button>
        </div>
      </header>

      {/* 正文内容 */}
      <div style={{
        borderTop: '1px solid var(--color-border)',
        paddingTop: '32px',
      }}>
        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
      </div>

      {/* 评论区 */}
      <Comments
        postSlug={metadata.slug}
        isExpanded={commentsExpanded}
        onCommentCountChange={handleCommentCountChange}
      />
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
        gap: '6px',
        padding: '8px 14px',
        border: `1px solid ${active && activeColor ? activeColor : active ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: '20px',
        backgroundColor: active ? 'var(--color-muted)' : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        fontSize: '14px',
        color: active && activeColor ? activeColor : 'var(--color-foreground)',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          if (!active) {
            e.currentTarget.style.backgroundColor = 'var(--color-muted)';
            e.currentTarget.style.borderColor = 'var(--color-primary)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = 'var(--color-border)';
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

function renderMarkdown(content: string): string {
  let html = content
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 22px; font-weight: 600; font-family: var(--font-serif); margin-top: 36px; margin-bottom: 16px; color: var(--color-foreground);">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 28px; font-weight: 600; font-family: var(--font-serif); margin-top: 44px; margin-bottom: 16px; color: var(--color-foreground);">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 32px; font-weight: 700; font-family: var(--font-serif); margin-top: 0px; margin-bottom: 20px; color: var(--color-foreground);">$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^\> (.*$)/gim, '<blockquote style="border-left: 4px solid var(--color-border); padding-left: 20px; margin: 24px 0; color: var(--color-muted-foreground); font-size: 18px; font-style: italic;">$1</blockquote>')
    .replace(/\n\n/g, '</p><p style="margin: 20px 0; line-height: 1.8; color: var(--color-foreground); font-size: 18px;">')
    .replace(/\n/g, '<br>');

  return `<p style="margin: 20px 0; line-height: 1.8; color: var(--color-foreground); font-size: 18px;">${html}</p>`;
}

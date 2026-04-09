"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Repeat2, Heart, Share2, MoreHorizontal, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import type { Note } from "@/lib/notes";

interface NoteCardProps {
  note: Note;
  onUpdate: (note: Note) => void;
}

export function NoteCard({ note, onUpdate }: NoteCardProps) {
  const [liked, setLiked] = useState(note.liked);
  const [likeCount, setLikeCount] = useState(note.likes);

  const handleLike = () => {
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;
    setLiked(newLiked);
    setLikeCount(newCount);
    onUpdate({ ...note, liked: newLiked, likes: newCount });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟`;
    if (hours < 24) return `${hours}小时`;
    if (days < 7) return `${days}天`;
    return date.toLocaleDateString("zh-CN", { month: 'short', day: 'numeric' });
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <article style={{
      padding: '16px 20px',
      borderBottom: '1px solid var(--color-border)',
      transition: 'background-color 0.2s',
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-muted)'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        {/* 头像 */}
        <div style={{ flexShrink: 0 }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            border: '1px solid var(--color-border)',
          }}>
            🐑
          </div>
        </div>

        {/* 内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 头部 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>{note.author}</span>
            <span style={{ fontSize: '15px', color: 'var(--color-muted-foreground)' }}>·</span>
            <span style={{ fontSize: '15px', color: 'var(--color-muted-foreground)' }}>{formatTime(note.date)}</span>
            <button style={{
              marginLeft: 'auto',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-muted-foreground)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(30, 58, 95, 0.1)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-muted-foreground)';
            }}
            >
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* 内容 */}
          <div style={{ fontSize: '15px', lineHeight: 1.5, marginBottom: '12px' }}>
            {renderContent(note.content)}
          </div>

          {/* 引用卡片 */}
          {note.reference && (
            <Link href={note.reference.url} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '12px',
              }}>
                {note.reference.image && (
                  <div style={{
                    height: '160px',
                    backgroundColor: 'var(--color-muted)',
                    backgroundImage: `url(${note.reference.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }} />
                )}
                <div style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '13px', color: 'var(--color-muted-foreground)' }}>
                    {note.reference.type === 'link' ? <LinkIcon size={14} /> : <ImageIcon size={14} />}
                    <span>{note.reference.type === 'link' ? note.reference.url.replace(/^https?:\/\//, '').split('/')[0] : 'SheepBlog'}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>
                    {note.reference.title}
                  </div>
                  {note.reference.description && (
                    <div style={{ fontSize: '14px', color: 'var(--color-muted-foreground)' }}>
                      {note.reference.description}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )}

          {/* 互动按钮 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '425px' }}>
            <ActionButton icon={<MessageCircle size={18} />} count={note.comments} />
            <ActionButton icon={<Repeat2 size={18} />} count={note.reposts} />
            <ActionButton
              icon={<Heart size={18} fill={liked ? '#cc0000' : 'none'} />}
              count={likeCount}
              onClick={handleLike}
              active={liked}
              activeColor="#cc0000"
            />
            <ActionButton icon={<Share2 size={18} />} />
          </div>
        </div>
      </div>
    </article>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  count?: number;
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
        padding: '8px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: '50%',
        color: active && activeColor ? activeColor : 'var(--color-muted-foreground)',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = active && activeColor ? 'rgba(204, 0, 0, 0.1)' : 'rgba(30, 58, 95, 0.1)';
          if (!active || !activeColor) {
            e.currentTarget.style.color = 'var(--color-primary)';
          }
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        if (active && activeColor) {
          e.currentTarget.style.color = activeColor;
        } else {
          e.currentTarget.style.color = 'var(--color-muted-foreground)';
        }
      }}
    >
      {icon}
      {count !== undefined && (
        <span style={{ fontSize: '13px' }}>{count}</span>
      )}
    </button>
  );
}

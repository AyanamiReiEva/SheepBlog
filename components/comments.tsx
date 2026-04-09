"use client";

import { useState, useEffect } from "react";
import { Send, User } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

interface CommentsProps {
  postSlug: string;
  isExpanded?: boolean;
  onCommentCountChange?: (count: number) => void;
}

export function Comments({ postSlug, isExpanded = true, onCommentCountChange }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  // 从本地存储加载评论
  useEffect(() => {
    const savedComments = localStorage.getItem(`comments-${postSlug}`);
    if (savedComments) {
      const parsed = JSON.parse(savedComments);
      setComments(parsed);
      onCommentCountChange?.(parsed.length);
    } else {
      onCommentCountChange?.(0);
    }
  }, [postSlug, onCommentCountChange]);

  // 保存评论到本地存储
  const saveComments = (newComments: Comment[]) => {
    localStorage.setItem(`comments-${postSlug}`, JSON.stringify(newComments));
    setComments(newComments);
    onCommentCountChange?.(newComments.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: author.trim(),
      content: content.trim(),
      date: new Date().toISOString(),
    };

    saveComments([newComment, ...comments]);
    setAuthor("");
    setContent("");
  };

  if (!isExpanded) return null;

  return (
    <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--color-border)' }}>
      {/* 发表评论表单 */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>发表评论</h3>
        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="你的昵称"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '10px 14px',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-foreground)',
              fontSize: '14px',
              outline: 'none',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <textarea
            placeholder="写下你的评论..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-foreground)',
              fontSize: '14px',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          />
        </div>
        <button
          type="submit"
          disabled={!author.trim() || !content.trim()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '20px',
            backgroundColor: '#cc0000',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            cursor: (!author.trim() || !content.trim()) ? 'not-allowed' : 'pointer',
            opacity: (!author.trim() || !content.trim()) ? 0.5 : 1,
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (author.trim() && content.trim()) {
              e.currentTarget.style.backgroundColor = '#aa0000';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#cc0000';
          }}
        >
          <Send size={16} />
          发表评论
        </button>
      </form>

      {/* 评论列表 */}
      <div>
        {comments.length === 0 ? (
          <p style={{ color: 'var(--color-muted-foreground)', textAlign: 'center', padding: '32px' }}>
            暂无评论，来说点什么吧！
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {comments.map((comment) => (
              <div key={comment.id} style={{ padding: '16px', backgroundColor: 'var(--color-muted)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                  }}>
                    <User size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>
                      {comment.author}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted-foreground)' }}>
                      {new Date(comment.date).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
                <p style={{
                  fontSize: '14px',
                  lineHeight: 1.6,
                  margin: 0,
                  paddingLeft: '42px',
                }}>
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

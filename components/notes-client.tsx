"use client";

import { useState, useEffect } from "react";
import { Image, Link as LinkIcon, X } from "lucide-react";
import { NoteCard } from "@/components/note-card";
import { getNotes, addNote, updateNote } from "@/lib/notes";
import type { Note, NoteReference } from "@/lib/notes";
import type { PostMetadata } from "@/lib/posts";

interface NotesClientProps {
  posts: PostMetadata[];
}

export function NotesClient({ posts }: NotesClientProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState("");
  const [reference, setReference] = useState<NoteReference | null>(null);
  const [referenceUrl, setReferenceUrl] = useState("");
  const [showReferenceInput, setShowReferenceInput] = useState(false);

  useEffect(() => {
    setNotes(getNotes());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newNote = addNote({
      author: 'SheepBlog',
      content: content.trim(),
      reference: reference || undefined,
      date: new Date().toISOString(),
    });

    setNotes([newNote, ...notes]);
    setContent("");
    setReference(null);
    setReferenceUrl("");
    setShowReferenceInput(false);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    updateNote(updatedNote);
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const handleAddReference = () => {
    if (!referenceUrl.trim()) return;

    // 检查是否是内部博文
    const postMatch = referenceUrl.match(/\/posts\/([a-z0-9-]+)/);
    if (postMatch) {
      const post = posts.find(p => p.slug === postMatch[1]);
      if (post) {
        setReference({
          type: 'post',
          title: post.title,
          url: `/posts/${post.slug}`,
          description: post.description,
        });
        setShowReferenceInput(false);
        setReferenceUrl("");
        return;
      }
    }

    // 外部链接
    setReference({
      type: 'link',
      title: referenceUrl.replace(/^https?:\/\//, ''),
      url: referenceUrl,
    });
    setShowReferenceInput(false);
    setReferenceUrl("");
  };

  const handleRemoveReference = () => {
    setReference(null);
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      minHeight: '100vh',
      borderLeft: '1px solid var(--color-border)',
      borderRight: '1px solid var(--color-border)',
    }}>
      {/* 头部 */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 20px',
        height: '53px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 700,
          margin: 0,
        }}>笔记</h1>
      </header>

      {/* 发布笔记区域 */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '8px solid var(--color-border)',
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '12px' }}>
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
              flexShrink: 0,
            }}>
              🐑
            </div>
            <div style={{ flex: 1 }}>
              <textarea
                placeholder="有什么想法？"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '18px',
                  lineHeight: 1.4,
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  color: 'var(--color-foreground)',
                }}
              />

              {/* 引用预览 */}
              {reference && (
                <div style={{
                  marginTop: '12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '12px',
                  position: 'relative',
                }}>
                  <button
                    type="button"
                    onClick={handleRemoveReference}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      border: 'none',
                      backgroundColor: 'var(--color-foreground)',
                      color: 'var(--color-background)',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={14} />
                  </button>
                  <div style={{ fontSize: '14px', color: 'var(--color-muted-foreground)', marginBottom: '4px' }}>
                    {reference.type === 'post' ? '引用博文' : '引用链接'}
                  </div>
                  <div style={{ fontWeight: 600 }}>{reference.title}</div>
                  {reference.description && (
                    <div style={{ fontSize: '14px', color: 'var(--color-muted-foreground)' }}>
                      {reference.description}
                    </div>
                  )}
                </div>
              )}

              {/* 引用输入框 */}
              {showReferenceInput && !reference && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="粘贴链接或选择博文..."
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid var(--color-border)',
                      borderRadius: '20px',
                      backgroundColor: 'var(--color-background)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddReference();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddReference}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    添加
                  </button>
                </div>
              )}

              {/* 工具栏 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid var(--color-border)',
              }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setShowReferenceInput(!showReferenceInput)}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--color-primary)',
                      padding: '8px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(30, 58, 95, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Image size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReferenceInput(!showReferenceInput)}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--color-primary)',
                      padding: '8px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(30, 58, 95, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LinkIcon size={20} />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!content.trim()}
                  style={{
                    padding: '8px 24px',
                    border: 'none',
                    backgroundColor: '#cc0000',
                    color: 'white',
                    borderRadius: '18px',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: !content.trim() ? 'not-allowed' : 'pointer',
                    opacity: !content.trim() ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (content.trim()) {
                      e.currentTarget.style.backgroundColor = '#aa0000';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#cc0000';
                  }}
                >
                  发布
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* 笔记列表 */}
      <div>
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onUpdate={handleUpdateNote}
          />
        ))}
      </div>
    </div>
  );
}

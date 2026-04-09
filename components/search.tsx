"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { PostMetadata } from "@/lib/posts";

interface SearchProps {
  posts: PostMetadata[];
}

export function Search({ posts }: SearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredResults = query.trim() === ""
    ? []
    : posts.filter((post) => {
        const lowerQuery = query.toLowerCase();
        const titleMatch = post.title.toLowerCase().includes(lowerQuery);
        const tagMatch = post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
        return titleMatch || tagMatch;
      }).slice(0, 8);

  const highlightText = (text: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)', borderRadius: '2px', padding: '0 2px' }}>{part}</mark>
        : part
    );
  };

  return (
    <div ref={searchRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="搜索文章..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          style={{
            width: '200px',
            padding: '8px 12px 8px 32px',
            fontSize: '14px',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-foreground)',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30, 58, 95, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-muted-foreground)',
            pointerEvents: 'none',
          }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>

      {isOpen && query.trim() !== "" && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            width: '360px',
            maxHeight: '400px',
            overflowY: 'auto',
            backgroundColor: 'var(--color-background)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            zIndex: 100,
          }}
        >
          {filteredResults.length > 0 ? (
            <div style={{ padding: '8px 0' }}>
              <div
                style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  color: 'var(--color-muted-foreground)',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                找到 {filteredResults.length} 篇文章
              </div>
              {filteredResults.map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  onClick={() => {
                    setQuery('');
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-muted)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      marginBottom: '4px',
                      lineHeight: 1.4,
                    }}
                  >
                    {highlightText(post.title)}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '12px',
                      color: 'var(--color-muted-foreground)',
                    }}
                  >
                    <time>
                      {new Date(post.date).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    {post.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            style={{
                              padding: '2px 6px',
                              backgroundColor: 'var(--color-muted)',
                              borderRadius: '3px',
                              fontSize: '11px',
                            }}
                          >
                            {highlightText(tag)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                color: 'var(--color-muted-foreground)',
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ margin: '0 auto 12px', opacity: 0.5 }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <div style={{ fontSize: '14px' }}>未找到相关文章</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>试试其他关键词</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

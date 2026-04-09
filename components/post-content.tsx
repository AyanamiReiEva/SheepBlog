"use client";

import { BackLink } from "./back-link";
import type { PostMetadata } from "@/lib/posts";

interface PostContentProps {
  metadata: PostMetadata;
  content: string;
}

export function PostContent({ metadata, content }: PostContentProps) {
  return (
    <article style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '48px 24px',
    }}>
      <BackLink href="/">← 返回首页</BackLink>

      <header style={{ marginBottom: '32px' }}>
        <time style={{
          fontSize: '14px',
          color: 'var(--color-muted-foreground)',
        }}>
          {new Date(metadata.date).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h1 style={{
          fontSize: '30px',
          fontWeight: 600,
          fontFamily: 'var(--font-serif)',
          marginTop: '8px',
          marginBottom: '16px',
        }}>{metadata.title}</h1>
        {metadata.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {metadata.tags.map((tag) => (
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
      </header>

      <div style={{
        borderTop: '1px solid var(--color-border)',
        paddingTop: '32px',
      }}>
        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
      </div>
    </article>
  );
}

function renderMarkdown(content: string): string {
  let html = content
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 20px; font-weight: 600; font-family: var(--font-serif); margin-top: 32px; margin-bottom: 16px; color: var(--color-foreground);">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 24px; font-weight: 600; font-family: var(--font-serif); margin-top: 40px; margin-bottom: 16px; color: var(--color-foreground);">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 30px; font-weight: 600; font-family: var(--font-serif); margin-top: 40px; margin-bottom: 16px; color: var(--color-foreground);">$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^\> (.*$)/gim, '<blockquote style="border-left: 4px solid var(--color-border); padding-left: 16px; margin: 16px 0; color: var(--color-muted-foreground);">$1</blockquote>')
    .replace(/\n\n/g, '</p><p style="margin: 16px 0; line-height: 1.7; color: var(--color-foreground);">')
    .replace(/\n/g, '<br>');

  return `<p style="margin: 16px 0; line-height: 1.7; color: var(--color-foreground);">${html}</p>`;
}

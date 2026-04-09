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

      <div style={{
        borderTop: '2px solid var(--color-border)',
        marginTop: '24px',
        paddingTop: '20px',
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
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 30px; font-weight: 600; font-family: var(--font-serif); margin-top: 0px; margin-bottom: 16px; color: var(--color-foreground);">$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^\> (.*$)/gim, '<blockquote style="border-left: 4px solid var(--color-border); padding-left: 16px; margin: 16px 0; color: var(--color-muted-foreground);">$1</blockquote>')
    .replace(/\n\n/g, '</p><p style="margin: 16px 0; line-height: 1.7; color: var(--color-foreground);">')
    .replace(/\n/g, '<br>');

  return `<p style="margin: 16px 0; line-height: 1.7; color: var(--color-foreground);">${html}</p>`;
}

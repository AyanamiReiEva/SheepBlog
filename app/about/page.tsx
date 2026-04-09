import { BackLink } from "@/components/back-link";

export default function AboutPage() {
  return (
    <div style={{
      maxWidth: '720px',
      margin: '0 auto',
      padding: '48px 16px',
    }}>
      <BackLink href="/">← 返回首页</BackLink>

      <h1 style={{
        fontSize: '30px',
        fontWeight: 600,
        fontFamily: 'var(--font-serif)',
        marginBottom: '32px',
        marginTop: 0,
      }}>关于我</h1>

      <div style={{ lineHeight: 1.7 }}>
        <p style={{ marginBottom: '16px', marginTop: 0 }}>
          你好！欢迎来到我的个人博客。
        </p>
        <p style={{ marginBottom: '16px', marginTop: 0 }}>
          这是一个使用 Next.js 16 构建的现代化博客系统，采用极简设计风格，专注于内容阅读体验。
        </p>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 600,
          fontFamily: 'var(--font-serif)',
          marginTop: '32px',
          marginBottom: '16px',
        }}>技术栈</h2>
        <ul style={{
          paddingLeft: '24px',
          color: 'var(--color-muted-foreground)',
          margin: 0,
        }}>
          <li style={{ marginBottom: '8px' }}>Next.js 16</li>
          <li style={{ marginBottom: '8px' }}>TypeScript</li>
          <li style={{ marginBottom: '8px' }}>Tailwind CSS</li>
          <li style={{ marginBottom: '8px' }}>Shadcn/ui</li>
        </ul>
      </div>
    </div>
  );
}

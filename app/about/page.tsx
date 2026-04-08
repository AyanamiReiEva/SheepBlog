import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-content mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-[var(--primary)] hover:underline mb-8 inline-block">
        ← 返回首页
      </Link>

      <h1 className="text-3xl font-serif font-semibold mb-8">关于我</h1>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-4">
        <p className="leading-relaxed">
          你好！欢迎来到我的个人博客。
        </p>
        <p className="leading-relaxed">
          这是一个使用 Next.js 构建的现代化博客系统，采用极简设计风格，专注于内容阅读体验。
        </p>
        <h2 className="text-2xl font-serif font-semibold mt-8 mb-4">技术栈</h2>
        <ul className="list-disc pl-6 space-y-2 text-[var(--muted-foreground)]">
          <li>Next.js 16</li>
          <li>TypeScript</li>
          <li>Tailwind CSS</li>
          <li>Shadcn/ui</li>
        </ul>
      </div>
    </div>
  );
}

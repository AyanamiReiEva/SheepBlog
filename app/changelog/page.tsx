import { BackLink } from "@/components/back-link";

export default function ChangelogPage() {
  const changelog = [
    {
      date: "2026-04-09",
      version: "1.2.0",
      changes: [
        { type: "feature", text: "优化前端页面布局，增加最大宽度至 900px" },
        { type: "feature", text: "为博文列表添加卡片样式和悬停效果" },
        { type: "feature", text: "新增改动日志页面" },
        { type: "improvement", text: "增加页面左右边距至 24px" },
      ]
    },
    {
      date: "2026-04-08",
      version: "1.1.0",
      changes: [
        { type: "feature", text: "完善博客美化和深色模式支持" },
        { type: "feature", text: "添加主题切换功能" },
        { type: "improvement", text: "优化全局配色方案" },
      ]
    },
    {
      date: "2026-04-07",
      version: "1.0.0",
      changes: [
        { type: "feature", text: "完成博客核心功能" },
        { type: "feature", text: "AI开发流水线基础框架" },
        { type: "feature", text: "博文列表和详情页面" },
        { type: "feature", text: "MDX 博文支持" },
        { type: "feature", text: "标签系统" },
      ]
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "feature": return "✨";
      case "improvement": return "♻️";
      case "fix": return "🐛";
      default: return "📝";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "feature": return "新功能";
      case "improvement": return "优化";
      case "fix": return "修复";
      default: return "其他";
    }
  };

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '48px 24px',
    }}>
      <BackLink href="/">← 返回首页</BackLink>

      <h1 style={{
        fontSize: '30px',
        fontWeight: 600,
        fontFamily: 'var(--font-serif)',
        marginBottom: '32px',
        marginTop: '16px',
      }}>改动日志</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {changelog.map((release) => (
          <section key={release.version}>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 600,
                fontFamily: 'var(--font-serif)',
                margin: 0,
              }}>
                v{release.version}
              </h2>
              <time style={{
                fontSize: '14px',
                color: 'var(--color-muted-foreground)',
              }}>
                {new Date(release.date).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {release.changes.map((change, index) => (
                <li key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--color-muted)',
                  borderRadius: '6px',
                }}>
                  <span style={{ fontSize: '16px', lineHeight: 1.5 }}>
                    {getTypeIcon(change.type)}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    padding: '2px 6px',
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                    color: 'var(--color-muted-foreground)',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                  }}>
                    {getTypeLabel(change.type)}
                  </span>
                  <span style={{ lineHeight: 1.6 }}>
                    {change.text}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

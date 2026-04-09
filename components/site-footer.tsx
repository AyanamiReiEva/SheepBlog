export function SiteFooter() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      marginTop: '64px',
    }}>
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '32px 16px',
        textAlign: 'center',
        fontSize: '14px',
        color: 'var(--color-muted-foreground)',
      }}>
        <p>© {new Date().getFullYear()} 我的博客. 保留所有权利.</p>
      </div>
    </footer>
  );
}

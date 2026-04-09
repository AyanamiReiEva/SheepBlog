export function SiteFooter() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      marginTop: '64px',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '32px 24px',
        textAlign: 'center',
        fontSize: '14px',
        color: 'var(--color-muted-foreground)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
      }}>
        <svg width="16" height="16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="32" cy="38" rx="20" ry="16" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="32" cy="24" r="12" fill="white" stroke="currentColor" strokeWidth="2"/>
          <ellipse cx="20" cy="16" rx="4" ry="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <ellipse cx="44" cy="16" rx="4" ry="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="27" cy="22" r="2" fill="currentColor"/>
          <circle cx="37" cy="22" r="2" fill="currentColor"/>
          <ellipse cx="32" cy="27" rx="2" ry="1.5" fill="currentColor"/>
          <path d="M29 30 Q32 33 35 30" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
        <p>© {new Date().getFullYear()} SheepBlog. 保留所有权利.</p>
      </div>
    </footer>
  );
}

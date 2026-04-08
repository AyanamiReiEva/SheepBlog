export function SiteFooter() {
  return (
    <footer className="border-t mt-16">
      <div className="max-w-content mx-auto px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
        <p>© {new Date().getFullYear()} 我的博客. 保留所有权利.</p>
      </div>
    </footer>
  );
}

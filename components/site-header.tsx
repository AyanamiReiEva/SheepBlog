"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";

export function SiteHeader() {
  const { toggleTheme } = useTheme();

  return (
    <header className="border-b sticky top-0 z-50 bg-[var(--background)]">
      <div className="max-w-content mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-serif font-semibold hover:text-[var(--primary)] transition-colors">
          我的博客
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm hover:text-[var(--primary)] transition-colors">
            首页
          </Link>
          <Link href="/about" className="text-sm hover:text-[var(--primary)] transition-colors">
            关于
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-4 w-4 hidden dark:block" />
            <Moon className="h-4 w-4 block dark:hidden" />
            <span className="sr-only">切换主题</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}

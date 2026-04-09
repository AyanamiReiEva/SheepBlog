"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'var(--color-background)',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 24px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link href="/" style={{
          fontSize: '18px',
          fontWeight: 600,
          fontFamily: 'var(--font-serif)',
          textDecoration: 'none',
          color: 'var(--color-foreground)',
          transition: 'color 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-foreground)'}
        >
          <svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="38" rx="20" ry="16" fill="white" stroke="currentColor" strokeWidth="2"/>
            <circle cx="32" cy="24" r="12" fill="white" stroke="currentColor" strokeWidth="2"/>
            <ellipse cx="20" cy="16" rx="4" ry="6" fill="white" stroke="currentColor" strokeWidth="2"/>
            <ellipse cx="44" cy="16" rx="4" ry="6" fill="white" stroke="currentColor" strokeWidth="2"/>
            <circle cx="27" cy="22" r="2" fill="currentColor"/>
            <circle cx="37" cy="22" r="2" fill="currentColor"/>
            <ellipse cx="32" cy="27" rx="2" ry="1.5" fill="currentColor"/>
            <path d="M29 30 Q32 33 35 30" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="22" cy="36" r="2" fill="currentColor" opacity="0.3"/>
            <circle cx="42" cy="36" r="2" fill="currentColor" opacity="0.3"/>
            <circle cx="32" cy="44" r="2" fill="currentColor" opacity="0.3"/>
          </svg>
          SheepBlog
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/" style={{
            fontSize: '14px',
            textDecoration: 'none',
            color: 'var(--color-foreground)',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-foreground)'}
          >
            首页
          </Link>
          <Link href="/about" style={{
            fontSize: '14px',
            textDecoration: 'none',
            color: 'var(--color-foreground)',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-foreground)'}
          >
            关于
          </Link>
          <Link href="/changelog" style={{
            fontSize: '14px',
            textDecoration: 'none',
            color: 'var(--color-foreground)',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-foreground)'}
          >
            改动日志
          </Link>
          <button
            onClick={toggleTheme}
            aria-label="切换主题"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              color: 'var(--color-foreground)',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-muted)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </nav>
      </div>
    </header>
  );
}

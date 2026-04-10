'use client';

import Link from 'next/link';
import { Moon, Sun, Search, Upload } from 'lucide-react';
import { useTheme } from './theme-provider';

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--color-background)',
      }}
    >
      {/* 顶部栏 */}
      <div
        style={{
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* 左侧占位 */}
          <div style={{ width: '100px' }}></div>

          {/* Logo 居中 */}
          <Link
            href="/"
            style={{
              fontSize: '24px',
              fontWeight: 700,
              fontFamily: 'var(--font-serif)',
              textDecoration: 'none',
              color: 'var(--color-foreground)',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '')}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse
                cx="32"
                cy="38"
                rx="20"
                ry="16"
                fill="white"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="32" cy="24" r="12" fill="white" stroke="currentColor" strokeWidth="2" />
              <ellipse
                cx="20"
                cy="16"
                rx="4"
                ry="6"
                fill="white"
                stroke="currentColor"
                strokeWidth="2"
              />
              <ellipse
                cx="44"
                cy="16"
                rx="4"
                ry="6"
                fill="white"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="27" cy="22" r="2" fill="currentColor" />
              <circle cx="37" cy="22" r="2" fill="currentColor" />
              <ellipse cx="32" cy="27" rx="2" ry="1.5" fill="currentColor" />
              <path d="M29 30 Q32 33 35 30" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="22" cy="36" r="2" fill="currentColor" opacity="0.3" />
              <circle cx="42" cy="36" r="2" fill="currentColor" opacity="0.3" />
              <circle cx="32" cy="44" r="2" fill="currentColor" opacity="0.3" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>SheepBlog</span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 400,
                  color: 'var(--color-muted-foreground)',
                }}
              >
                分享技术与思考
              </span>
            </div>
          </Link>

          {/* 右侧操作区 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              aria-label="搜索"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                color: 'var(--color-foreground)',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
            >
              <Search size={24} />
            </button>

            <button
              aria-label="上传"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                color: 'var(--color-foreground)',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
            >
              <Upload size={24} />
            </button>

            <Link
              href="/subscribe"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 28px',
                fontSize: '18px',
                fontWeight: 700,
                textDecoration: 'none',
                color: 'white',
                backgroundColor: '#cc0000',
                borderRadius: '12px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#aa0000')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
            >
              订阅
            </Link>

            <Link
              href="/signin"
              style={{
                fontSize: '18px',
                fontWeight: 700,
                textDecoration: 'none',
                color: 'var(--color-foreground)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '')}
            >
              登录
            </Link>

            <button
              onClick={toggleTheme}
              aria-label="切换主题"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                color: 'var(--color-foreground)',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* 底部导航栏 */}
      <div
        style={{
          borderBottom: '2px solid var(--color-border)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            height: '56px',
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: '16px',
              fontWeight: 500,
              textDecoration: 'none',
              color: 'var(--color-foreground)',
              transition: 'color 0.2s',
              padding: '8px 16px',
              borderRadius: '6px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
              e.currentTarget.style.backgroundColor = 'var(--color-muted)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-foreground)';
              e.currentTarget.style.backgroundColor = '';
            }}
          >
            首页
          </Link>
          <Link
            href="/notes"
            style={{
              fontSize: '16px',
              fontWeight: 500,
              textDecoration: 'none',
              color: 'var(--color-foreground)',
              transition: 'color 0.2s',
              padding: '8px 16px',
              borderRadius: '6px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
              e.currentTarget.style.backgroundColor = 'var(--color-muted)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-foreground)';
              e.currentTarget.style.backgroundColor = '';
            }}
          >
            笔记
          </Link>
          <Link
            href="/about"
            style={{
              fontSize: '16px',
              fontWeight: 500,
              textDecoration: 'none',
              color: 'var(--color-foreground)',
              transition: 'color 0.2s',
              padding: '8px 16px',
              borderRadius: '6px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
              e.currentTarget.style.backgroundColor = 'var(--color-muted)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-foreground)';
              e.currentTarget.style.backgroundColor = '';
            }}
          >
            关于
          </Link>
          <Link
            href="/changelog"
            style={{
              fontSize: '16px',
              fontWeight: 500,
              textDecoration: 'none',
              color: 'var(--color-foreground)',
              transition: 'color 0.2s',
              padding: '8px 16px',
              borderRadius: '6px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
              e.currentTarget.style.backgroundColor = 'var(--color-muted)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-foreground)';
              e.currentTarget.style.backgroundColor = '';
            }}
          >
            改动日志
          </Link>
        </div>
      </div>
    </header>
  );
}

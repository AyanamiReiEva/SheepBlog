'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackLinkProps {
  href: string;
  children: React.ReactNode;
}

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      style={{
        fontSize: '14px',
        color: 'var(--color-muted-foreground)',
        textDecoration: 'none',
        marginBottom: '32px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        borderRadius: '20px',
        backgroundColor: 'transparent',
        border: '1px solid var(--color-border)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        fontWeight: 500,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-muted)';
        e.currentTarget.style.color = 'var(--color-foreground)';
        e.currentTarget.style.borderColor = 'var(--color-primary)';
        e.currentTarget.style.transform = 'translateX(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = 'var(--color-muted-foreground)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <ArrowLeft size={16} strokeWidth={2} />
      {children}
    </Link>
  );
}

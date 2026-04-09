"use client";

import Link from "next/link";

interface BackLinkProps {
  href: string;
  children: React.ReactNode;
}

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link href={href} style={{
      fontSize: '14px',
      color: 'var(--color-primary)',
      textDecoration: 'none',
      marginBottom: '32px',
      display: 'inline-block',
      transition: 'text-decoration 0.2s',
    }}
    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
    >
      {children}
    </Link>
  );
}

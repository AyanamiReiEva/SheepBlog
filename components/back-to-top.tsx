'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

// 防抖函数
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    setIsVisible(window.pageYOffset > 300);
  }, []);

  useEffect(() => {
    const debouncedToggle = debounce(toggleVisibility, 50);
    window.addEventListener('scroll', debouncedToggle, { passive: true });
    return () => window.removeEventListener('scroll', debouncedToggle);
  }, [toggleVisibility]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        willChange: 'transform',
        zIndex: 1000,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.15)';
      }}
      aria-label="回到顶部"
    >
      <ArrowUp size={20} />
    </button>
  );
}

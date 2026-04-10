import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BackToTop } from '@/components/back-to-top';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SheepBlog',
  description: '一个极简风格的个人博客',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.className} antialiased`}>
      <body>
        <ThemeProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}

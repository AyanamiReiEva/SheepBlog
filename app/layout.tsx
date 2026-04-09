import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getAllPosts } from "@/lib/posts";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SheepBlog",
  description: "一个极简风格的个人博客",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = getAllPosts();

  return (
    <html lang="zh-CN" className={`${inter.className} antialiased`}>
      <body>
        <ThemeProvider>
          <SiteHeader posts={posts} />
          <main>{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}

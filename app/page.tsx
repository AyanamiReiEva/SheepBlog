import { getAllPosts } from "@/lib/posts";
import { PostList } from "@/components/post-list";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '48px 24px',
    }}>
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontSize: '30px',
          fontWeight: 600,
          marginBottom: '16px',
          marginTop: 0,
          fontFamily: 'var(--font-serif)',
        }}>欢迎来到我的博客</h1>
        <p style={{
          color: 'var(--color-muted-foreground)',
          lineHeight: 1.7,
          margin: 0,
        }}>这里是我的个人空间，分享技术文章、学习笔记和思考。</p>
      </div>

      <section>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          marginBottom: '24px',
          marginTop: 0,
          fontFamily: 'var(--font-serif)',
        }}>最新文章</h2>
        <PostList posts={posts} />
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS } from "../page";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | ChobiClear Blog`,
    description: post.desc,
    keywords: post.keywords,
    alternates: { canonical: `https://chobiclear.com/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.desc,
      url: `https://chobiclear.com/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      siteName: "ChobiClear",
    },
  };
}

// Simple markdown-to-HTML (headings, bold, lists, links, tables, hr)
function renderMarkdown(md: string): string {
  return md
    .trim()
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.3rem;font-weight:700;margin:28px 0 12px">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1.05rem;font-weight:700;margin:20px 0 8px">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:var(--primary);font-weight:600">$1</a>')
    .replace(/^- (✅|⚠️|❌) (.+)$/gm, '<li style="list-style:none;padding:3px 0">$1 $2</li>')
    .replace(/^- (.+)$/gm, '<li style="padding:3px 0 3px 16px">$1</li>')
    .replace(/^\| (.+) \|$/gm, (row) => {
      const cells = row.split("|").filter(Boolean).map((c) => c.trim());
      return "<tr>" + cells.map((c) => `<td style="padding:8px 12px;border:1px solid var(--border)">${c}</td>`).join("") + "</tr>";
    })
    .replace(/^---$/gm, "<hr style='border:none;border-top:1px solid var(--border);margin:24px 0'>")
    .replace(/(<tr>[\s\S]*?<\/tr>)/g, (m) => `<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:0.88rem">${m}</table>`)
    .replace(/(<li[^>]*>[\s\S]*?<\/li>)+/g, (m) => `<ul style="margin:12px 0">${m}</ul>`)
    .split("\n\n")
    .map((p) => {
      if (p.startsWith("<h") || p.startsWith("<ul") || p.startsWith("<table") || p.startsWith("<hr")) return p;
      if (!p.trim()) return "";
      return `<p style="margin:12px 0;line-height:1.8;color:var(--text-muted)">${p.trim()}</p>`;
    })
    .join("\n");
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.desc,
    datePublished: post.date,
    author: { "@type": "Organization", name: "ChobiClear", url: "https://chobiclear.com" },
    publisher: { "@type": "Organization", name: "ChobiClear", logo: { "@type": "ImageObject", url: "https://chobiclear.com/og-image.png" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://chobiclear.com/blog/${slug}` },
    keywords: post.keywords.join(", "),
  };

  return (
    <main style={{ fontFamily: "var(--font)", background: "var(--bg)", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Nav */}
      <nav style={{ background: "rgba(250,250,250,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)", padding: "0 20px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: "1.3rem" }}>
            <span style={{ color: "var(--primary)" }}>Chobi</span>Clear
          </Link>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Link href="/blog" style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>← Blog</Link>
            <Link href="/" className="btn btn-primary btn-sm">Try Free ✨</Link>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "52px 20px 80px" }}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{ marginBottom: 24, fontSize: "0.82rem", color: "var(--text-light)" }}>
          <Link href="/" style={{ color: "var(--text-light)" }}>Home</Link>
          {" › "}
          <Link href="/blog" style={{ color: "var(--text-light)" }}>Blog</Link>
          {" › "}
          <span style={{ color: "var(--text-muted)" }}>{post.title.slice(0, 40)}…</span>
        </nav>

        <div style={{ marginBottom: 16 }}>
          <span className="badge badge-primary">{post.tag}</span>
          <span style={{ marginLeft: 10, fontSize: "0.78rem", color: "var(--text-light)" }}>{post.date} · {post.readTime} read</span>
        </div>

        <h1 style={{ fontSize: "clamp(1.5rem,3.5vw,2.2rem)", fontWeight: 800, lineHeight: 1.25, marginBottom: 16, color: "var(--text)" }}>
          {post.emoji} {post.title}
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 36, borderLeft: "3px solid var(--primary)", paddingLeft: 16 }}>
          {post.desc}
        </p>

        {/* Body */}
        <div
          style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "var(--text)" }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
        />

        {/* CTA */}
        <div style={{ marginTop: 48, padding: "32px 28px", background: "linear-gradient(135deg,rgba(0,201,167,0.1),rgba(108,92,231,0.1))", borderRadius: 20, border: "1px solid var(--border)", textAlign: "center" }}>
          <p style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8 }}>Ready to remove backgrounds?</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 20 }}>Free · No signup · Works in your browser</p>
          <Link href="/" className="btn btn-primary btn-lg" style={{ display: "inline-flex" }}>
            Try ChobiClear Free ✨
          </Link>
        </div>

        {/* Related posts */}
        <div style={{ marginTop: 52 }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 20 }}>Related Articles</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
            {POSTS.filter((p) => p.slug !== slug).slice(0, 3).map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
                <div className="card" style={{ padding: "16px", cursor: "pointer" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{p.emoji}</div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)", lineHeight: 1.4 }}>{p.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}

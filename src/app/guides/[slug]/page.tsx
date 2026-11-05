import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, getArticleBySlug } from "@/lib/articles";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const url = `https://personal-finance.mstudio.fun/guides/${article.slug}`;

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: article.metaTitle,
      description: article.metaDescription,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      siteName: "BudgetFlow",
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
    },
  };
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const url = `https://personal-finance.mstudio.fun/guides/${article.slug}`;
  const relatedArticles = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: article.title,
        description: article.metaDescription,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: {
          "@type": "Organization",
          name: "BudgetFlow Research Team",
          url: "https://personal-finance.mstudio.fun/",
        },
        publisher: {
          "@type": "Organization",
          name: "BudgetFlow",
          url: "https://personal-finance.mstudio.fun/",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "BudgetFlow Home",
            item: "https://personal-finance.mstudio.fun/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guides",
            item: "https://personal-finance.mstudio.fun/guides",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: url,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: article.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
    ],
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", color: "#0f172a", fontFamily: "Inter, system-ui, sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        .article-body h2 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 2.25rem 0 0.85rem; line-height: 1.3; }
        .article-body h3 { font-size: 1.2rem; font-weight: 700; color: #0f172a; margin: 1.75rem 0 0.6rem; }
        .article-body p { font-size: 1.02rem; color: #334155; line-height: 1.75; margin-bottom: 1.15rem; }
        .article-body ul, .article-body ol { padding-left: 1.4rem; margin-bottom: 1.25rem; color: #334155; line-height: 1.75; }
        .article-body li { margin-bottom: 0.5rem; }
        .article-body a { color: #059669; font-weight: 700; text-decoration: underline; }
        .article-body code { background: #f1f5f9; padding: 0.15rem 0.4rem; border-radius: 5px; font-size: 0.9em; color: #0f172a; }
        .article-body .table-wrap { overflow-x: auto; margin: 1.5rem 0 2rem; border-radius: 12px; border: 1px solid #e2e8f0; }
        .article-body table { width: 100%; border-collapse: collapse; background: #fff; font-size: 0.92rem; }
        .article-body th { background: #0f172a; color: #fff; font-weight: 700; text-align: left; padding: 0.85rem 1rem; }
        .article-body td { padding: 0.85rem 1rem; border-bottom: 1px solid #e2e8f0; color: #334155; }
        .article-body tr.highlight-row td { background: #ecfdf5; color: #065f46; font-weight: 600; }
      `}</style>

      {/* Sticky Conversion Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0.9rem 1.5rem", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <Link href="/" style={{ fontSize: "1.25rem", fontWeight: 900, color: "#10b981", textDecoration: "none" }}>
            BudgetFlow
          </Link>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <Link
              href="/#interactive-demo"
              style={{ padding: "0.45rem 0.9rem", borderRadius: 8, fontSize: "0.82rem", fontWeight: 600, color: "#0f172a", border: "1px solid #cbd5e1", textDecoration: "none" }}
            >
              🎮 Try Live Sandbox
            </Link>
            <Link
              href="https://mstudiofun.gumroad.com/l/nkrgwd"
              style={{ padding: "0.45rem 1rem", borderRadius: 8, fontSize: "0.82rem", fontWeight: 700, background: "#10b981", color: "#fff", textDecoration: "none" }}
            >
              Get BudgetFlow — $15 →
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 820, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1.25rem" }}>
          <Link href="/" style={{ color: "#059669", textDecoration: "none", fontWeight: 600 }}>BudgetFlow Home</Link>
          {" / "}
          <Link href="/guides" style={{ color: "#64748b", textDecoration: "none" }}>Guides</Link>
          {" / "}
          <span>{article.category}</span>
        </nav>

        {/* Article Header */}
        <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900, lineHeight: 1.22, marginBottom: "1rem", color: "#0f172a" }}>
          {article.title}
        </h1>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", fontSize: "0.82rem", color: "#64748b", marginBottom: "2rem" }}>
          <span style={{ background: "#d1fae5", color: "#059669", fontWeight: 700, padding: "0.2rem 0.65rem", borderRadius: 6 }}>
            {article.category}
          </span>
          <span>•</span>
          <span>{article.readTime}</span>
          <span>•</span>
          <span>Last Updated: {article.updatedAt}</span>
        </div>

        {/* GEO Executive Summary Box (Inverted Pyramid for ChatGPT & Gemini Citations) */}
        <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 14, padding: "1.4rem 1.6rem", marginBottom: "2.25rem" }}>
          <div style={{ fontSize: "0.74rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#059669", marginBottom: "0.4rem" }}>
            ⚡ Key Takeaway & Quick Answer
          </div>
          <p style={{ fontSize: "0.96rem", color: "#064e3b", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
            {article.executiveSummary}
          </p>
        </div>

        {/* Main Article Content */}
        <article
          className="article-body"
          style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "2.25rem 2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Mid-Page Interactive Product Funnel CTA */}
        <div style={{ margin: "2.5rem 0", background: "linear-gradient(135deg, #0f172a, #1e3a5f)", color: "#fff", borderRadius: 16, padding: "2.25rem 2rem", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(16,185,129,0.2)", color: "#6ee7b7", padding: "0.25rem 0.75rem", borderRadius: 99, fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            🎮 TRY BEFORE YOU BUY
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "0.6rem" }}>
            Test the BudgetFlow Dashboard Live in Your Browser
          </h2>
          <p style={{ color: "#cbd5e1", fontSize: "0.95rem", maxWidth: 560, margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
            Experience how BudgetFlow turns a private Google Sheet into a sleek dark-mode personal finance app—for a single $15 one-time payment.
          </p>
          <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/#interactive-demo"
              style={{ background: "#fff", color: "#0f172a", padding: "0.8rem 1.5rem", borderRadius: 10, fontWeight: 800, fontSize: "0.92rem", textDecoration: "none" }}
            >
              🎮 Launch Interactive Demo →
            </Link>
            <Link
              href="https://mstudiofun.gumroad.com/l/nkrgwd"
              style={{ background: "#10b981", color: "#fff", padding: "0.8rem 1.5rem", borderRadius: 10, fontWeight: 800, fontSize: "0.92rem", textDecoration: "none" }}
            >
              ⬇️ Get Instant Access ($15 One-Time)
            </Link>
          </div>
        </div>

        {/* FAQ Section for Rich Snippets */}
        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "2rem", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "1.25rem" }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: "grid", gap: "1.25rem" }}>
            {article.faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: i < article.faqs.length - 1 ? "1px solid #f1f5f9" : "none", paddingBottom: i < article.faqs.length - 1 ? "1.1rem" : 0 }}>
                <h3 style={{ fontSize: "1.02rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem" }}>
                  {faq.q}
                </h3>
                <p style={{ fontSize: "0.94rem", color: "#475569", lineHeight: 1.65, margin: 0 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Organic Guides */}
        <section>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1rem", color: "#0f172a" }}>
            More Personal Finance & Privacy Guides
          </h3>
          <div style={{ display: "grid", gap: "0.85rem" }}>
            {relatedArticles.map((rel) => (
              <Link
                key={rel.slug}
                href={`/guides/${rel.slug}`}
                style={{ display: "block", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.1rem 1.35rem", textDecoration: "none", color: "#0f172a" }}
              >
                <div style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 700, marginBottom: 4 }}>
                  {rel.category} • {rel.readTime}
                </div>
                <div style={{ fontSize: "0.98rem", fontWeight: 700 }}>
                  {rel.title} →
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

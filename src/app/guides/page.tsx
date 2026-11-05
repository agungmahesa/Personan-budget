import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Personal Finance, Privacy Budgeting & Google Sheets Guides (2026)",
  description:
    "In-depth guides on privacy-first budgeting, one-time payment YNAB & Mint alternatives, Google Sheets personal finance templates, and net worth tracking.",
  alternates: {
    canonical: "https://personal-finance.mstudio.fun/guides",
  },
};

export default function GuidesIndexPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", color: "#0f172a", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Top Navbar */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "1rem 2rem", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontSize: "1.35rem", fontWeight: 900, color: "#10b981", textDecoration: "none" }}>
            BudgetFlow <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", marginLeft: 6 }}>GUIDES & RESEARCH</span>
          </Link>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <Link
              href="/#interactive-demo"
              style={{ padding: "0.5rem 1rem", borderRadius: 8, fontSize: "0.85rem", fontWeight: 600, color: "#0f172a", border: "1px solid #cbd5e1", textDecoration: "none" }}
            >
              🎮 Live Demo
            </Link>
            <Link
              href="/#pricing"
              style={{ padding: "0.5rem 1.1rem", borderRadius: 8, fontSize: "0.85rem", fontWeight: 700, background: "#10b981", color: "#fff", textDecoration: "none" }}
            >
              Get BudgetFlow — $15 →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "3.5rem 1.5rem 5rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-block", background: "#d1fae5", color: "#059669", fontSize: "0.75rem", fontWeight: 800, padding: "0.25rem 0.75rem", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
            2026 Personal Finance Knowledge Base
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.75rem)", fontWeight: 900, lineHeight: 1.2, marginBottom: "0.75rem", color: "#0f172a" }}>
            Privacy-First Budgeting & Google Sheets Finance Guides
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#475569", maxWidth: 720, lineHeight: 1.6 }}>
            Research, software benchmarks, and step-by-step blueprints for mastering your cash flow and net worth without paying $100+/year subscriptions or surrendering your bank passwords.
          </p>
        </div>

        {/* Articles Grid */}
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {ARTICLES.map((art) => (
            <article
              key={art.slug}
              style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "1.75rem 2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", fontSize: "0.78rem", color: "#64748b", marginBottom: "0.6rem" }}>
                <span style={{ background: "#f1f5f9", color: "#0f172a", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 6 }}>
                  {art.category}
                </span>
                <span>•</span>
                <span>{art.readTime}</span>
                <span>•</span>
                <span>Updated {art.updatedAt}</span>
              </div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.6rem", lineHeight: 1.35 }}>
                <Link href={`/guides/${art.slug}`} style={{ color: "#0f172a", textDecoration: "none" }}>
                  {art.title}
                </Link>
              </h2>
              <p style={{ fontSize: "0.95rem", color: "#475569", lineHeight: 1.65, marginBottom: "1.1rem" }}>
                {art.executiveSummary}
              </p>
              <Link
                href={`/guides/${art.slug}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.88rem", fontWeight: 700, color: "#059669", textDecoration: "none" }}
              >
                Read Full Guide & Comparison →
              </Link>
            </article>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div style={{ marginTop: "3.5rem", background: "linear-gradient(135deg, #0f172a, #1e3a5f)", color: "#fff", borderRadius: 18, padding: "2.5rem 2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: "0.6rem" }}>
            Ready to Ditch Monthly Finance Subscriptions?
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.98rem", maxWidth: 580, margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
            Try BudgetFlow live in your browser or get lifetime access for a one-time $15 payment. 100% private in your own Google Drive.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/#interactive-demo"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "0.85rem 1.75rem", borderRadius: 10, fontWeight: 700, textDecoration: "none" }}
            >
              🎮 Try Interactive Demo
            </Link>
            <Link
              href="https://mstudiofun.gumroad.com/l/nkrgwd"
              style={{ background: "#10b981", color: "#fff", padding: "0.85rem 1.75rem", borderRadius: 10, fontWeight: 800, textDecoration: "none" }}
            >
              ⬇️ Get BudgetFlow — $15 One-Time
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

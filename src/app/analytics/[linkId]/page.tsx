import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Globe, Tablet, Globe2, Calendar } from "lucide-react";

export default async function AnalyticsPage({
    params,
}: {
    params: Promise<{ linkId: string }>;
}) {
    const { linkId } = await params;

    const link = await prisma.link.findUnique({
        where: { id: linkId },
        include: {
            clicks: {
                orderBy: { timestamp: "desc" },
                take: 100,
            },
            _count: {
                select: { clicks: true },
            },
        },
    });

    if (!link)
        return (
            <main className="container">
                <p className="text-muted">Link not found.</p>
            </main>
        );

    const countryStats = link.clicks.reduce((acc: any, click) => {
        const key = click.country || "Unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const deviceStats = link.clicks.reduce((acc: any, click) => {
        const key = click.device || "Unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const topCountry =
        Object.keys(countryStats).sort(
            (a, b) => countryStats[b] - countryStats[a]
        )[0] || "N/A";

    const topDevice =
        Object.keys(deviceStats).sort(
            (a, b) => deviceStats[b] - deviceStats[a]
        )[0] || "N/A";

    const uniqueClicks = new Set(link.clicks.map((c) => c.ip)).size;

    return (
        <main className="container">
            <header className="header">
                <div className="flex items-center gap-4">
                    <Link href="/" className="analytics-back-btn">
                        <ArrowLeft size={22} />
                    </Link>
                    <h1 className="text-xl font-bold">
                        {link.title || link.slug}
                    </h1>
                </div>
                <span className="slug-badge">/{link.slug}</span>
            </header>

            {/* Stats */}
            <section className="dashboard-grid mb-8">
                <div className="card">
                    <div className="stat-icon-row">
                        <Calendar size={16} />
                        <span className="card-title">Total Clicks</span>
                    </div>
                    <div className="card-stats">{link._count.clicks}</div>
                </div>
                <div className="card">
                    <div className="stat-icon-row">
                        <Calendar size={16} />
                        <span className="card-title">Unique Clicks</span>
                    </div>
                    <div className="card-stats">{uniqueClicks}</div>
                </div>
                <div className="card">
                    <div className="stat-icon-row">
                        <Globe size={16} />
                        <span className="card-title">Top Country</span>
                    </div>
                    <div className="card-stats analytics-stat-value">{topCountry}</div>
                </div>
            </section>

            {/* Detail panels */}
            <div className="analytics-panels">
                {/* Geo breakdown */}
                <section className="card">
                    <h3 className="analytics-panel-title">
                        <Globe2 size={18} className="text-primary" />
                        Geographic Distribution
                    </h3>
                    <div className="analytics-list">
                        {Object.keys(countryStats).length === 0 ? (
                            <p className="text-muted text-sm">No clicks yet.</p>
                        ) : (
                            Object.entries(countryStats)
                                .sort(([, a]: any, [, b]: any) => b - a)
                                .map(([country, count]: any) => (
                                    <div key={country} className="analytics-bar-row">
                                        <span className="text-sm" style={{ minWidth: 60 }}>
                                            {country}
                                        </span>
                                        <div className="analytics-bar-track">
                                            <div
                                                className="analytics-bar-fill"
                                                style={{
                                                    width: `${
                                                        link._count.clicks > 0
                                                            ? (count / link._count.clicks) * 100
                                                            : 0
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted">{count}</span>
                                    </div>
                                ))
                        )}
                    </div>
                </section>

                {/* Recent clicks */}
                <section className="card">
                    <h3 className="analytics-panel-title">
                        <Calendar size={18} className="text-primary" />
                        Recent Clicks
                    </h3>
                    <div className="analytics-list">
                        {link.clicks.length === 0 ? (
                            <p className="text-muted text-sm">No clicks recorded yet.</p>
                        ) : (
                            link.clicks.slice(0, 10).map((click) => (
                                <div key={click.id} className="analytics-click-row">
                                    <div>
                                        <div className="text-sm font-semibold">{click.ip || "—"}</div>
                                        <div className="text-xs text-muted">
                                            {new Date(click.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div className="text-xs">{click.country || "—"}</div>
                                        <div className="text-xs text-muted">
                                            {click.referrer || "Direct"}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

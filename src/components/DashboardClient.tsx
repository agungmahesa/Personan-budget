"use client";

import { useState } from "react";
import Link from "next/link";
import { MousePointer2, Link as LinkIcon, BarChart3, Plus, ExternalLink, Settings } from "lucide-react";
import CreateLinkModal from "@/components/CreateLinkModal";
import RuleManagerModal from "@/components/RuleManagerModal";

interface Props {
    initialLinks: any[];
}

export default function DashboardClient({ initialLinks }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState<{ id: string; slug: string } | null>(null);

    const totalClicks = initialLinks.reduce(
        (acc: number, link: any) => acc + (link._count?.clicks || 0),
        0
    );

    const totalUniqueClicks = new Set(
        initialLinks.flatMap((link: any) => link.clicks?.map((c: any) => c.ip))
    ).size;

    const openRuleManager = (link: any) => {
        setSelectedLink({ id: link.id, slug: link.slug });
        setIsRuleModalOpen(true);
    };

    return (
        <main className="container">
            <header className="header">
                <div className="logo">Simple Affiliate</div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary"
                >
                    <Plus size={18} />
                    <span>Create Link</span>
                </button>
            </header>

            {/* Stats Row */}
            <section className="dashboard-grid mb-12">
                <div className="card">
                    <div className="stat-icon-row">
                        <LinkIcon size={16} />
                        <span className="card-title">Total Links</span>
                    </div>
                    <div className="card-stats">{initialLinks.length}</div>
                </div>
                <div className="card">
                    <div className="stat-icon-row">
                        <MousePointer2 size={16} />
                        <span className="card-title">Total Clicks</span>
                    </div>
                    <div className="card-stats">{totalClicks}</div>
                </div>
                <div className="card">
                    <div className="stat-icon-row">
                        <MousePointer2 size={16} />
                        <span className="card-title">Unique Clicks</span>
                    </div>
                    <div className="card-stats">{totalUniqueClicks}</div>
                </div>
            </section>

            {/* Links Section */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Your Links</h2>
                    <span className="text-sm text-muted">{initialLinks.length} links tracked</span>
                </div>

                <div className="dashboard-grid">
                    {initialLinks.map((link) => (
                        <div key={link.id} className="card">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold truncate pr-4">
                                    {link.title || link.slug}
                                </h3>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="click-badge">
                                        {link._count?.clicks || 0} total
                                    </span>
                                    <span className="click-badge" style={{ background: "rgba(99, 102, 241, 0.1)", color: "#818cf8", fontSize: "10px" }}>
                                        {new Set(link.clicks?.map((c: any) => c.ip)).size} unique
                                    </span>
                                </div>
                            </div>

                            <div className="text-sm text-muted mb-4 truncate italic">
                                {link.originalUrl}
                            </div>

                            <div className="link-card-footer">
                                <div className="flex items-center gap-2">
                                    <span className="slug-badge">/{link.slug}</span>
                                    <a
                                        href={`/${link.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="external-link-btn"
                                        title="Open short link"
                                    >
                                        <ExternalLink size={13} />
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openRuleManager(link)}
                                        className="analytics-btn"
                                        style={{ background: "#1e293b" }}
                                    >
                                        <Settings size={12} />
                                        <span>Rules</span>
                                    </button>
                                    <Link
                                        href={`/analytics/${link.id}`}
                                        className="analytics-btn"
                                    >
                                        <BarChart3 size={12} />
                                        <span>Analytics</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {initialLinks.length === 0 && (
                        <div className="card flex flex-col items-center justify-center p-12 text-center text-muted col-span-full border-dashed">
                            <LinkIcon size={48} style={{ opacity: 0.1, marginBottom: "1rem" }} />
                            <p>No links yet. Create your first affiliate link!</p>
                        </div>
                    )}
                </div>
            </section>

            <CreateLinkModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <RuleManagerModal
                isOpen={isRuleModalOpen}
                onClose={() => setIsRuleModalOpen(false)}
                linkId={selectedLink?.id || ""}
                linkSlug={selectedLink?.slug || ""}
            />
        </main>
    );
}

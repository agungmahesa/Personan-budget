"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";

export default function CreateLinkModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        originalUrl: "",
        slug: "",
        redirectType: 302,
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create link");
            }

            router.refresh();
            onClose();
            setFormData({ title: "", originalUrl: "", slug: "", redirectType: 302 });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Create New Affiliate Link</h2>
                    <button onClick={onClose} className="modal-close-btn" aria-label="Close">
                        <X size={22} />
                    </button>
                </div>

                {error && <div className="error-badge">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Title (Internal Name)</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g. Amazon Summer Deal"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Affiliate URL</label>
                        <input
                            type="url"
                            required
                            className="input"
                            placeholder="https://amazon.com/dp/..."
                            value={formData.originalUrl}
                            onChange={(e) =>
                                setFormData({ ...formData, originalUrl: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Custom Slug (Optional)</label>
                        <div className="flex items-center gap-2">
                            <span className="text-muted">/</span>
                            <input
                                type="text"
                                className="input"
                                placeholder="summer-deal"
                                value={formData.slug}
                                onChange={(e) =>
                                    setFormData({ ...formData, slug: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label">Redirect Type</label>
                        <select
                            className="input"
                            value={formData.redirectType}
                            onChange={(e) =>
                                setFormData({ ...formData, redirectType: parseInt(e.target.value) })
                            }
                        >
                            <option value={302}>302 (Temporary / Found) - Recommended for tracking</option>
                            <option value={301}>301 (Permanent Moved) - Good for SEO</option>
                        </select>
                        <p className="text-[10px] text-muted mt-1 italic">
                            *301 redirects are cached by browsers, which can affect real-time click tracking.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full mt-4"
                        style={{ justifyContent: "center" }}
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            "Create Link"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

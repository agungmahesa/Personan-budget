"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Globe, Tablet, Repeat, Trash2, Plus } from "lucide-react";

interface Rule {
    id: string;
    type: string;
    value: string;
    targetUrl: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    linkId: string;
    linkSlug: string;
}

export default function RuleManagerModal({ isOpen, onClose, linkId, linkSlug }: Props) {
    const [rules, setRules] = useState<Rule[]>([]);
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [newRule, setNewRule] = useState({
        type: "geo",
        value: "",
        targetUrl: "",
    });

    useEffect(() => {
        if (isOpen && linkId) {
            fetchRules();
        }
    }, [isOpen, linkId]);

    const fetchRules = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/links/${linkId}/rules`);
            const data = await res.json();
            setRules(data);
        } catch (error) {
            console.error("Failed to fetch rules", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRule = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdding(true);
        try {
            const res = await fetch(`/api/links/${linkId}/rules`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newRule),
            });
            if (res.ok) {
                setNewRule({ ...newRule, value: "", targetUrl: "" });
                fetchRules();
            }
        } catch (error) {
            console.error("Failed to add rule", error);
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteRule = async (ruleId: string) => {
        try {
            const res = await fetch(`/api/links/${linkId}/rules?ruleId=${ruleId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchRules();
            }
        } catch (error) {
            console.error("Failed to delete rule", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: "600px" }}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold">Manage Rules</h2>
                        <p className="text-xs text-muted">/{linkSlug}</p>
                    </div>
                    <button onClick={onClose} className="modal-close-btn" aria-label="Close">
                        <X size={22} />
                    </button>
                </div>

                {/* Rule List */}
                <div className="mb-8 max-h-[300px] overflow-y-auto pr-2">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 size={32} className="animate-spin text-primary" />
                        </div>
                    ) : rules.length === 0 ? (
                        <div className="text-center p-8 border border-dashed border-slate-700 rounded-lg text-muted">
                            <p>No rules configured yet.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {rules.map((rule) => (
                                <div key={rule.id} className="card flex items-center justify-between p-3" style={{ background: "#0f172a" }}>
                                    <div className="flex items-center gap-3">
                                        {rule.type === "geo" && <Globe size={18} className="text-primary" />}
                                        {rule.type === "device" && <Tablet size={18} className="text-indigo-400" />}
                                        {rule.type === "rotator" && <Repeat size={18} className="text-purple-400" />}
                                        <div>
                                            <div className="text-sm font-semibold capitalize">
                                                {rule.type}: <span className="text-white">{rule.value}</span>
                                            </div>
                                            <div className="text-[10px] text-muted truncate max-w-[200px]">
                                                {rule.targetUrl}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteRule(rule.id)}
                                        className="text-muted hover:text-error transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <hr className="border-slate-800 mb-6" />

                {/* Add Rule Form */}
                <div>
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                        <Plus size={16} />
                        Add New Rule
                    </h3>
                    <form onSubmit={handleAddRule} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group mb-0">
                                <label className="label">Type</label>
                                <select
                                    className="input"
                                    value={newRule.type}
                                    onChange={(e) => setNewRule({ ...newRule, type: e.target.value })}
                                >
                                    <option value="geo">Geo Location (Country Code)</option>
                                    <option value="device">Device Type</option>
                                    <option value="rotator">Rotator (Weight %)</option>
                                </select>
                            </div>
                            <div className="form-group mb-0">
                                <label className="label">Value</label>
                                <input
                                    className="input"
                                    placeholder={
                                        newRule.type === "geo" ? "e.g. US, UK, ID" :
                                        newRule.type === "device" ? "mobile or desktop" :
                                        "1-100"
                                    }
                                    required
                                    value={newRule.value}
                                    onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="label">Target URL</label>
                            <input
                                className="input"
                                type="url"
                                required
                                placeholder="https://specific-offer.com"
                                value={newRule.targetUrl}
                                onChange={(e) => setNewRule({ ...newRule, targetUrl: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={adding}
                            className="btn btn-primary w-full justify-center"
                        >
                            {adding ? <Loader2 size={18} className="animate-spin" /> : "Add Rule"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../components/Layout/Navbar";
import Footer from "../../components/Layout/Footer";

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
};

const AVATAR_COLORS = [
    "from-teal-500 to-teal-600",
    "from-emerald-500 to-emerald-600",
    "from-violet-500 to-violet-600",
    "from-amber-500 to-amber-600",
    "from-cyan-500 to-cyan-600",
];

const STATUS_BADGE = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-600 border-red-200",
};

const JobDetail = () => {
    const router = useRouter();
    const params = useParams();
    const jobId = params.id;

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        budget: "",
        deadline: "",
        category: "Web Development",
    });

    const categories = [
        "Web Development",
        "Design & Creative",
        "Writing & Content",
        "Marketing",
        "Video & Animation",
        "Audio & Music",
        "Translation",
        "Data Science",
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split(".")[1]));
                setUserRole(decoded.role);
                setUserId(decoded.id || decoded._id);
            } catch (err) {
                console.error("Invalid token");
            }
        }
    }, []);

    const fetchJob = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`
            );
            if (!response.ok) throw new Error("Failed to fetch job");
            const data = await response.json();
            setJob(data);
            setFormData({
                title: data.title,
                description: data.description,
                budget: data.budget,
                deadline: data.deadline.split("T")[0],
                category: data.category,
            });
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Could not load job details.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (jobId) fetchJob();
    }, [jobId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!formData.budget || Number(formData.budget) <= 0) {
            setError("Budget must be greater than 0.");
            return;
        }
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );
            if (!response.ok) throw new Error("Failed to update job");
            const updatedJob = await response.json();
            setJob(updatedJob);
            setIsEditing(false);
            setError(null);
        } catch (err) {
            setError("Failed to update job.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleBidAction = async (bidId, action) => {
        setActionLoading(bidId + action);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/bids/${bidId}/${action}`,
                {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || `Failed to ${action} bid`);
            // Refetch job to get updated bids
            await fetchJob();
        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const isOwner = job && job.client?._id === userId;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <main className="pt-24 pb-16">
                    <div className="container mx-auto px-4 text-center py-16">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Job not found</h3>
                        <button onClick={() => router.push("/jobs")} className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold">
                            Back to Jobs
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">

                    {/* Navigation */}
                    <div className="mb-6 flex items-center justify-between">
                        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            Back
                        </button>
                        <div className="flex gap-3">
                            {!isEditing && isOwner && (
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 text-teal-600 font-semibold hover:bg-teal-100 transition-colors">
                                    ✏️ Edit Job
                                </button>
                            )}
                            {!isEditing && userRole === "freelancer" && (
                                <button onClick={() => router.push(`/bid/${jobId}`)} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold hover:opacity-90">
                                    Submit a Proposal
                                </button>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
                    )}

                    {/* Job Card */}
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-14 h-14 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <div className="flex-1">
                                    {isEditing ? (
                                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full text-2xl font-bold text-slate-900 border-b-2 border-teal-500 focus:outline-none mb-2" />
                                    ) : (
                                        <h1 className="text-2xl font-bold text-slate-900 mb-1">{job.title}</h1>
                                    )}
                                    <p className="text-slate-500 text-sm">Posted by {job.client?.name || "Unknown Client"}</p>
                                </div>
                            </div>

                            {!isEditing && (
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-medium">{job.category}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${job.status === "open" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                            job.status === "in-progress" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                "bg-slate-100 text-slate-600 border-slate-200"
                                        }`}>{job.status}</span>
                                </div>
                            )}
                        </div>

                        <hr className="my-6 border-slate-100" />

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Budget</p>
                                {isEditing ? (
                                    <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} min="1" className="w-full text-xl font-bold text-teal-600 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                ) : (
                                    <p className="text-xl font-bold text-teal-600">₹{job.budget?.toLocaleString()}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Deadline</p>
                                {isEditing ? (
                                    <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="w-full text-lg font-bold text-slate-900 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                ) : (
                                    <p className="text-lg font-bold text-slate-900">{formatDate(job.deadline)}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Proposals</p>
                                <p className="text-xl font-bold text-slate-900">{job.bids?.length || 0}</p>
                            </div>
                        </div>

                        {/* Category (editing) */}
                        {isEditing && (
                            <div className="mb-6">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Category</p>
                                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500">
                                    {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                                </select>
                            </div>
                        )}

                        <hr className="my-6 border-slate-100" />

                        {/* Description */}
                        <div className="mb-6">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Description</p>
                            {isEditing ? (
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="6" className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                            ) : (
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                            )}
                        </div>

                        {/* Edit Actions */}
                        {isEditing && (
                            <div className="flex gap-4 justify-end">
                                <button onClick={() => { setIsEditing(false); setFormData({ title: job.title, description: job.description, budget: job.budget, deadline: job.deadline.split("T")[0], category: job.category }); }} className="px-6 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold hover:bg-slate-50">Cancel</button>
                                <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold disabled:opacity-50">{isSaving ? "Saving..." : "Save Changes"}</button>
                            </div>
                        )}
                    </div>

                    {/* Proposals Section — Only visible to the job owner (client) */}
                    {isOwner && !isEditing && job.bids && job.bids.length > 0 && (
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">
                                Proposals ({job.bids.length})
                            </h3>

                            <div className="space-y-4">
                                {job.bids.map((bid, index) => {
                                    const name = bid.freelancer?.name || "Unknown";
                                    const initials = getInitials(name);
                                    const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
                                    const badgeClass = STATUS_BADGE[bid.status] || STATUS_BADGE.pending;

                                    return (
                                        <div key={bid._id} className="p-5 rounded-xl border border-slate-200 hover:shadow-sm transition-all">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                                                    {initials}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-3">
                                                            <p className="font-semibold text-slate-900">{name}</p>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${badgeClass}`}>
                                                                {bid.status}
                                                            </span>
                                                        </div>
                                                        <p className="font-bold text-lg text-slate-900">₹{bid.amount?.toLocaleString()}</p>
                                                    </div>

                                                    {bid.freelancer?.skills && bid.freelancer.skills.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                            {bid.freelancer.skills.slice(0, 4).map((skill, i) => (
                                                                <span key={i} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">{skill}</span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{bid.message}</p>

                                                    <div className="flex items-center justify-between">
                                                        <p className="text-xs text-slate-400">{formatDate(bid.createdAt)}</p>

                                                        {bid.status === "pending" && job.status === "open" && (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleBidAction(bid._id, "accept")}
                                                                    disabled={actionLoading === bid._id + "accept"}
                                                                    className="px-4 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                                                                >
                                                                    {actionLoading === bid._id + "accept" ? "..." : "✓ Accept"}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleBidAction(bid._id, "reject")}
                                                                    disabled={actionLoading === bid._id + "reject"}
                                                                    className="px-4 py-1.5 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                                                                >
                                                                    {actionLoading === bid._id + "reject" ? "..." : "✗ Reject"}
                                                                </button>
                                                            </div>
                                                        )}

                                                        {bid.status === "accepted" && (
                                                            <span className="text-emerald-600 text-sm font-medium">✓ Hired</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Empty bids for owner */}
                    {isOwner && !isEditing && (!job.bids || job.bids.length === 0) && (
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
                            <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">No proposals yet</h3>
                            <p className="text-slate-500 text-sm">Freelancers will see your job on the Browse Jobs page and submit their proposals here.</p>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default JobDetail;

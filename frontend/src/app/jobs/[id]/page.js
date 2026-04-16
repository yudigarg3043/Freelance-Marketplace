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

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        budget: "",
        deadline: "",
        completionDeadline: "",
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
                deadline: data.deadline.slice(0, 16),
                completionDeadline: data.completionDeadline?.slice(0, 16) || "",
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

        if (new Date(formData.deadline) >= new Date(formData.completionDeadline)) {
            setError("Bidding deadline must be before project completion deadline.");
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
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to update job");
            }
            const updatedJob = await response.json();
            setJob(updatedJob);
            setIsEditing(false);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to update job.");
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

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setActionLoading("submittingReview");
        try {
            const token = localStorage.getItem("token");
            // Determine who to review:
            // If current user is client, review the hired freelancer.
            // If current user is freelancer, review the client.
            const revieweeId = isOwner ? job.acceptedBid?.freelancer?._id : job.client?._id;

            if (!revieweeId) throw new Error("Could not determine user to review");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    jobId: job._id,
                    revieweeId,
                    rating: reviewForm.rating,
                    comment: reviewForm.comment
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to submit review");

            setReviewSubmitted(true);
            setHasReviewed(true);
            setTimeout(() => {
                setShowReviewModal(false);
            }, 2000);
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
                            {userRole === "freelancer" && job.status === "open" && !isEditing && (
                                <button onClick={() => router.push(`/bid/${jobId}`)} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold hover:opacity-90">
                                    Submit a Proposal
                                </button>
                            )}
                            {job.status === "completed" && !hasReviewed && (
                                <button 
                                    onClick={() => setShowReviewModal(true)} 
                                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200"
                                >
                                    ⭐ Leave a Review
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Budget</p>
                                {isEditing ? (
                                    <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} min="1" className="w-full text-xl font-bold text-teal-600 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                ) : (
                                    <p className="text-xl font-bold text-teal-600">₹{job.budget?.toLocaleString()}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Bid Deadline</p>
                                {isEditing ? (
                                    <input type="datetime-local" name="deadline" value={formData.deadline} onChange={handleInputChange} className="w-full text-sm font-bold text-slate-900 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                ) : (
                                    <p className="text-sm font-bold text-slate-900">{new Date(job.deadline).toLocaleString()}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Project Deadline</p>
                                {isEditing ? (
                                    <input type="datetime-local" name="completionDeadline" value={formData.completionDeadline} onChange={handleInputChange} className="w-full text-sm font-bold text-slate-900 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                ) : (
                                    <p className="text-sm font-bold text-slate-900">{job.completionDeadline ? new Date(job.completionDeadline).toLocaleString() : "N/A"}</p>
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

                        {/* Attachments Section */}
                        {job.attachments && job.attachments.length > 0 && (
                            <div className="mb-6">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Attachments</p>
                                <div className="flex flex-wrap gap-4">
                                    {job.attachments.map((url, i) => (
                                        <a 
                                            key={i} 
                                            href={url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-teal-500 transition-all group"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-teal-600 shadow-sm group-hover:bg-teal-50 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs font-bold text-slate-900 group-hover:text-teal-600 transition-colors">Attachment {i + 1}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Click to View</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Edit Actions */}
                        {isEditing && (
                            <div className="flex gap-4 justify-end">
                                <button onClick={() => { setIsEditing(false); setFormData({ title: job.title, description: job.description, budget: job.budget, deadline: job.deadline.slice(0, 16), completionDeadline: job.completionDeadline?.slice(0, 16) || "", category: job.category }); }} className="px-6 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold hover:bg-slate-50">Cancel</button>
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
                                        <div 
                                            key={bid._id} 
                                            onClick={() => router.push(`/profile/${bid.freelancer?._id}`)}
                                            className="p-5 rounded-xl border border-slate-200 hover:shadow-md hover:border-teal-500 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm`}>
                                                    {initials}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-3">
                                                            <p className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{name}</p>
                                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeClass}`}>
                                                                {bid.status}
                                                            </span>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-black text-xl text-slate-900 leading-none mb-1">₹{bid.amount?.toLocaleString()}</p>
                                                            {bid.deliveryTime && (
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-end gap-1">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                    {bid.deliveryTime} Days Delivery
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
 
                                                    {bid.freelancer?.skills && bid.freelancer.skills.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                                            {bid.freelancer.skills.slice(0, 5).map((skill, i) => (
                                                                <span key={i} className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 text-[10px] font-bold border border-slate-100 uppercase tracking-tighter transition-colors group-hover:bg-white">{skill}</span>
                                                            ))}
                                                        </div>
                                                    )}
 
                                                    <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">{bid.message}</p>
 
                                                    {bid.attachments && bid.attachments.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mb-4" onClick={(e) => e.stopPropagation()}>
                                                            {bid.attachments.map((url, i) => (
                                                                <a 
                                                                    key={i} 
                                                                    href={url} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-500 hover:bg-white hover:border-teal-500 transition-all flex items-center gap-2"
                                                                >
                                                                    <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                                    PropDocument_{i + 1}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
 
                                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50" onClick={(e) => e.stopPropagation()}>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(bid.createdAt)}</p>
 
                                                        {bid.status === "pending" && job.status === "open" && (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleBidAction(bid._id, "accept")}
                                                                    disabled={actionLoading === bid._id + "accept"}
                                                                    className="px-5 py-2 rounded-xl bg-[#14A887] text-white text-xs font-black shadow-lg shadow-emerald-200 hover:bg-[#108A6F] transition-all disabled:opacity-50"
                                                                >
                                                                    {actionLoading === bid._id + "accept" ? "..." : "HIRE FREELANCER"}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleBidAction(bid._id, "reject")}
                                                                    disabled={actionLoading === bid._id + "reject"}
                                                                    className="px-5 py-2 rounded-xl border-2 border-red-50 text-red-600 text-xs font-black hover:bg-red-50 transition-all disabled:opacity-50"
                                                                >
                                                                    {actionLoading === bid._id + "reject" ? "..." : "PASS"}
                                                                </button>
                                                            </div>
                                                        )}
 
                                                        {bid.status === "accepted" && (
                                                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                                                <span className="text-[10px] font-black uppercase tracking-wider">Hired for project</span>
                                                            </div>
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

                    {/* Review Modal */}
                    {showReviewModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
                            <div className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full p-8 md:p-10 transform scale-100 animate-in zoom-in-95 duration-200">
                                {reviewSubmitted ? (
                                    <div className="text-center py-10">
                                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Review Submitted!</h2>
                                        <p className="text-slate-500">Your feedback has been published successfully.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="text-2xl font-black text-slate-900">Leave a Review</h2>
                                            <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>

                                        <form onSubmit={handleReviewSubmit} className="space-y-8">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-4">How was your experience?</label>
                                                <div className="flex gap-3 justify-center">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                                                                reviewForm.rating >= star 
                                                                ? "bg-amber-400 text-white shadow-lg shadow-amber-400/20" 
                                                                : "bg-slate-100 text-slate-400"
                                                            }`}
                                                        >
                                                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Share your thoughts</label>
                                                <textarea
                                                    required
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-900 focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium resize-none"
                                                    rows={4}
                                                    placeholder="Describe the quality of work, communication, and professionalism..."
                                                    value={reviewForm.comment}
                                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={actionLoading === "submittingReview"}
                                                className="w-full py-5 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                            >
                                                {actionLoading === "submittingReview" ? (
                                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                ) : (
                                                    "Publish Review"
                                                )}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default JobDetail;

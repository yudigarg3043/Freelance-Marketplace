"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "../../components/Layout/DashboardSidebar";

const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
};

const AVATAR_COLORS = [
  "from-teal-500 to-teal-600",
  "from-emerald-500 to-emerald-600",
  "from-violet-500 to-violet-600",
  "from-amber-500 to-amber-600",
  "from-cyan-500 to-cyan-600",
];

const BID_STATUS = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_CONFIG = {
  open: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Open" },
  "in-progress": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "In Progress" },
  completed: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", label: "Completed" },
};

export default function ClientProjects() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [expandedJob, setExpandedJob] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchJobs = async () => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/client`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setJobs(data.allJobs || []);
    } catch (err) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [router]);

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
      await fetchJobs();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredJobs = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);
  const displayedJobs = showAll ? filteredJobs : filteredJobs.slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar role="client" />

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-slate-900">My Projects</h1>
          <button
            onClick={() => router.push("/post-job")}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white text-sm font-semibold hover:opacity-90 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Post New Job
          </button>
        </header>

        <main className="p-6 flex-1 overflow-auto">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {["all", "open", "in-progress", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setShowAll(false); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f
                    ? "bg-teal-500 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1).replace("-", " ")}
              </button>
            ))}
          </div>

          {/* Jobs List */}
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No projects found</h3>
              <p className="text-slate-500 text-sm mb-4">Post your first job to get started.</p>
              <button
                onClick={() => router.push("/post-job")}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold"
              >
                Post a Job
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedJobs.map((job) => {
                const statusStyle = STATUS_CONFIG[job.status] || STATUS_CONFIG.open;
                const pendingCount = job.bids?.filter((b) => b.status === "pending").length || 0;
                const isExpanded = expandedJob === job._id;

                return (
                  <div key={job._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-sm transition">
                    {/* Job Header - Clickable to expand */}
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => setExpandedJob(isExpanded ? null : job._id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                              {statusStyle.label}
                            </span>
                            {pendingCount > 0 && (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse">
                                {pendingCount} new
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-slate-500 line-clamp-2 mb-3">{job.description}</p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              ₹{job.budget?.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              {new Date(job.deadline).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                              {job.bids?.length || 0} proposals
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs text-slate-600">{job.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/jobs/${job._id}`);
                            }}
                            className="px-3 py-1.5 rounded-lg text-sm text-teal-600 hover:bg-teal-50 font-medium transition"
                          >
                            View
                          </button>
                          <svg className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Bids Section */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/50">
                        {!job.bids || job.bids.length === 0 ? (
                          <div className="p-6 text-center">
                            <p className="text-sm text-slate-500">No proposals received yet.</p>
                          </div>
                        ) : (
                          <div className="p-6 space-y-3">
                            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                              Proposals ({job.bids.length})
                            </h4>
                            {job.bids.slice(0, 3).map((bid, index) => {
                              const name = bid.freelancer?.name || "Unknown";
                              const initials = getInitials(name);
                              const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
                              const badgeClass = BID_STATUS[bid.status] || BID_STATUS.pending;

                              return (
                                <div
                                  key={bid._id}
                                  className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-sm transition"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                                      {initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                          <p className="font-semibold text-slate-900 text-sm">{name}</p>
                                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${badgeClass}`}>
                                            {bid.status}
                                          </span>
                                        </div>
                                        <p className="font-bold text-slate-900">₹{bid.amount?.toLocaleString()}</p>
                                      </div>

                                      {bid.freelancer?.skills && bid.freelancer.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-2">
                                          {bid.freelancer.skills.slice(0, 4).map((skill, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs">{skill}</span>
                                          ))}
                                        </div>
                                      )}

                                      <p className="text-sm text-slate-600 line-clamp-2 mb-2">{bid.message}</p>

                                      <div className="flex items-center justify-between">
                                        <p className="text-xs text-slate-400">
                                          {new Date(bid.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </p>

                                        {bid.status === "pending" && job.status === "open" && (
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() => handleBidAction(bid._id, "accept")}
                                              disabled={actionLoading === bid._id + "accept"}
                                              className="px-4 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition disabled:opacity-50"
                                            >
                                              {actionLoading === bid._id + "accept" ? "..." : "✓ Accept"}
                                            </button>
                                            <button
                                              onClick={() => handleBidAction(bid._id, "reject")}
                                              disabled={actionLoading === bid._id + "reject"}
                                              className="px-4 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition disabled:opacity-50"
                                            >
                                              {actionLoading === bid._id + "reject" ? "..." : "✗ Reject"}
                                            </button>
                                          </div>
                                        )}

                                        {bid.status === "accepted" && (
                                          <span className="text-emerald-600 text-xs font-semibold">✓ Hired</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {filteredJobs.length > 6 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-semibold hover:border-teal-500 hover:text-teal-600 transition-all duration-300 flex items-center gap-2"
              >
                {showAll ? "View Less" : `View More (${filteredJobs.length - 6} more)`}
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

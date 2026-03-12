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

export default function BidsReceived() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const fetchData = async () => {
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

  useEffect(() => { fetchData(); }, [router]);

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
      await fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Flatten all bids across jobs
  const allBids = jobs.flatMap((job) =>
    (job.bids || []).map((bid) => ({ ...bid, jobTitle: job.title, jobId: job._id, jobStatus: job.status }))
  );

  const filteredBids =
    filter === "all"
      ? allBids
      : allBids.filter((b) => b.status === filter);

  const pendingCount = allBids.filter((b) => b.status === "pending").length;

  const sortedBids = [...filteredBids].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "low-high") return (a.amount || 0) - (b.amount || 0);
    if (sortBy === "high-low") return (b.amount || 0) - (a.amount || 0);
    return 0;
  });

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
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-slate-900">Bids Received</h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse">
                {pendingCount} new
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">{allBids.length} total proposals</p>
        </header>

        <main className="p-6 flex-1 overflow-auto">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {["all", "pending", "accepted", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f
                    ? "bg-teal-500 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === "pending" && pendingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="low-high">Amount: Low to High</option>
              <option value="high-low">Amount: High to Low</option>
            </select>
          </div>

          {/* Bids List */}
          {filteredBids.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No bids found</h3>
              <p className="text-slate-500 text-sm">No proposals match this filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedBids.map((bid, index) => {
                const name = bid.freelancer?.name || "Unknown";
                const initials = getInitials(name);
                const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
                const badgeClass = BID_STATUS[bid.status] || BID_STATUS.pending;

                return (
                  <div
                    key={bid._id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-sm transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-slate-900">{name}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${badgeClass}`}>
                              {bid.status}
                            </span>
                          </div>
                          <p className="font-bold text-lg text-slate-900">₹{bid.amount?.toLocaleString()}</p>
                        </div>

                        <p
                          className="text-sm text-teal-600 font-medium mb-1 hover:underline cursor-pointer"
                          onClick={() => router.push(`/jobs/${bid.jobId}`)}
                        >
                          {bid.jobTitle}
                        </p>

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

                          {bid.status === "pending" && bid.jobStatus === "open" && (
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
        </main>
      </div>
    </div>
  );
}

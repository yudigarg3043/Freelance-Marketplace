"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../components/Layout/Navbar";
import Footer from "../../components/Layout/Footer";

// Helper to get initials from a name
const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
};

// Avatar gradient colors
const AVATAR_COLORS = [
  "from-teal-500 to-teal-600",
  "from-emerald-500 to-emerald-600",
  "from-teal-600 to-teal-700",
  "from-emerald-600 to-emerald-700",
  "from-cyan-500 to-cyan-600",
];

export default function BidPage() {
  const router = useRouter();
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const [formData, setFormData] = useState({
    amount: "",
    deliveryTime: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Platform fee calculation (e.g., 10%)
  const PLATFORM_FEE_PERCENT = 10;
  const platformFee = formData.amount ? (Number(formData.amount) * (PLATFORM_FEE_PERCENT / 100)).toFixed(2) : "0.00";
  const takeHome = formData.amount ? (Number(formData.amount) - Number(platformFee)).toFixed(2) : "0.00";

  useEffect(() => {
    // 1. Check Auth and Role
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      if (decoded.role !== "freelancer") {
        setError("Only freelancers can place bids.");
        setLoading(false);
        return;
      }
      setUserRole(decoded.role);
    } catch (err) {
      router.push("/login");
      return;
    }

    // 2. Fetch Job Details
    const fetchJob = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch job");
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        console.error(err);
        setError("Could not load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.message) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId: id,
          amount: Number(formData.amount),
          deliveryTime: Number(formData.deliveryTime),
          message: formData.message
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit bid");
      }

      setSubmitted(true);
      setTimeout(() => {
        router.push("/dashboard/myBids");
      }, 2000);

    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-900">Job Not Found</h1>
            </div>
            <p className="text-red-500 mt-4">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white p-10 rounded-3xl shadow-lg border border-slate-100 text-center max-w-md w-full mx-4 transform transition-all scale-100">
            <div className="w-20 h-20 rounded-full bg-teal-50 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Bid Submitted!</h2>
            <p className="text-slate-500 mb-6">Your proposal has been successfully sent to the client.</p>
            <div className="animate-pulse flex items-center justify-center gap-2 text-sm text-teal-600 font-medium">
              <div className="w-4 h-4 rounded-full border-2 border-teal-600 border-t-transparent animate-spin"></div>
              Redirecting to dashboard...
            </div>
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

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-4 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Top Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
            <div className="flex gap-4 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">

            {/* Left Column: Current Bids */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Current Bids</h2>
                <p className="text-sm text-slate-500 mb-6">{job.bids?.length || 0} proposals submitted</p>

                {(!job.bids || job.bids.length === 0) ? (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <p className="text-sm text-slate-500">No bids yet.</p>
                    <p className="text-xs text-slate-400 mt-1">Be the first to submit a proposal!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {job.bids.map((bid, index) => {
                      const name = bid.freelancer?.name || "Unknown";
                      const initials = getInitials(name);
                      const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
                      return (
                        <div key={bid._id} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all bg-white">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold leading-none`}>
                              {initials}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <p className="font-semibold text-slate-900 text-sm">{name}</p>
                                <p className="font-bold text-slate-900 text-sm">₹{bid.amount?.toLocaleString()}</p>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-xs text-slate-500 capitalize">{bid.status}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Bid Form */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Place Your Bid</h2>
                  <p className="text-slate-500">Submit your proposal and bid amount for this job.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Bid Amount */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Bid Amount (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
                        placeholder="Enter your bid amount"
                      />
                    </div>
                  </div>

                  {/* Delivery Time */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Delivery Time (days) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
                      placeholder="How many days to complete?"
                    />
                  </div>

                  {/* Proposal Textarea */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Your Proposal <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-y placeholder-slate-400"
                      placeholder="Describe why you're the best fit for this job, your approach, and relevant experience..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="flex-1 py-3 px-6 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-3 px-6 rounded-xl bg-[#14A887] text-white font-semibold hover:bg-[#108A6F] transition-colors disabled:opacity-50 flex justify-center items-center"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Submit Bid"
                      )}
                    </button>
                  </div>
                </form>

              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
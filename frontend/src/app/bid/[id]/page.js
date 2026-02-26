"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../components/Layout/Navbar";
import Footer from "../../components/Layout/Footer";

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
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-red-600 mb-2">Access Denied</h3>
            <p className="text-slate-600 mb-6">{error || "Job not found"}</p>
            <button onClick={() => router.push("/jobs")} className="px-6 py-2 bg-slate-900 text-white rounded-xl">
              Back to Jobs
            </button>
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
            <div className="w-20 h-20 rounded-full bg-emerald-100 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Proposal Submitted!</h2>
            <p className="text-slate-500 mb-6">Your bid has been successfully sent to the client.</p>
            <div className="animate-pulse flex items-center justify-center gap-2 text-sm text-teal-600 font-medium">
              <div className="w-4 h-4 rounded-full border-2 border-teal-600 border-t-transparent animate-spin"></div>
              Redirecting to your dashboard...
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">

          {/* Navigation */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Job
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Submit a Proposal</h1>
            <p className="text-slate-500">You are bidding on <span className="font-semibold text-slate-900">{job.title}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Bid Terms Section */}
            <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Rate and Terms
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">What is the full amount you'd like to bid for this job?</label>
                  <p className="text-sm text-slate-500 mb-4">Client's budget is ₹{job.budget?.toLocaleString()}</p>

                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex-1">
                      <span className="font-semibold text-slate-900 block mb-1">Bid Amount</span>
                      <span className="text-sm text-slate-500">Total amount the client will see</span>
                    </div>
                    <div className="relative w-full sm:w-48">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all font-semibold"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between p-4 pl-8 border-l-4 border-slate-200">
                  <div className="flex-1">
                    <span className="font-medium text-slate-700 block mb-1">Platform Fee ({PLATFORM_FEE_PERCENT}%)</span>
                  </div>
                  <div className="w-full sm:w-48 text-right pr-4">
                    <span className="font-medium text-slate-500">- ₹{platformFee}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between p-4 bg-teal-50 border border-teal-100 rounded-xl">
                  <div className="flex-1">
                    <span className="font-bold text-teal-900 block mb-1">You'll Receive</span>
                    <span className="text-sm text-teal-700">The estimated amount you'll take home</span>
                  </div>
                  <div className="w-full sm:w-48 text-right pr-4">
                    <span className="font-bold text-xl text-teal-700">₹{takeHome}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">How long will this project take?</label>
                  <div className="flex items-center gap-3 w-full sm:w-64">
                    <input
                      type="number"
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g. 7"
                    />
                    <span className="text-slate-600 font-medium">Days</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Cover Letter Section */}
            <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Cover Letter
              </h2>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Introduce yourself and explain why you're a strong candidate for this job.</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-y"
                  placeholder="Hi there! I read your job posting carefully and I'm confident I can help you because..."
                />
              </div>
            </section>

            {/* Actions */}
            <div className="flex gap-4 justify-end pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Proposal"
                )}
              </button>
            </div>

          </form>

        </div>
      </main>
      <Footer />
    </div>
  );
}
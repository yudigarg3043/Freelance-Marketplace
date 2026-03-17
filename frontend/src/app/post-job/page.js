"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

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

const PostJob = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
    completionDeadline: "",
  });

  useEffect(() => {
    const checkRole = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setShowPopup(true);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          setShowPopup(true);
          return;
        }

        const data = await res.json();

        if (data.user.role !== "client") {
          setShowPopup(true);
        }
      } catch (err) {
        setShowPopup(true);
      }
    };

    checkRole();
  }, []);

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showPopup]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (new Date(formData.deadline) >= new Date(formData.completionDeadline)) {
      setError("Bidding deadline must be before project completion deadline.");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            budget: Number(formData.budget),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      router.push(`/jobs/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-slate-300";

  const textareaClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none shadow-sm hover:border-slate-300";

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center animate-fadeIn">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Access Restricted
            </h2>

            <p className="text-slate-600 mb-6">
              Only clients can post jobs.
            </p>

            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />

        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Page Header */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm font-bold tracking-wide uppercase mb-4 shadow-sm border border-teal-100">
                New Opportunity
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                Post a Job
              </h1>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">
                Fill in the details below to find the best global talent for your project.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-4 animate-shake">
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="font-semibold">{error}</p>
                </div>
              )}

              {/* Step 1: Core Details */}
              <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Project Identity</h2>
                    <p className="text-slate-500 font-medium">Define the core aspects of your job</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Job Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Senior Frontend Engineer for Fintech Dashboard"
                      className="w-full h-14 px-6 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium text-lg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Job Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the challenges, tech stack, and goals..."
                      rows={6}
                      className="w-full px-6 py-5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium resize-none leading-relaxed"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Industry Category</label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full h-14 px-6 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-semibold appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Choose a specialized field</option>
                        {categories.map((cat, index) => (
                          <option key={index} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Financials & Timeline */}
              <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Financials & Logistics</h2>
                    <p className="text-slate-500 font-medium">Set your budget and critical milestones</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1 text-emerald-600">Estimated Budget (₹)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-emerald-600 font-bold text-xl">₹</div>
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        min="1"
                        placeholder="0.00"
                        className="w-full h-16 pl-12 pr-6 rounded-2xl border border-emerald-100 bg-emerald-50/30 text-emerald-700 placeholder:text-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-black text-2xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Bidding Closes On</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full h-14 px-6 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Project Expected Done By</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        name="completionDeadline"
                        value={formData.completionDeadline}
                        onChange={handleChange}
                        min={formData.deadline || new Date().toISOString().slice(0, 16)}
                        className="w-full h-14 px-6 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-semibold"
                        required
                      />
                    </div>
                    {formData.deadline && formData.completionDeadline && (
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2 ml-1">
                        Timeline Span: {Math.max(0, Math.floor((new Date(formData.completionDeadline) - new Date(formData.deadline))/(1000*60*60*24)))} Days
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto px-10 h-14 rounded-2xl border-2 border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50 active:scale-95 transition-all"
                >
                  Discard Draft
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-12 h-14 rounded-2xl bg-[#14A887] text-white font-black text-lg hover:bg-[#108A6F] shadow-xl shadow-teal-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Launch Project</span>
                      <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>

        <Footer />
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </>
  );
};

export default PostJob;

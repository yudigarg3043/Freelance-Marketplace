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

      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="pt-24 pb-16">
          <div className="bg-slate-100 py-12 mb-8">
            <div className="container mx-auto px-3">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Post a New Job
              </h1>
              <p className="text-slate-500 max-w-2xl">
                Find the perfect freelancer for your project.
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
                  {error}
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  Job Details
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Senior React Developer for SaaS Platform"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your project requirements..."
                      rows={6}
                      className={textareaClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  Budget & Deadline
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Budget (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      min="1"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Deadline <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="h-12 px-6 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 px-8 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Posting..." : "Post Job"}
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

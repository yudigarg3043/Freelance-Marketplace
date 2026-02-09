"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

const PostJob = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budgetType: "fixed",
    budget: "",
    deadline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError("You must be logged in to post a job.");
        setIsLoading(false);
        return;
      }


      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          budget: Number(formData.budget),
          deadline: formData.deadline
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      console.log("Job posted successfully:", data);
      router.push("/jobs");
      
    } catch (err) {
      console.log("Error posting job:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="bg-slate-100 py-12 mb-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Post a New Job
            </h1>
            <p className="text-slate-500 max-w-2xl">
              Find the perfect freelancer for your project. Fill in the details below to get started.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            
            {/* Error Message Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-teal-700 text-white flex items-center justify-center text-sm font-bold">1</span>
                Job Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Senior React Developer for E-commerce Platform"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your project in detail. Include requirements, deliverables, and any specific skills needed..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-teal-700 text-white flex items-center justify-center text-sm font-bold">2</span>
                Budget & Deadline
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Budget Type *
                  </label>
                  <div className="flex gap-4">
                    <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.budgetType === "fixed" ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:border-slate-300"}`}>
                      <input
                        type="radio"
                        name="budgetType"
                        value="fixed"
                        checked={formData.budgetType === "fixed"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.budgetType === "fixed" ? "border-teal-500" : "border-slate-300"}`}>
                          {formData.budgetType === "fixed" && <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Fixed Price</p>
                          <p className="text-sm text-slate-500">Pay a set amount for the entire project</p>
                        </div>
                      </div>
                    </label>
                    <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.budgetType === "hourly" ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:border-slate-300"}`}>
                      <input
                        type="radio"
                        name="budgetType"
                        value="hourly"
                        checked={formData.budgetType === "hourly"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.budgetType === "hourly" ? "border-teal-500" : "border-slate-300"}`}>
                          {formData.budgetType === "hourly" && <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Hourly Rate</p>
                          <p className="text-sm text-slate-500">Pay by the hour for ongoing work</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {formData.budgetType === "fixed" ? "Budget ($) *" : "Hourly Rate ($) *"}
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder={formData.budgetType === "fixed" ? "e.g. 5000" : "e.g. 50"}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isLoading}
                className="h-12 px-6 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="h-12 px-8 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Posting...' : 'Post Job'}
                {!isLoading && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostJob;
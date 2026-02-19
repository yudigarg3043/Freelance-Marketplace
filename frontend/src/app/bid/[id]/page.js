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

const BidPage = () => {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    message: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch job");
        }
        const data = await response.json();
        setJob(data);
        setFormData((prev) => ({
          ...prev,
          amount: data.budget,
        }));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Could not load job details. Please try again later.");
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Bid amount must be greater than 0.");
      return;
    }

    if (Number(formData.amount) > job.budget) {
      setError(`Bid amount cannot exceed the job budget of ₹${job.budget.toLocaleString()}.`);
      return;
    }

    if (!formData.message || formData.message.trim() === "") {
      setError("Please provide a message with your bid.");
      return;
    }

    if (formData.message.trim().length < 10) {
      setError("Message must be at least 10 characters long.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to be logged in to place a bid.");
        setSubmitting(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bids`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobId: jobId,
            amount: Number(formData.amount),
            message: formData.message,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit bid");
      }

      const bidData = await response.json();
      setSuccessMessage("Your bid has been submitted successfully!");
      setFormData({
        amount: "",
        message: "",
      });

      setTimeout(() => {
        router.push("/dashboard/freelancer");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to submit bid. Please try again.");
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

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Job not found
              </h3>
              <p className="text-slate-500 mb-6">
                The job you're looking for doesn't exist.
              </p>
              <button
                onClick={() => router.push("/jobs")}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Back to Jobs
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Job Details Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                {/* Header Section */}
                <div className="mb-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-8 h-8 text-teal-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        {job.title}
                      </h1>
                      <p className="text-slate-500">
                        Posted by {job.client?.name || "Unknown Client"}
                      </p>
                      <p className="text-sm text-slate-400 mt-2">
                        Job ID: {job._id}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-medium">
                      {job.category}
                    </span>
                    <span className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                      Fixed Price
                    </span>
                  </div>
                </div>

                <hr className="my-8 border-slate-200" />

                {/* Job Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Budget
                    </p>
                    <p className="text-2xl font-bold text-teal-600">
                      ₹{job.budget.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Deadline
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatDate(job.deadline)}
                    </p>
                  </div>
                </div>

                <hr className="my-8 border-slate-200" />

                {/* Description */}
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Description
                  </h2>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Bid Form Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-28">
                <h2 className="text-lg font-bold text-slate-900 mb-6">
                  Place Your Bid
                </h2>

                <form onSubmit={handleSubmitBid} className="space-y-6">
                  {/* Bid Amount */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Bid Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-500 font-semibold">
                        ₹
                      </span>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        min="1"
                        max={job.budget}
                        step="1"
                        placeholder="Enter your bid amount"
                        className="w-full pl-7 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Maximum bid: ₹{job.budget.toLocaleString()}
                    </p>
                  </div>

                  {/* Bid Progress */}
                  {formData.amount && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-slate-600">
                          {Math.round((formData.amount / job.budget) * 100)}% of budget
                        </p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((formData.amount / job.budget) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell the client why you're the perfect fit for this project..."
                      rows="5"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-slate-900"
                      required
                    ></textarea>
                    <p className="text-xs text-slate-500 mt-2">
                      {formData.message.length} / 1000 characters
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Bid"
                    )}
                  </button>

                  <p className="text-xs text-slate-500 text-center mt-4">
                    By placing a bid, you agree to our Terms & Conditions
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BidPage;

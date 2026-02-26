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

const JobDetail = () => {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Authentication State
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

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
    // Decode Token for permissions
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserRole(decoded.role);
        setUserId(decoded.id || decoded._id);
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch job");
        }
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

  const handleSave = async () => {
    // Validation
    if (!formData.budget || Number(formData.budget) <= 0) {
      setError("Budget must be greater than 0.");
      return;
    }

    const selectedDate = new Date(formData.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Deadline must be greater than or equal to today's date.");
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
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update job");
      }

      const updatedJob = await response.json();
      setJob(updatedJob);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update job. Please try again.");
    } finally {
      setIsSaving(false);
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
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
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
            {!isEditing && job.client?._id === userId && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 text-teal-600 font-semibold hover:bg-teal-100 transition-colors"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Job
              </button>
            )}
            {!isEditing && userRole === "freelancer" && (
               <button
                 onClick={() => router.push(`/bid/${jobId}`)}
                 className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold hover:opacity-90 transition-opacity"
               >
                 Submit a Proposal
               </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

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
                  {isEditing ? (
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full text-3xl font-bold text-slate-900 border-b-2 border-teal-500 focus:outline-none mb-2"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                      {job.title}
                    </h1>
                  )}
                  <p className="text-slate-500">
                    Posted by {job.client?.name || "Unknown Client"}
                  </p>
                  {!isEditing && (
                    <p className="text-sm text-slate-400 mt-2">
                      Job ID: {job._id}
                    </p>
                  )}
                </div>
              </div>

              {!isEditing && (
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-medium">
                    {job.category}
                  </span>
                  <span className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                    Fixed Price
                  </span>
                </div>
              )}
            </div>

            <hr className="my-8 border-slate-200" />

            {/* Job Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Budget
                </p>
                {isEditing ? (
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full text-2xl font-bold text-teal-600 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-2xl font-bold text-teal-600">
                    ₹{job.budget.toLocaleString()}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Deadline
                </p>
                {isEditing ? (
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full text-lg font-bold text-slate-900 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-lg font-bold text-slate-900">
                    {formatDate(job.deadline)}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Proposals
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {job.bids?.length || 0}
                </p>
              </div>
            </div>

            {/* Category Section */}
            {isEditing && (
              <div className="mb-8">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Category
                </p>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <hr className="my-8 border-slate-200" />

            {/* Description Section */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Description
              </p>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="8"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-normal"
                />
              ) : (
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              )}
            </div>

            <hr className="my-8 border-slate-200" />

            {/* Actions Section */}
            {isEditing && (
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      title: job.title,
                      description: job.description,
                      budget: job.budget,
                      deadline: job.deadline.split("T")[0],
                      category: job.category,
                    });
                  }}
                  className="px-6 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}

            {!isEditing && (
              <div className="flex gap-4 justify-between items-center">
                <button
                  onClick={() => router.push("/jobs")}
                  className="px-6 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Browse More Jobs
                </button>
                <div className="flex gap-3 w-full sm:w-auto">
                  {/* Cancel Action: Redirects to Post Job */}
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to go back to create a new job?",
                        )
                      ) {
                        router.push("/post-job");
                      }
                    }}
                    className="flex-1 sm:flex-none px-6 py-2 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors"
                  >
                    Cancel & New
                  </button>

                  {/* Confirm Action: Redirects to Jobs List */}
                  <button
                    onClick={() => router.push("/jobs")}
                    className="flex-1 sm:flex-none px-6 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Confirm & Finish
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Proposals Section */}
          {job.bids && job.bids.length > 0 && !isEditing && (
            <div className="mt-8 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">
                Proposals ({job.bids.length})
              </h3>
              <p className="text-slate-500">
                You have {job.bids.length} proposal(s) for this job.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetail;

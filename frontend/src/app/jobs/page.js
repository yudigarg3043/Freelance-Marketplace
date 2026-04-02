'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import EmptyState from "../components/UI/EmptyState";

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
};

const Jobs = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showAll, setShowAll] = useState(false);
  const [userRole, setUserRole] = useState(null);

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
    const fetchJobs = async () => {
      // Get user role from token
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split(".")[1]));
          setUserRole(decoded.role);
        } catch (err) {
          console.error("Invalid token:", err);
        }
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`);
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Could not load jobs. Please try again later.");
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || job.category === selectedCategory;
      
      const matchesMinBudget = !minBudget || job.budget >= Number(minBudget);
      const matchesMaxBudget = !maxBudget || job.budget <= Number(maxBudget);
      
      const isOpen = job.status === "open" && !job.acceptedBid;

      return matchesSearch && matchesCategory && matchesMinBudget && matchesMaxBudget && isOpen;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "budget-high") {
        return b.budget - a.budget;
      } else if (sortBy === "budget-low") {
        return a.budget - b.budget;
      } else if (sortBy === "deadline-soon") {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return 0;
    });

  const displayedJobs = showAll ? filteredJobs : filteredJobs.slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="bg-slate-100 py-12 mb-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Find Your Next Project
            </h1>
            <p className="text-slate-500 mb-8 max-w-2xl">
              Browse freelance jobs from top clients around the world
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    placeholder="Search by title or keyword..."
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative w-full lg:w-64">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-12 pl-12 pr-10 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none cursor-pointer font-medium text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Budget</span>
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-20 lg:w-24 text-sm focus:outline-none"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                  />
                  <span className="text-slate-300">|</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="w-20 lg:w-24 text-sm focus:outline-none"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-10 pl-4 pr-10 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="budget-high">Budget: High to Low</option>
                    <option value="budget-low">Budget: Low to High</option>
                    <option value="deadline-soon">Deadline: Soonest First</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {(searchQuery || selectedCategory || minBudget || maxBudget || sortBy !== "newest") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                      setMinBudget("");
                      setMaxBudget("");
                      setSortBy("newest");
                    }}
                    className="text-sm font-semibold text-red-500 hover:text-red-600 transition flex items-center gap-1 ml-auto lg:ml-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-500">
              Showing <span className="font-semibold text-slate-900">{displayedJobs.length}</span> of <span className="font-semibold text-slate-900">{filteredJobs.length}</span> jobs
            </p>
            {error && <span className="text-red-500 text-sm font-medium">{error}</span>}
          </div>

          <div className="space-y-4">
            {displayedJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="text-lg font-bold text-slate-900 hover:text-teal-600 transition-colors truncate mb-1 cursor-pointer"
                          onClick={() => router.push(`/jobs/${job._id}`)}
                        >
                          {job.title}
                        </h3>
                        <p className="text-sm text-slate-500">{job.client?.name || "Unknown Client"}</p>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold whitespace-nowrap">
                    {job.category}
                  </span>
                </div>

                <p className="text-slate-600 mb-4 line-clamp-2 text-sm leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap gap-6 text-sm mb-4 pb-4 border-b border-slate-100">
                  <span className="flex items-center gap-2 text-slate-600 font-medium">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ₹{job.budget.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-2 text-slate-600 font-medium">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {formatDate(job.deadline)}
                  </span>
                  <span className="flex items-center gap-2 text-slate-600 font-medium">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTimeAgo(job.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    {job.bids ? job.bids.length : 0} <span className="text-slate-400">proposal{job.bids?.length !== 1 ? 's' : ''}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all duration-200"
                      onClick={() => router.push(`/jobs/${job._id}`)}
                    >
                      View Details
                    </button>
                    {userRole !== "client" && (
                      <button
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-200 flex items-center gap-1.5 shadow-md shadow-teal-100"
                        onClick={() => router.push(`/bid/${job._id}`)}
                      >
                        Apply Now
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!loading && filteredJobs.length > 6 && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-semibold hover:border-teal-500 hover:text-teal-600 transition-all duration-300 flex items-center gap-2"
              >
                {showAll ? "View Less" : "View More"}
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

          {!loading && filteredJobs.length === 0 && (
            <EmptyState 
              title="No jobs found"
              description="We couldn't find any jobs matching your current filters. Try adjusting your search query or categories."
              actionLabel="Clear All Filters"
              onAction={() => {
                setSearchQuery("");
                setSelectedCategory("");
                setMinBudget("");
                setMaxBudget("");
                setSortBy("newest");
              }}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Jobs;
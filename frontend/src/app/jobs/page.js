'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
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

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const jobType = "Fixed Price"; 
    const matchesType = !selectedType || jobType === selectedType;
    
    return matchesSearch && matchesType;
  });

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

            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  placeholder="Search by title or keyword..."
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="h-14 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Jobs
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => setSelectedType(null)}
                className={`h-9 px-4 rounded-xl text-sm font-medium transition-colors ${
                  selectedType === null
                    ? "bg-gradient-to-r from-teal-500 to-teal-700 text-white"
                    : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-100"
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setSelectedType("Fixed Price")}
                className={`h-9 px-4 rounded-xl text-sm font-medium transition-colors ${
                  selectedType === "Fixed Price"
                    ? "bg-gradient-to-r from-teal-500 to-teal-700 text-white"
                    : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-100"
                }`}
              >
                Fixed Price
              </button>
              <button
                onClick={() => setSelectedType("Hourly")}
                className={`h-9 px-4 rounded-xl text-sm font-medium transition-colors ${
                  selectedType === "Hourly"
                    ? "bg-gradient-to-r from-teal-500 to-teal-700 text-white"
                    : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-100"
                }`}
              >
                Hourly
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-500">
              Showing <span className="font-semibold text-slate-900">{filteredJobs.length}</span> jobs
            </p>
            {error && <span className="text-red-500 text-sm font-medium">{error}</span>}
          </div>

          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => router.push(`/jobs/${job._id}`)}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 hover:text-teal-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-slate-500">{job.client?.name || "Unknown Client"}</p>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-medium w-fit">
                    Fixed Price
                  </span>
                </div>

                <p className="text-slate-500 mb-4 line-clamp-2">{job.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    {/* Location is not in Schema, defaulting to Remote */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Remote
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ₹{job.budget}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTimeAgo(job.createdAt)}
                  </span>
                </div>

                {/* Replacing Skills with Deadline (since schema has deadline but no skills) */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 flex items-center gap-1">
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                       Deadline: {formatDate(job.deadline)}
                    </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <span className="text-sm text-slate-500">
                    {job.bids ? job.bids.length : 0} proposals
                  </span>
                  <button className="text-sm text-teal-600 font-medium flex items-center gap-1 hover:underline">
                    Apply Now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!loading && filteredJobs.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No jobs found</h3>
              <p className="text-slate-500">Try adjusting your search</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Jobs;
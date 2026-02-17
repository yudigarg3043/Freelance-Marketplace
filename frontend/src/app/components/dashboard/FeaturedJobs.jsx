"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const FeaturedJobs = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`
        );

        const data = await res.json();

        if (res.ok) {
          setJobs(data.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-slate-100">
        <div className="container mx-auto px-4">
          <p className="text-slate-500">Loading featured jobs...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-100">
      <div className="container mx-auto px-4">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Featured Jobs
            </h2>
            <p className="text-slate-500 max-w-lg">
              Discover the latest opportunities from top clients looking for talented freelancers
            </p>
          </div>

          <Link
            href="/jobs"
            className="mt-4 md:mt-0 h-10 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors"
          >
            View All Jobs
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              onClick={() => router.push(`/jobs/${job._id}`)}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1 hover:text-teal-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {job.client?.name || "Client"}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-medium">
                  {job.category}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                <span>₹{job.budget}</span>
                <span>
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-sm text-slate-500">
                  {job.bids?.length || 0} proposals
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/jobs/${job._id}`);
                  }}
                  className="text-sm text-teal-600 font-medium hover:underline"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedJobs;

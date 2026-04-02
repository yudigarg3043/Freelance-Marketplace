"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "../../components/Layout/DashboardSidebar";
import EmptyState from "../../components/UI/EmptyState";

const FreelancerDashboard = () => {
  const router = useRouter();


  const [stats, setStats] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/freelancer`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();

        setStats([
          {
            label: "Total Earnings",
            value: `₹${data.stats.totalEarnings}`,
          },
          {
            label: "Active Projects",
            value: data.stats.activeProjects,
          },
          {
            label: "Profile Views",
            value: data.stats.profileViews,
          },
          {
            label: "Total Bids",
            value: data.stats.totalBids,
          },
        ]);

        setActiveProjects(data.activeProjects);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };


    fetchDashboard();
  }, [router]);

  const displayedProjects = showAll ? activeProjects : activeProjects.slice(0, 6);

  if (loading) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      <DashboardSidebar role="freelancer" />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">

        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-slate-900">
            Freelancer Dashboard
          </h1>

          <button
            onClick={() => router.push("/jobs")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white text-sm font-medium hover:opacity-90"
          >
            + Find Jobs
          </button>
        </header>

        <main className="p-6 flex-1 overflow-auto">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition"
              >
                <p className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900">
              Active Projects
            </h2>

            {activeProjects.length === 0 ? (
              <EmptyState 
                title="No active projects"
                description="You haven't been hired for any projects yet. Start by browsing and bidding on open jobs."
                actionLabel="Find Your Next Job"
                onAction={() => router.push("/jobs")}
              />
            ) : (
              <div className="space-y-4">
                {displayedProjects.map((project) => (
                  <div
                    key={project._id}
                    className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                  >
                    <h3 className="font-semibold text-slate-900">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Client: {project.client?.name}
                    </p>
                    <p className="text-sm text-slate-600">
                      Budget: ₹{project.budget}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!loading && activeProjects.length > 6 && (
            <div className="mt-8 flex justify-center">
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

        </main>
      </div>
    </div>
  );
};

export default FreelancerDashboard;

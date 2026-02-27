"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Header from "../../components/credentials/Header";

const FreelancerDashboard = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
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

    const fetchUnread = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/messages/unread-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount);
        }
      } catch (err) {
        console.log("Messaging not implemented yet");
      }
    };

    fetchDashboard();
    fetchUnread();
  }, [router]);

  const displayedProjects = showAll ? activeProjects : activeProjects.slice(0, 6);

  if (loading) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform ${sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="p-6 border-b border-slate-200">
          <Header />
        </div>

        <nav className="p-4 space-y-2">

          <Link
            href="/dashboard/freelancer"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${pathname === "/dashboard/freelancer"
              ? "bg-teal-50 text-teal-600"
              : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/projects"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          >
            My Projects
          </Link>

          <Link
            href="/dashboard/myBids"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          >
            My Bids
          </Link>

          <Link
            href="/dashboard/myMessages"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          >
            Messages
            {unreadCount > 0 && (
              <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>

          <Link
            href="/dashboard/myProfile"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          >
            Profile
          </Link>

          {/* <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          >
            Settings
          </Link> */}
        </nav>
      </aside>

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
              <p className="text-slate-500">
                No active projects yet.
              </p>
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

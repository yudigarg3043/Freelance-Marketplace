"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Header from "../../components/credentials/Header";

const ClientDashboard = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/client`,
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
            label: "Total Spent",
            value: `₹${data.stats.totalSpent}`,
          },
          {
            label: "Projects Posted",
            value: data.stats.totalJobs,
          },
          {
            label: "Active Projects",
            value: data.stats.activeProjects,
          },
          {
            label: "Completed Projects",
            value: data.stats.completedJobs,
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

  if (loading) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-slate-200">
          <Header />
        </div>

        <nav className="p-4 space-y-2">

          <Link
            href="/dashboard/client"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
              pathname === "/dashboard/client"
                ? "bg-teal-50 text-teal-600"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/jobs"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          >
            My Jobs
          </Link>

          <Link
            href="/dashboard/freelancers"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          >
            Hired Freelancers
          </Link>

          {/* <Link
            href="/dashboard/messages"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          >
            Messages
          </Link> */}

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

      <div className="flex-1 flex flex-col min-h-screen">

        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-slate-900">
            Client Dashboard
          </h1>

          <button
            onClick={() => router.push("/post-job")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white text-sm font-medium hover:opacity-90"
          >
            + Post Job
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
              Your Jobs
            </h2>

            {activeProjects.length === 0 ? (
              <p className="text-slate-500">
                No active jobs yet.
              </p>
            ) : (
              <div className="space-y-4">
                {activeProjects.map((project) => (
                  <div
                    key={project._id}
                    className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                  >
                    <h3 className="font-semibold text-slate-900">
                      {project.title}
                    </h3>

                    <p className="text-sm text-slate-600">
                      Budget: ₹{project.budget}
                    </p>

                    <p className="text-sm text-slate-500">
                      Deadline:{" "}
                      {new Date(project.deadline).toLocaleDateString()}
                    </p>

                    <p className="text-sm text-slate-500 capitalize">
                      Status: {project.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;

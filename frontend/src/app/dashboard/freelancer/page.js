"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FreelancerDashboard = () => {
  const router = useRouter();
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/freelancer`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

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

  if (loading) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b">
          <Link href="/" className="font-bold text-xl">
            Freelance<span className="text-teal-600">Hub</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center px-6">
          <h1 className="text-xl font-semibold">Freelancer Dashboard</h1>
        </header>

        <main className="p-6 flex-1">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-slate-200"
              >
                <p className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Active Projects */}
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="text-lg font-semibold mb-4">
              Active Projects
            </h2>

            {activeProjects.length === 0 ? (
              <p className="text-slate-500">No active projects yet.</p>
            ) : (
              <div className="space-y-4">
                {activeProjects.map((project) => (
                  <div
                    key={project._id}
                    className="p-4 border rounded-xl"
                  >
                    <h3 className="font-semibold">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Client: {project.client?.name}
                    </p>
                    <p className="text-sm">
                      Budget: ₹{project.budget}
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

export default FreelancerDashboard;

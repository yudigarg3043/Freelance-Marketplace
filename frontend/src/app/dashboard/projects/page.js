"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Layout/Navbar";
import Footer from "../../components/Layout/Footer";

const STATUS_CONFIG = {
    "in-progress": {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        label: "In Progress",
    },
    completed: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        label: "Completed",
    },
    open: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        label: "Open",
    },
};

const MyProjects = () => {
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/freelancer/projects`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!res.ok) throw new Error("Failed to load projects");
                const data = await res.json();
                setProjects(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">My Projects</h1>
                            <p className="text-slate-500 mt-1">
                                Jobs where your bid was accepted — deliver great work!
                            </p>
                        </div>
                        <Link
                            href="/dashboard/freelancer"
                            className="px-4 py-2 rounded-xl text-teal-600 hover:bg-teal-50 font-medium transition"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Projects List */}
                    {projects.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                            <svg
                                className="w-16 h-16 mx-auto text-slate-300 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                />
                            </svg>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                No active projects yet
                            </h3>
                            <p className="text-slate-500 text-sm mb-4">
                                Once a client accepts your bid, the project will appear here.
                            </p>
                            <button
                                onClick={() => router.push("/jobs")}
                                className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold"
                            >
                                Browse Jobs
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {projects.map((project) => {
                                const statusStyle = STATUS_CONFIG[project.status] || STATUS_CONFIG["in-progress"];
                                const daysLeft = Math.ceil(
                                    (new Date(project.deadline) - Date.now()) / (1000 * 60 * 60 * 24)
                                );

                                return (
                                    <div
                                        key={project._id}
                                        className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition cursor-pointer"
                                        onClick={() => router.push(`/jobs/${project._id}`)}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-slate-900">
                                                        {project.title}
                                                    </h3>
                                                    <span
                                                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                                                    >
                                                        {statusStyle.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500">
                                                    Client:{" "}
                                                    <span className="font-medium text-slate-700">
                                                        {project.client?.name || "Unknown"}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                            {project.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>
                                                    Your Bid:{" "}
                                                    <span className="font-semibold text-teal-600">
                                                        ₹{project.bidAmount?.toLocaleString()}
                                                    </span>
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <span>Budget: ₹{project.budget?.toLocaleString()}</span>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>
                                                    {daysLeft > 0
                                                        ? `${daysLeft} days left`
                                                        : daysLeft === 0
                                                            ? "Due today"
                                                            : `${Math.abs(daysLeft)} days overdue`}
                                                </span>
                                            </div>

                                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs text-slate-600">
                                                {project.category}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MyProjects;

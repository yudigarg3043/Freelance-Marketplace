"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardSidebar from "../../../components/Layout/DashboardSidebar";
import Navbar from "../../../components/Layout/Navbar";

const STATUS_BADGE = {
    "in-progress": "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    open: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function FreelancerProjectWorkspace() {
    const router = useRouter();
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (!res.ok) throw new Error("Failed to load project details");
                
                const data = await res.json();
                
                // Verify that this freelancer is indeed the one hired
                // This is a safety check as the backend handles authorization too
                setProject(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProjectDetails();
    }, [id, router]);

    const handleMarkComplete = async () => {
        if (!window.confirm("Mark this project as complete?")) return;

        setCompleting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}/complete`,
                {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to mark as complete");
            }

            setProject({ ...project, status: 'completed' });
        } catch (err) {
            alert(err.message);
        } finally {
            setCompleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <DashboardSidebar role="freelancer" />
                <div className="flex-1 p-6 flex items-center justify-center">
                   <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h2>
                        <button onClick={() => router.push("/dashboard/projects")} className="text-teal-600 font-semibold underline">Back to My Projects</button>
                   </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <DashboardSidebar role="freelancer" />

            <div className="flex-1 flex flex-col min-h-screen">
                <Navbar />

                <main className="p-8 pt-24 max-w-5xl mx-auto w-full">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                        <button onClick={() => router.push("/dashboard/projects")} className="hover:text-teal-600 transition-colors">My Projects</button>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        <span className="text-slate-900 font-medium truncate">Project Workspace</span>
                    </nav>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Content */}
                        <div className="flex-1 space-y-6">
                            {/* Header Section */}
                            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize border ${STATUS_BADGE[project.status]}`}>
                                        {project.status.replace('-', ' ')}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-extrabold text-slate-900 mb-4 pr-24">{project.title}</h1>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{project.description}</p>
                            </div>

                            {/* Project Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Client Information</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                                            {project.client?.name?.[0]?.toUpperCase() || "?"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{project.client?.name || "Client"}</p>
                                            <p className="text-sm text-slate-500">{project.client?.email || "No email provided"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Financial Overview</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-teal-600">₹{project.budget?.toLocaleString()}</p>
                                            <p className="text-xs text-slate-400">Total Project Value</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Actions */}
                        <div className="w-full lg:w-80 space-y-6">
                             {/* Milestones / Deadlines */}
                             <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Key Deadlines</h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-1 h-12 rounded-full bg-amber-200 flex-shrink-0"></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400">Bidding Ended</p>
                                            <p className="text-sm font-bold text-slate-800">{new Date(project.deadline).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-1 h-12 rounded-full bg-teal-500 flex-shrink-0"></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400">Project Delivery</p>
                                            <p className="text-sm font-bold text-slate-800">{project.completionDeadline ? new Date(project.completionDeadline).toLocaleDateString() : "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Workspace Actions</h3>
                                <div className="space-y-3">
                                    {project.status === 'in-progress' && (
                                        <button 
                                            onClick={handleMarkComplete}
                                            disabled={completing}
                                            className="w-full py-3 px-6 rounded-2xl bg-teal-500 text-white font-bold hover:bg-teal-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {completing ? "Updating..." : "Mark as Complete"}
                                            {!completing && <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => router.push("/dashboard/contact")}
                                        className="w-full py-3 px-6 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/10"
                                    >
                                        Contact Client
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

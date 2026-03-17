"use client";

import { useRouter } from "next/navigation";
import DashboardSidebar from "../../components/Layout/DashboardSidebar";
import Navbar from "../../components/Layout/Navbar";

export default function ContactPlaceholder() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <DashboardSidebar role="freelancer" />
            
            <div className="flex-1 flex flex-col">
                <Navbar />
                
                <main className="flex-1 flex items-center justify-center p-6 pt-24">
                    <div className="max-w-2xl w-full text-center">
                        <div className="relative mb-8 inline-block">
                            <div className="absolute inset-0 bg-teal-200 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-xl shadow-teal-100 mx-auto transform hover:rotate-6 transition-transform duration-300">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                            Direct Messaging <span className="text-teal-600">Coming Soon</span>
                        </h1>
                        <p className="text-lg text-slate-500 mb-10 leading-relaxed mx-auto max-w-lg">
                            We're building a state-of-the-art communication system to help you stay in touch with your clients effortlessly.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            {[
                                { title: "Real-time Chat", desc: "Instant updates with no delays.", icon: "💬" },
                                { title: "File Sharing", desc: "Securely send and receive assets.", icon: "📁" },
                                { title: "Voice Calls", desc: "Quick syncs when typing isn't enough.", icon: "📞" }
                            ].map((feature, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="text-2xl mb-2">{feature.icon}</div>
                                    <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                                    <p className="text-xs text-slate-500 leading-tight">{feature.desc}</p>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => router.back()}
                            className="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
                        >
                            Return to Project
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Layout/Navbar";

const AVATAR_COLORS = [
    "from-teal-500 to-teal-600",
    "from-emerald-500 to-emerald-600",
    "from-violet-500 to-violet-600",
    "from-amber-500 to-amber-600",
    "from-cyan-500 to-cyan-600",
];

export default function PublicProfile() {
    const { id } = useParams();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Fetch User Info
                // We'll use a new public endpoint or repurpose /api/auth/me equivalent if possible, 
                // but usually public profile needs a specific endpoint. 
                // For now, I'll assume we might need a public GET /api/users/:id
                // Let's check if there is a generalized user fetch. If not, I'll need to add it.
                
                // Fetching via a hypothetical public endpoint
                const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/${id}`);
                if (!userRes.ok) throw new Error("User not found");
                const userData = await userRes.json();
                setUser(userData.user);

                // Fetch Reviews
                const reviewsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/user/${id}`);
                if (reviewsRes.ok) {
                    const reviewsData = await reviewsRes.json();
                    setReviews(reviewsData);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProfileData();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center animate-pulse text-teal-600 font-bold">Loading Profile...</div>;
    if (error || !user) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">{error || "User not found"}</div>;

    const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase();
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-5xl mx-auto pt-24 pb-12 px-6">
                {/* Header / Basic Info */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-4xl font-bold shadow-lg`}>
                            {initials}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-black text-slate-900 mb-2">{user.name}</h1>
                            <p className="text-xl text-teal-600 font-bold mb-4">{user.title || "Professional"}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    <strong className="text-slate-900">{user.rating || "0.0"}</strong> ({user.numReviews || 0} reviews)
                                </span>
                                {user.location && <span className="flex items-center gap-1 uppercase tracking-widest font-bold text-[10px] bg-slate-100 px-2 py-1 rounded-md">{user.location}</span>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <button onClick={() => router.push("/dashboard/contact")} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl shadow-slate-200">
                                Contact {user.role === 'freelancer' ? 'Freelancer' : 'Client'}
                            </button>
                            {user.resume && (
                                <a 
                                    href={user.resume} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="px-8 py-4 border-2 border-slate-900 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    Download Resume
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Bio & Skills */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Bio */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">About</h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{user.bio || "No bio provided."}</p>
                            
                            {user.skills && user.skills.length > 0 && (
                                <div className="mt-8 pt-8 border-t border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Top Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {user.skills.map((skill, index) => (
                                            <span key={index} className="px-4 py-2 bg-teal-50 text-teal-700 rounded-xl text-sm font-bold border border-teal-100">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Portfolio Section */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Portfolio</h2>
                            {user.portfolio && user.portfolio.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {user.portfolio.map((item, index) => (
                                        <div key={index} className="group rounded-2xl border border-slate-100 overflow-hidden hover:border-teal-200 transition">
                                            {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />}
                                            <div className="p-4">
                                                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                                                <p className="text-sm text-slate-500 mb-3">{item.description}</p>
                                                {item.link && (
                                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                                                        View Project <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-400 italic">No portfolio items added yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Reviews */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Client Reviews</h2>
                            <div className="space-y-6">
                                {reviews.length > 0 ? reviews.map((rev, index) => (
                                    <div key={index} className="border-b border-slate-50 last:border-0 pb-6 last:pb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-bold text-slate-900">{rev.reviewer?.name || "Verified Client"}</p>
                                            <div className="flex items-center text-amber-400 text-xs">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                                        <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            {new Date(rev.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                )) : (
                                    <p className="text-slate-400 italic">No reviews yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

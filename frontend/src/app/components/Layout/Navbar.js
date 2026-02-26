'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDashboardOpen, setisDashboardOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isLoggedIn = !!user;

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const handleDeshboardClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role === "freelancer") {
      router.push("/dashboard/freelancer");
    } else {
      router.push("/dashboard/client");
    }
  };



  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">
              Freelance<span className="text-teal-600">Hub</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/jobs" className="text-slate-500 hover:text-slate-900 font-medium">
              Browse Jobs
            </Link>
            <Link href="/post-job" className="text-slate-500 hover:text-slate-900 font-medium">
              Find Talent
            </Link>
            <Link href="/HowItWorks" className="text-slate-500 hover:text-slate-900 font-medium">
              How It Works
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!loading && (
              isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setisDashboardOpen(!isDashboardOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-700">
                      {user.name}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isDashboardOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {isDashboardOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                      <button
                        onClick={() => {
                          handleDeshboardClick();
                          setisDashboardOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        Dashboard
                      </button>
                      <button className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 transition-colors">
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setisDashboardOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/login")}
                    className="h-10 px-4 text-slate-900 font-medium hover:bg-slate-100 rounded-xl"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => router.push("/register")}
                    className="h-10 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-medium hover:opacity-90"
                  >
                    Get Started
                  </button>
                </>
              )
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-200/50 flex flex-col gap-4 text-slate-800">
            <Link href="/jobs" onClick={() => setIsOpen(false)}>Browse Jobs</Link>
            <Link href="/freelancers" onClick={() => setIsOpen(false)}>Find Talent</Link>

            <div className="pt-4 border-t border-slate-200/50 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Link href="/profile" onClick={() => setIsOpen(false)}>
                    My Profile
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="text-left text-red-600"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => router.push("/login")}>
                    Log In
                  </button>
                  <button onClick={() => router.push("/register")}>
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;

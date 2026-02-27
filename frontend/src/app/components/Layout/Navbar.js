'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDashboardOpen, setisDashboardOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const notifRef = useRef(null);

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

  // Fetch unread count periodically
  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/unread-count`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count);
        }
      } catch (err) {
        // silent fail
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000); // poll every 15s
    return () => clearInterval(interval);
  }, [user]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (!isNotifOpen || !user) return;

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        // silent fail
      }
    };

    fetchNotifications();
  }, [isNotifOpen, user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      // silent
    }
  };

  const handleNotifClick = async (notif) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${notif._id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      // silent
    }
    setIsNotifOpen(false);
    if (notif.link) router.push(notif.link);
  };

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

  const NOTIF_ICONS = {
    new_bid: "📩",
    bid_updated: "✏️",
    bid_accepted: "🎉",
    bid_rejected: "❌",
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
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
            <Link href="/" className="text-slate-500 hover:text-slate-900 font-medium">
              Home
            </Link>
            <Link href="/jobs" className="text-slate-500 hover:text-slate-900 font-medium">
              Browse Jobs
            </Link>
            {isLoggedIn && user?.role === "client" && (
              <Link href="/post-job" className="text-slate-500 hover:text-slate-900 font-medium">
                Post a Job
              </Link>
            )}
            <Link href="/HowItWorks" className="text-slate-500 hover:text-slate-900 font-medium">
              How It Works
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!loading && (
              isLoggedIn ? (
                <div className="flex items-center gap-2">

                  {/* Notification Bell */}
                  <div ref={notifRef} className="relative">
                    <button
                      onClick={() => { setIsNotifOpen(!isNotifOpen); setisDashboardOpen(false); }}
                      className="relative p-2 rounded-xl hover:bg-slate-100 transition"
                    >
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown */}
                    {isNotifOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                          <h3 className="font-bold text-slate-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllRead}
                              className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center">
                              <svg className="w-10 h-10 mx-auto text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                              <p className="text-sm text-slate-500">No notifications yet</p>
                            </div>
                          ) : (
                            notifications.map((notif) => (
                              <button
                                key={notif._id}
                                onClick={() => handleNotifClick(notif)}
                                className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition border-b border-slate-50 flex items-start gap-3 ${!notif.read ? "bg-teal-50/50" : ""
                                  }`}
                              >
                                <span className="text-lg flex-shrink-0 mt-0.5">
                                  {NOTIF_ICONS[notif.type] || "🔔"}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm leading-snug ${!notif.read ? "text-slate-900 font-medium" : "text-slate-600"}`}>
                                    {notif.message}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">{timeAgo(notif.createdAt)}</p>
                                </div>
                                {!notif.read && (
                                  <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 mt-2"></div>
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Messages Icon */}
                  <button
                    onClick={() => router.push("/dashboard/myMessages")}
                    className="p-2 rounded-xl hover:bg-slate-100 transition"
                  >
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => { setisDashboardOpen(!isDashboardOpen); setIsNotifOpen(false); }}
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
                        <button
                          onClick={() => {
                            router.push("/dashboard/myProfile");
                            setisDashboardOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 transition-colors">
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            router.push("/dashboard/myMessages");
                            setisDashboardOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 transition-colors">
                          Messages
                        </button>
                        <hr className="my-1 border-slate-100" />
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
            <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/jobs" onClick={() => setIsOpen(false)}>Browse Jobs</Link>
            {isLoggedIn && user?.role === "client" && (
              <Link href="/post-job" onClick={() => setIsOpen(false)}>Post a Job</Link>
            )}
            <Link href="/HowItWorks" onClick={() => setIsOpen(false)}>How It Works</Link>

            <div className="pt-4 border-t border-slate-200/50 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard/myProfile" onClick={() => setIsOpen(false)}>
                    My Profile
                  </Link>
                  <Link href="/dashboard/myMessages" onClick={() => setIsOpen(false)}>
                    Messages
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

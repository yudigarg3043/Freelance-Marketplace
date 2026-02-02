'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">
              Freelance<span className="text-teal-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/jobs" className="text-slate-500 hover:text-slate-900 transition-colors font-medium">
              Browse Jobs
            </Link>
            <Link href="/freelancers" className="text-slate-500 hover:text-slate-900 transition-colors font-medium">
              Find Talent
            </Link>
            <Link href="/how-it-works" className="text-slate-500 hover:text-slate-900 transition-colors font-medium">
              How It Works
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => router.push("/login")}
              className="h-10 px-4 rounded-xl text-slate-900 font-medium hover:bg-slate-100 transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => router.push("/register")}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-200/50">
            <div className="flex flex-col gap-4">
              <Link
                href="/jobs"
                className="text-slate-500 hover:text-slate-900 transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Browse Jobs
              </Link>
              <Link
                href="/freelancers"
                className="text-slate-500 hover:text-slate-900 transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Find Talent
              </Link>
              <Link
                href="/how-it-works"
                className="text-slate-500 hover:text-slate-900 transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-slate-200/50">
                <button
                  onClick={() => { router.push("/login"); setIsOpen(false); }}
                  className="h-10 px-4 rounded-xl text-slate-900 font-medium hover:bg-slate-100 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => { router.push("/register"); setIsOpen(false); }}
                  className="h-10 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
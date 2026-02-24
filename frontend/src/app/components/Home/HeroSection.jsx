"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50">
      
      {/* ===== Background Effects ===== */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-blue-500/5 to-slate-50" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* ===== LEFT CONTENT ===== */}
          <div className="space-y-8">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-medium shadow-sm">
              ⭐ Trusted by 10,000+ professionals
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900">
              Find Top Talent or
              <span className="block bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                Your Next Opportunity
              </span>
            </h1>

            <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
              Connect with skilled freelancers or discover exciting projects. 
              FreelanceHub makes hiring and getting hired seamless, secure, and rewarding.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="h-14 px-8 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
              >
                Get Started Free →
              </Link>

              <button
                onClick={() => router.push("/jobs")}
                className="h-14 px-8 rounded-xl border border-slate-200 bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
              >
                Browse Jobs
              </button>
            </div>

            {/* ===== Stats Section (Upgraded) ===== */}
            <div className="flex flex-wrap gap-10 pt-6">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  50K+
                </p>
                <p className="text-sm text-slate-500">Active Jobs</p>
              </div>

              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  25K+
                </p>
                <p className="text-sm text-slate-500">Freelancers</p>
              </div>

              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  $15M+
                </p>
                <p className="text-sm text-slate-500">Paid to Talent</p>
              </div>
            </div>
          </div>

          {/* ===== RIGHT CONTENT ===== */}
          <div className="relative hidden lg:block">

            {/* Floating Card 1 */}
            <div
              className="absolute top-0 right-0 w-72 animate-float"
            >
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-slate-200">
                <p className="font-semibold text-slate-900 mb-2">
                  React Developer Needed
                </p>
                <p className="text-sm text-slate-500 mb-3">
                  Remote • Fixed Price
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs">
                    React
                  </span>
                  <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs">
                    TypeScript
                  </span>
                </div>
                <p className="mt-4 text-lg font-bold text-teal-600">
                  ₹2,50,000
                </p>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div
              className="absolute top-40 left-0 w-64 animate-float delay-200"
            >
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-5 shadow-xl border border-slate-200">
                <p className="font-semibold text-sm text-slate-900">
                  12 Bids Received
                </p>
                <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-teal-500 to-teal-700 rounded-full" />
                </div>
              </div>
            </div>

            {/* Floating Card 3 */}
            <div
              className="absolute bottom-0 right-20 w-60 animate-float delay-500"
            >
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-5 shadow-xl border border-slate-200">
                <p className="text-sm text-slate-900 font-semibold">
                  Payment Received
                </p>
                <p className="text-emerald-500 font-bold text-lg">
                  ₹3,20,000
                </p>
              </div>
            </div>

            {/* Center Glow */}
            <div className="w-96 h-96 mx-auto rounded-3xl bg-gradient-to-br from-teal-500/20 via-teal-600/20 to-blue-600/20 blur-2xl" />
          </div>
        </div>
      </div>

      {/* ===== Animation ===== */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .delay-200 {
          animation-delay: 1s;
        }
        .delay-500 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
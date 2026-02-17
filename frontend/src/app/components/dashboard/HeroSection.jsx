"use client";

import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-slate-50">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-blue-500/5 to-slate-50" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-medium">
              <span>Trusted by 10,000+ professionals</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900">
              Find Top Talent or
              <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent block">
                Your Next Opportunity
              </span>
            </h1>

            <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
              Connect with skilled freelancers or discover exciting projects.
              FreelanceHub makes hiring and getting hired seamless and secure.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push("/register")}
                className="h-14 px-8 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started Free
              </button>

              <button
                onClick={() => router.push("/jobs")}
                className="h-14 px-8 rounded-xl border border-slate-200 bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
              >
                Browse Jobs
              </button>
            </div>

            <div className="flex flex-wrap gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-slate-900">50K+</p>
                <p className="text-sm text-slate-500">Active Jobs</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">25K+</p>
                <p className="text-sm text-slate-500">Freelancers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">$15M+</p>
                <p className="text-sm text-slate-500">Paid to Talent</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 items-center justify-center rounded-3xl p-12">
            <div className="text-center text-white space-y-6 max-w-lg">
              <h2 className="text-3xl font-bold">Start Your Journey</h2>
              <p className="text-white/80">
                Join thousands of freelancers and clients who trust FreelanceHub.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

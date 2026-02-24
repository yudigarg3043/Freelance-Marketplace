"use client";

import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import Link from "next/link";

const steps = [
  {
    step: 1,
    title: "Browse Available Jobs",
    description:
      "Start by exploring the Jobs page. Use filters to narrow down projects by type, skills, and budget range. Click any job card to view full details.",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    step: 2,
    title: "Review Job Details",
    description:
      "Read the description, requirements, budget, and deadline carefully. Check proposal count to understand competition.",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    step: 3,
    title: "Click 'Apply Now'",
    description:
      "Click Apply Now to enter the bidding page. Review other bids and prepare your proposal.",
    icon: "M15 15l-2 5L9 9l11 4-5 2z",
  },
  {
    step: 4,
    title: "Set Your Bid Amount",
    description:
      "Choose a competitive price based on project scope, experience level, and budget expectations.",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2",
  },
  {
    step: 5,
    title: "Write a Winning Proposal",
    description:
      "Personalize your proposal. Explain your approach, highlight experience, and define timeline clearly.",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5",
  },
  {
    step: 6,
    title: "Submit & Track Your Bid",
    description:
      "Submit and monitor status from Dashboard under 'My Bids'. Update anytime before decision.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

const tips = [
  {
    title: "Be Specific",
    description:
      "Generic proposals get ignored. Reference project requirements clearly.",
  },
  {
    title: "Show Your Work",
    description:
      "Attach portfolio links or similar projects to build trust.",
  },
  {
    title: "Price Fairly",
    description:
      "Underbidding hurts your value. Price based on skill & effort.",
  },
  {
    title: "Respond Quickly",
    description:
      "Early proposals get more visibility and higher success rate.",
  },
];

const HowToBid = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="relative bg-gradient-to-br from-teal-500 to-teal-700 py-20 mb-16 overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Master the Art of <span className="text-white/80">Winning Bids</span>
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              Learn how to stand out, win projects, and grow your freelancing career on FreelanceHub.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl mb-20">
          <div className="relative border-l-2 border-dashed border-slate-200 pl-8 space-y-12">
            {steps.map((s) => (
              <div key={s.step} className="relative group">
                <div className="absolute -left-12 w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                  </svg>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm group-hover:shadow-xl transition-all">
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                    Step {s.step}
                  </span>
                  <h3 className="text-xl font-semibold text-slate-900 mt-3 mb-3">
                    {s.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-100 py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
              Pro Tips for Winning Bids
            </h2>

            <div className="grid sm:grid-cols-2 gap-8">
              {tips.map((tip) => (
                <div
                  key={tip.title}
                  className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <h4 className="font-semibold text-slate-900 mb-3 text-lg">
                    {tip.title}
                  </h4>
                  <p className="text-slate-500 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 text-center mt-20">
          <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Start Bidding?
            </h2>
            <p className="text-white/80 mb-8">
              Browse available jobs and submit your first winning proposal today.
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-white text-teal-600 font-semibold hover:bg-white/90 transition-all"
            >
              Browse Jobs
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default HowToBid;
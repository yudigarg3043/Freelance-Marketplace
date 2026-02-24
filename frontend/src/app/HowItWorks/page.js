"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

const steps = [
  {
    num: 1,
    title: "Create Your Account",
    desc: "Sign up as a freelancer or client in just a few minutes. Complete your profile to get started.",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    num: 2,
    title: "Post or Find a Job",
    desc: "Clients post detailed job listings. Freelancers browse and apply to projects that match their skills.",
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    num: 3,
    title: "Collaborate & Deliver",
    desc: "Work together using our messaging and project tools. Track progress and milestones in real-time.",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  },
  {
    num: 4,
    title: "Get Paid Securely",
    desc: "Payments are held in escrow and released upon project completion. Safe and secure for everyone.",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

const faqs = [
  {
    q: "How much does it cost to join?",
    a: "Creating an account is completely free. We only charge a small service fee when a project is completed successfully.",
  },
  {
    q: "How do payments work?",
    a: "Clients fund an escrow account before work begins. Once the work is approved, payment is released to the freelancer.",
  },
  {
    q: "Can I work as both a freelancer and a client?",
    a: "Absolutely! You can switch between freelancer and client modes from your dashboard at any time.",
  },
  {
    q: "How do you ensure quality?",
    a: "We have a review and rating system, skill verification, and a dispute resolution process to maintain high quality standards.",
  },
];

const HowItWorks = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-16">

        <div className="bg-slate-100 py-16 mb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              How FreelanceHub Works
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              A simple, secure process to connect freelancers with clients worldwide.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div
                key={s.num}
                className="bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={s.icon}
                    />
                  </svg>
                </div>

                <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-bold mb-3">
                  Step {s.num}
                </span>

                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {s.title}
                </h3>

                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-6"
              >
                <h3 className="font-semibold text-slate-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-slate-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>

            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Join thousands of freelancers and clients who trust FreelanceHub.
            </p>

            <Link
              href="/register"
              className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-white text-teal-600 font-semibold hover:bg-white/90 transition-all"
            >
              Create Free Account
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
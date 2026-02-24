"use client";

import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import Link from "next/link";

const stories = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Full Stack Developer",
    avatar: "SC",
    earnings: "$85,000+",
    projects: 42,
    rating: 4.9,
    quote:
      "FreelanceHub changed my career. I went from a 9-to-5 job to earning more while working on my own schedule.",
    skills: ["React", "Node.js", "PostgreSQL"],
    highlight: "Landed a $15K contract in her first month",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "UI/UX Designer",
    avatar: "MJ",
    earnings: "$120,000+",
    projects: 67,
    rating: 5.0,
    quote:
      "FreelanceHub is where I found my best clients. The quality of projects here is unmatched.",
    skills: ["Figma", "UI Design", "Branding"],
    highlight: "Built a client base of 30+ repeat customers",
  },
  {
    id: 3,
    name: "Aisha Patel",
    role: "WordPress Expert",
    avatar: "AP",
    earnings: "$52,000+",
    projects: 89,
    rating: 4.8,
    quote:
      "The How to Bid guide helped me craft winning proposals. Now I have more work than I can handle!",
    skills: ["WordPress", "PHP", "SEO"],
    highlight: "Went from 0 to $5K/month in 3 months",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Mobile App Developer",
    avatar: "DK",
    earnings: "$200,000+",
    projects: 35,
    rating: 4.9,
    quote:
      "The platform connects me with serious clients who value quality work.",
    skills: ["React Native", "Swift", "Kotlin"],
    highlight: "Developed 3 apps featured on App Store",
  },
];

const SuccessStories = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-20">

        <div className="relative bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 py-20 mb-16 overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Real Stories. Real Success.
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              Discover how freelancers built thriving careers and achieved financial freedom with FreelanceHub.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10">
            {stories.map((story) => (
              <div
                key={story.id}
                className="group bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {story.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {story.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {story.role}
                    </p>
                  </div>
                </div>

                <blockquote className="text-slate-600 leading-relaxed mb-6 italic">
                  “{story.quote}”
                </blockquote>

                <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl px-4 py-3 mb-6 border border-teal-100">
                  <p className="text-sm text-teal-700 font-medium">
                    🏆 {story.highlight}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                  <div>
                    <p className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                      {story.earnings}
                    </p>
                    <p className="text-xs text-slate-500">Earned</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900">
                      {story.projects}
                    </p>
                    <p className="text-xs text-slate-500">Projects</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-yellow-500">
                      ⭐ {story.rating}
                    </p>
                    <p className="text-xs text-slate-500">Rating</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {story.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 text-center mt-24">
          <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-white/80 mb-8">
              Join thousands of freelancers building their dream careers.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-white text-teal-600 font-semibold hover:bg-white/90 transition-all"
            >
              Get Started Today
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default SuccessStories;
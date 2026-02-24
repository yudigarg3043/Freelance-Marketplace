"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

const CTASection = () => {
  const router = useRouter();

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden">

          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

          <div className="relative px-8 py-16 md:py-24 text-center">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>Join 25,000+ freelancers</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto">
              Ready to Start Your Freelancing Journey?
            </h2>

            <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
              Whether you're a skilled freelancer or a client looking for top talent,
              FreelanceHub is the perfect platform to achieve your goals.
            </p>

            <div className="flex flex-wrap justify-center gap-4">

              <Link
                href="/register"
                className="h-14 px-8 rounded-xl bg-white text-teal-600 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl hover:bg-white/90 transition-all"
              >
                Create Free Account
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <button
                onClick={() => router.push("/how-it-works")}
                className="h-14 px-8 rounded-xl border border-white/50 text-white font-semibold hover:bg-white/10 hover:border-white transition-all"
              >
                Learn More
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

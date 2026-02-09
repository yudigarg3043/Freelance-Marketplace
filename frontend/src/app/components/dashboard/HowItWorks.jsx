export default function HowItWorks() {
  const steps = [
    {
      title: "Create Your Profile",
      description:
        "Sign up and build your professional profile showcasing your skills and experience.",
      color: "teal",
      icon: "user-plus",
    },
    {
      title: "Find Opportunities",
      description:
        "Browse jobs that match your skills or post projects to find the perfect freelancer.",
      color: "orange",
      icon: "search",
    },
    {
      title: "Connect & Collaborate",
      description:
        "Submit proposals, discuss requirements, and collaborate seamlessly with clients.",
      color: "emerald",
      icon: "message",
    },
    {
      title: "Get Paid Securely",
      description:
        "Complete projects and receive payments through our secure payment system.",
      color: "amber",
      icon: "dollar",
    },
  ];

  const IconMap = {
    "user-plus": (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    search: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    message: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    dollar: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            How FreelanceHub Works
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Start your freelancing journey or find top talent in just a few simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-slate-200" />
              )}

              <div className="text-center space-y-4">
                <div className="relative inline-flex">
                  <div
                    className={`w-24 h-24 rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 ${
                      step.color === "teal"
                        ? "bg-teal-50 text-teal-600"
                        : step.color === "orange"
                        ? "bg-orange-50 text-orange-500"
                        : step.color === "emerald"
                        ? "bg-emerald-50 text-emerald-500"
                        : "bg-amber-50 text-amber-500"
                    }`}
                  >
                    {IconMap[step.icon]}
                  </div>

                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-slate-900">
                  {step.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

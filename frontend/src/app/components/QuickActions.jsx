export default function QuickActions() {
  const actions = [
    { title: 'Browse Jobs', href: '/jobs', icon: '🔍', color: 'from-blue-500 to-indigo-600' },
    { title: 'Post Project', href: '/post-job', icon: '📤', color: 'from-emerald-500 to-teal-600' },
    { title: 'My Proposals', href: '/proposals', icon: '📋', color: 'from-purple-500 to-pink-600' }
  ];

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl mb-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action) => (
          <a key={action.title} href={action.href} className="group flex items-center p-6 rounded-2xl bg-gradient-to-r hover:scale-[1.02] transition-all border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl">
            <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center shadow-lg mr-4 group-hover:scale-110 transition-transform`}>
              <span className="text-2xl">{action.icon}</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">{action.title}</h3>
              <p className="text-white/80 text-sm">Get started now</p>
            </div>
            <svg className="w-5 h-5 text-white ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

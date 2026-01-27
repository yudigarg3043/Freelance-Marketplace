export default function StatsGrid({ stats }) {
  const statCards = [
    { title: 'Total Jobs', value: stats.totalJobs || 0, color: 'from-blue-500 to-blue-600', icon: '📊' },
    { title: 'Open Jobs', value: stats.openJobs || 0, color: 'from-emerald-500 to-emerald-600', icon: '✅' },
    { title: 'Earnings', value: `₹${stats.earnings || 0}`, color: 'from-purple-500 to-purple-600', icon: '💰' },
    { title: 'Proposals', value: stats.proposalsSent || 0, color: 'from-orange-500 to-orange-600', icon: '📝' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {statCards.map((stat, idx) => (
        <div key={stat.title} className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 hover:border-white/80 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <div className="w-2 h-2 bg-slate-300 rounded-full group-hover:bg-slate-400 transition-colors"></div>
          </div>
          <div>
            <p className="text-sm text-slate-600 font-medium uppercase tracking-wide mb-1">{stat.title}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

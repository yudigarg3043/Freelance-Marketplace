export default function EarningsChart({ stats }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-8">Earnings Overview</h2>
      <div className="space-y-6">
        {/* Monthly Earnings Card */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 border border-emerald-200/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-emerald-800">This Month</span>
            <span className="text-3xl font-bold text-emerald-700">₹{stats.earnings || 0}</span>
          </div>
          <div className="w-full bg-emerald-200/50 rounded-full h-3">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full w-3/4 animate-pulse"></div>
          </div>
        </div>

        {/* Project Status Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Completed', value: 12, color: 'from-emerald-500 to-emerald-600' },
            { label: 'Pending', value: 3, color: 'from-orange-500 to-orange-600' },
            { label: 'In Progress', value: 5, color: 'from-blue-500 to-blue-600' },
            { label: 'Cancelled', value: 1, color: 'from-red-500 to-red-600' }
          ].map((stat) => (
            <div key={stat.label} className={`p-4 rounded-xl bg-gradient-to-r ${stat.color}/10 border border-slate-200/50 hover:shadow-md transition-all`}>
              <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

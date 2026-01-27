export default function ActiveProjects({ jobs = [] }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
        Active Projects
        <span className="ml-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">3</span>
      </h2>
      <div className="space-y-4">
        {jobs.slice(0, 3).map((job, idx) => (
          <div key={job._id} className="group p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50 hover:from-slate-100 hover:to-blue-100 border border-slate-200/50 hover:border-slate-300 transition-all hover:shadow-lg">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-xl text-slate-900">{job.title}</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                ₹{job.budget}
              </span>
            </div>
            <p className="text-slate-600 mb-4 line-clamp-2">{job.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {job.skills?.slice(0, 3).map(skill => (
                  <span key={skill} className="px-2 py-1 bg-white/60 backdrop-blur-sm text-xs rounded-lg border">
                    {skill}
                  </span>
                ))}
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

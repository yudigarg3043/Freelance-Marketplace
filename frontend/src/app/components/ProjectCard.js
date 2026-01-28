export default function ProjectCard({ title, freelancer, status, progress, dueDate }) {
  const statusColors = {
    'In Progress': 'bg-blue-600',
    'Review': 'bg-amber-500',
    'Completed': 'bg-green-600'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1 m-0">
            {title}
          </h3>
          <p className="text-slate-500 text-sm m-0">
            with {freelancer}
          </p>
        </div>
        <span className={`${statusColors[status]} text-white px-3 py-1 rounded text-xs font-bold`}>
          {status}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-slate-500 text-sm">
            Progress
          </span>
          <span className="text-slate-900 text-sm font-bold">
            {progress}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: progress }}
          />
        </div>
      </div>

      <p className="text-slate-500 text-sm m-0">
        Due: {dueDate}
      </p>
    </div>
  );
}
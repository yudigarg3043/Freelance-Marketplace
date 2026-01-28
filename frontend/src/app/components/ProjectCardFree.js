export default function ProjectCardFree({ clientName, projectTitle, budget, deadline, progress }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1 m-0">
            {projectTitle}
          </h3>
          <p className="text-slate-500 text-sm m-0">
            Client: {clientName}
          </p>
        </div>
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

      <div className="flex justify-between text-slate-500 text-sm">
        <span>Budget: {budget}</span>
        <span>Deadline: {deadline}</span>
      </div>
    </div>
  );
}
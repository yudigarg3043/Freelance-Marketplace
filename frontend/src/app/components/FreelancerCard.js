export default function FreelancerCard({ name, title, rating, reviews, hourlyRate, skills }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 mb-1 m-0">
          {name}
        </h3>
        <p className="text-slate-500 text-sm m-0">
          {title}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-amber-500 text-sm font-bold">
          ★ {rating}
        </span>
        <span className="text-slate-500 text-sm">
          ({reviews} reviews)
        </span>
      </div>

      <div className="mb-4">
        <p className="text-slate-900 text-base font-bold m-0 mb-2">
          {hourlyRate}
        </p>
        <div className="flex gap-2 flex-wrap">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="bg-blue-50 text-slate-900 px-3 py-1 rounded text-xs font-bold"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm font-bold">
        View Profile
      </button>
    </div>
  );
}
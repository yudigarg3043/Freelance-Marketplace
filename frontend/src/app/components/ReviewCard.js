export default function ReviewCard({ clientName, rating, comment, project }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-600 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-1 m-0">
            {clientName}
          </h3>
          <p className="text-slate-500 text-sm m-0">
            {project}
          </p>
        </div>
        <span className="text-amber-500 text-base font-bold">
          {'★'.repeat(rating)}
        </span>
      </div>
      <p className="text-slate-500 text-sm leading-6 m-0">
        {comment}
      </p>
    </div>
  );
}
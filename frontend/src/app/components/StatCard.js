export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer">
      <p className="text-slate-500 text-sm mb-2 m-0">
        {title}
      </p>
      <p className="text-slate-900 text-3xl font-bold mb-2 m-0">
        {value}
      </p>
      <p className="text-slate-500 text-sm m-0">
        {subtitle}
      </p>
    </div>
  );
}
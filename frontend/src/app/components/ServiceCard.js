export default function ServiceCard({ title, description, price, orders, rating, status }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-1 m-0">
            {title}
          </h3>
          <p className="text-slate-500 text-sm m-0">
            {description}
          </p>
        </div>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-bold whitespace-nowrap ml-4">
          {status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-slate-500 text-xs mb-1 m-0">
            PRICE
          </p>
          <p className="text-slate-900 text-base font-bold m-0">
            {price}
          </p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-1 m-0">
            ORDERS
          </p>
          <p className="text-slate-900 text-base font-bold m-0">
            {orders}
          </p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-1 m-0">
            RATING
          </p>
          <p className="text-amber-500 text-base font-bold m-0">
            ★ {rating}
          </p>
        </div>
      </div>
    </div>
  );
}
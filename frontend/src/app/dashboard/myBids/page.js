"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "../../components/Layout/DashboardSidebar";

export default function MyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bids/my-bids`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch bids");
        }

        const data = await res.json();
        setBids(data);
      } catch (err) {
        setError("Could not load bids.");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  const BID_STATUS_STYLE = {
    pending: "bg-amber-50 text-amber-700 border border-amber-200",
    accepted: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    rejected: "bg-red-50 text-red-600 border border-red-200",
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar role="freelancer" />

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6">
          <h1 className="text-xl font-semibold text-slate-900">My Bids</h1>
        </header>

        <main className="p-6 flex-1 overflow-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Job Title</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Client</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : bids.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-500">
                      <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      No bids placed yet.
                    </td>
                  </tr>
                ) : (
                  bids.map((bid) => (
                    <tr key={bid._id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-medium">{bid.job?.title || <span className="text-slate-400 italic">Deleted Job</span>}</td>
                      <td className="px-6 py-4">{bid.job?.client?.name || "N/A"}</td>
                      <td className="px-6 py-4 font-semibold text-teal-600">₹{bid.amount?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(bid.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${BID_STATUS_STYLE[bid.status] || "bg-slate-100 text-slate-600"}`}>
                          {bid.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
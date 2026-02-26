"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Layout/Navbar";

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
        setBids(data.bids || []);
      } catch (err) {
        setError("Could not load bids.");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-6 text-slate-800 pt-16">My Bids</h1>

      <div className="bg-white rounded-2xl text-slate-700 shadow border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-3">Job Title</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500">
                  Loading...
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
                <td colSpan="5" className="text-center py-8 text-slate-500">
                  No bids found.
                </td>
              </tr>
            ) : (
              bids.map((bid) => (
                <tr key={bid._id} className="border-t">
                  <td className="px-6 py-4">{bid.job?.title}</td>
                  <td className="px-6 py-4">{bid.client?.name}</td>
                  <td className="px-6 py-4">${bid.amount}</td>
                  <td className="px-6 py-4">
                    {new Date(bid.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-slate-100">
                      {bid.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
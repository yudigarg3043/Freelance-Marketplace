'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
            Freelance Pro
          </h1>
        </Link>

        <ul className="flex gap-8 list-none m-0 p-0 items-center">
          <li>
            <Link href="/dashboard/client">
              <span className="text-slate-900 text-sm hover:text-blue-600 transition-colors cursor-pointer">
                For Clients
              </span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/freelancer">
              <span className="text-slate-900 text-sm hover:text-blue-600 transition-colors cursor-pointer">
                For Freelancers
              </span>
            </Link>
          </li>
          <li>
            <Link href="#browse">
              <span className="text-slate-900 text-sm hover:text-blue-600 transition-colors cursor-pointer">
                Browse Services
              </span>
            </Link>
          </li>
          <li>
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
              Sign In
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

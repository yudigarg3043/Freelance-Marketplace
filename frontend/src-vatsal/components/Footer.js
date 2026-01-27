'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 p-12 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-blue-600 text-lg font-bold mb-4">
              Freelance Pro
            </h3>
            <p className="text-slate-500 text-sm leading-6">
              Connect with talented freelancers or find your next project. Your success is our mission.
            </p>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="text-slate-900 text-base font-bold mb-4">
              For Clients
            </h4>
            <ul className="list-none p-0 m-0 space-y-2">
              <li>
                <Link href="/dashboard/client">
                  <span className="text-slate-500 text-sm hover:text-blue-600 transition-colors cursor-pointer">
                    Client Dashboard
                  </span>
                </Link>
              </li>
              <li>
                <Link href="#browse">
                  <span className="text-slate-500 text-sm hover:text-blue-600 transition-colors cursor-pointer">
                    Browse Services
                  </span>
                </Link>
              </li>
              <li>
                <Link href="#projects">
                  <span className="text-slate-500 text-sm hover:text-blue-600 transition-colors cursor-pointer">
                    How It Works
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h4 className="text-slate-900 text-base font-bold mb-4">
              For Freelancers
            </h4>
            <ul className="list-none p-0 m-0 space-y-2">
              <li>
                <Link href="/dashboard/freelancer">
                  <span className="text-slate-500 text-sm hover:text-blue-600 transition-colors cursor-pointer">
                    Freelancer Dashboard
                  </span>
                </Link>
              </li>
              <li>
                <Link href="#services">
                  <span className="text-slate-500 text-sm hover:text-blue-600 transition-colors cursor-pointer">
                    Post a Service
                  </span>
                </Link>
              </li>
              <li>
                <Link href="#pricing">
                  <span className="text-slate-500 text-sm hover:text-blue-600 transition-colors cursor-pointer">
                    Pricing
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-slate-900 text-base font-bold mb-4">
              Support
            </h4>
            <ul className="list-none p-0 m-0 space-y-2">
              <li>
                <Link href="#help">
                  <span className="text-slate-500 text-sm hover:text-blue-600 transition-colors cursor-pointer">
                    Help Center
                  </span>
                </Link>
              </li>
              <li>
                <Link href="#contact">
                  <span className="text-slate-500 text-sm hover:text-blue-600 transition-colors cursor-pointer">
                    Contact
                  </span>
                </Link>
              </li>
              <li>
                <Link href="#privacy">
                  <span className="text-slate-500 text-sm hover:text-blue-600 transition-colors cursor-pointer">
                    Privacy Policy
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-slate-500 text-sm m-0">
            &copy; {currentYear} Freelance Pro. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}
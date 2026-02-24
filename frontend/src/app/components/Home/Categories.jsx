"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const IconMap = {
  "Web Development": "code",
  "Design & Creative": "palette",
  "Writing & Content": "pen",
  "Marketing": "trending",
  "Video & Animation": "video",
  "Audio & Music": "headphones",
  "Translation": "globe",
  "Data Science": "database",
};

const ColorMap = {
  "Web Development": "teal",
  "Design & Creative": "orange",
  "Writing & Content": "emerald",
  "Marketing": "amber",
  "Video & Animation": "teal",
  "Audio & Music": "orange",
  "Translation": "emerald",
  "Data Science": "amber",
};

const SvgIcons = {
  code: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  palette: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4z" />
    </svg>
  ),
  pen: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  trending: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  video: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14" />
    </svg>
  ),
  headphones: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13" />
    </svg>
  ),
  globe: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9" />
    </svg>
  ),
  database: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7" />
    </svg>
  ),
};

export default function Categories() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/categories`
        );

        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-20 bg-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Explore thousands of opportunities across various industries
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const color = ColorMap[category.name] || "teal";
            const iconKey = IconMap[category.name] || "code";

            return (
              <div
                key={index}
                onClick={() =>
                  router.push(`/jobs?category=${category.name}`)
                }
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                    color === "teal"
                      ? "bg-teal-50 text-teal-600"
                      : color === "orange"
                      ? "bg-orange-50 text-orange-500"
                      : color === "emerald"
                      ? "bg-emerald-50 text-emerald-500"
                      : "bg-amber-50 text-amber-500"
                  }`}
                >
                  {SvgIcons[iconKey]}
                </div>

                <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">
                  {category.name}
                </h3>

                <p className="text-sm text-slate-500">
                  {category.count.toLocaleString()} jobs
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

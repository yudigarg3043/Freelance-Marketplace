"use client";

import React from 'react';

const EmptyState = ({ 
  icon, 
  title = "No results found", 
  description = "Try adjusting your search or filters to find what you're looking for.", 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
      <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 text-slate-300">
        {icon || (
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-8">{description}</p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-teal-100"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function FreelancerDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-8 py-12">
        {/* Welcome Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Freelancer Dashboard
          </h1>
          <p className="text-lg text-slate-500 leading-6">
            Manage your services and projects to grow your freelance business.
          </p>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Earnings" value="$8,250" subtitle="This month" />
          <StatCard title="Active Projects" value="3" subtitle="In progress" />
          <StatCard title="Profile Views" value="542" subtitle="This month" />
          <StatCard title="Completed Jobs" value="47" subtitle="All time" />
        </section>

        {/* Services Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 m-0">
              Your Services
            </h2>
            <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
              + Add Service
            </button>
          </div>
          <div className="space-y-4">
            <ServiceCard
              title="Full Stack Web Development"
              description="Build custom web applications with React, Node.js, and databases"
              price="$85/hr"
              orders="23"
              rating="4.9"
              status="Active"
            />
            <ServiceCard
              title="REST API Development"
              description="Create scalable and secure REST APIs for your applications"
              price="$75/hr"
              orders="18"
              rating="4.8"
              status="Active"
            />
            <ServiceCard
              title="Database Design & Optimization"
              description="Design efficient databases and optimize existing queries"
              price="$65/hr"
              orders="12"
              rating="4.7"
              status="Active"
            />
          </div>
        </section>

        {/* Active Projects */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Active Projects
          </h2>
          <div className="space-y-4">
            <ProjectCard
              clientName="Tech Startup Inc."
              projectTitle="E-commerce Platform Development"
              budget="$5,000"
              deadline="Mar 10, 2026"
              progress="55%"
            />
            <ProjectCard
              clientName="Digital Agency Co."
              projectTitle="Mobile App Backend"
              budget="$3,200"
              deadline="Feb 28, 2026"
              progress="80%"
            />
            <ProjectCard
              clientName="Small Business LLC"
              projectTitle="Website Maintenance & Support"
              budget="$1,500/month"
              deadline="Ongoing"
              progress="100%"
            />
          </div>
        </section>

        {/* Recent Reviews */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Recent Reviews
          </h2>
          <div className="space-y-4">
            <ReviewCard
              clientName="Sarah Johnson"
              rating="5"
              comment="Excellent work! Very responsive and delivered on time. Highly recommended!"
              project="E-commerce Platform Development"
            />
            <ReviewCard
              clientName="Michael Chen"
              rating="5"
              comment="Great attention to detail. The code is clean and well-documented."
              project="REST API Development"
            />
            <ReviewCard
              clientName="Emma Davis"
              rating="4"
              comment="Good work overall. Communication could have been better."
              project="Database Optimization"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({ title, value, subtitle }) {
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

function ServiceCard({ title, description, price, orders, rating, status }) {
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

function ProjectCard({ clientName, projectTitle, budget, deadline, progress }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1 m-0">
            {projectTitle}
          </h3>
          <p className="text-slate-500 text-sm m-0">
            Client: {clientName}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-slate-500 text-sm">
            Progress
          </span>
          <span className="text-slate-900 text-sm font-bold">
            {progress}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: progress }}
          />
        </div>
      </div>

      <div className="flex justify-between text-slate-500 text-sm">
        <span>Budget: {budget}</span>
        <span>Deadline: {deadline}</span>
      </div>
    </div>
  );
}

function ReviewCard({ clientName, rating, comment, project }) {
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

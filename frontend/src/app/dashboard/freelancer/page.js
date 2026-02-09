'use client';

import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import StatCard from '../../components/StatCard';
import ServiceCard from '../../components/ServiceCard';
import ReviewCard from '../../components/ReviewCard';
import ProjectCardFree from '../../components/ProjectCardFree';

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
            <ProjectCardFree
              clientName="Tech Startup Inc."
              projectTitle="E-commerce Platform Development"
              budget="$5,000"
              deadline="Mar 10, 2026"
              progress="55%"
            />
            <ProjectCardFree
              clientName="Digital Agency Co."
              projectTitle="Mobile App Backend"
              budget="$3,200"
              deadline="Feb 28, 2026"
              progress="80%"
            />
            <ProjectCardFree
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
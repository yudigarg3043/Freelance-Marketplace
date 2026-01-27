'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ClientDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-8 py-12">
        {/* Welcome Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Client Dashboard
          </h1>
          <p className="text-lg text-slate-500 leading-6">
            Find and hire talented freelancers to bring your projects to life.
          </p>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Spent" value="$2,450" subtitle="This month" />
          <StatCard title="Active Projects" value="5" subtitle="In progress" />
          <StatCard title="Saved Freelancers" value="12" subtitle="Available" />
          <StatCard title="Completed Projects" value="24" subtitle="All time" />
        </section>

        {/* Active Projects Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 m-0">
              Your Active Projects
            </h2>
            <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
              Hire Freelancer
            </button>
          </div>
          <div className="space-y-4">
            <ProjectCard
              title="Website Redesign"
              freelancer="Sarah Johnson"
              status="In Progress"
              progress="65%"
              dueDate="Mar 15, 2026"
            />
            <ProjectCard
              title="Mobile App Development"
              freelancer="Alex Chen"
              status="In Progress"
              progress="40%"
              dueDate="Apr 2, 2026"
            />
            <ProjectCard
              title="Logo Design"
              freelancer="Maria Rodriguez"
              status="Review"
              progress="90%"
              dueDate="Feb 1, 2026"
            />
          </div>
        </section>

        {/* Suggested Freelancers */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Suggested Freelancers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FreelancerCard
              name="Alex Turner"
              title="Full Stack Developer"
              rating="4.9"
              reviews="128"
              hourlyRate="$85/hr"
              skills={['React', 'Node.js', 'PostgreSQL']}
            />
            <FreelancerCard
              name="Emma Davis"
              title="UI/UX Designer"
              rating="4.8"
              reviews="95"
              hourlyRate="$65/hr"
              skills={['Figma', 'Prototyping', 'User Research']}
            />
            <FreelancerCard
              name="James Wilson"
              title="Python Developer"
              rating="4.7"
              reviews="82"
              hourlyRate="$75/hr"
              skills={['Python', 'Django', 'Machine Learning']}
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

function ProjectCard({ title, freelancer, status, progress, dueDate }) {
  const statusColors = {
    'In Progress': 'bg-blue-600',
    'Review': 'bg-amber-500',
    'Completed': 'bg-green-600'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1 m-0">
            {title}
          </h3>
          <p className="text-slate-500 text-sm m-0">
            with {freelancer}
          </p>
        </div>
        <span className={`${statusColors[status]} text-white px-3 py-1 rounded text-xs font-bold`}>
          {status}
        </span>
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

      <p className="text-slate-500 text-sm m-0">
        Due: {dueDate}
      </p>
    </div>
  );
}

function FreelancerCard({ name, title, rating, reviews, hourlyRate, skills }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 mb-1 m-0">
          {name}
        </h3>
        <p className="text-slate-500 text-sm m-0">
          {title}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-amber-500 text-sm font-bold">
          ★ {rating}
        </span>
        <span className="text-slate-500 text-sm">
          ({reviews} reviews)
        </span>
      </div>

      <div className="mb-4">
        <p className="text-slate-900 text-base font-bold m-0 mb-2">
          {hourlyRate}
        </p>
        <div className="flex gap-2 flex-wrap">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="bg-blue-50 text-slate-900 px-3 py-1 rounded text-xs font-bold"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm font-bold">
        View Profile
      </button>
    </div>
  );
}

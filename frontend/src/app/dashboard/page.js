'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ActivityItem from '../components/ActivityItem';
import StatCardDash from '../components/StatCardDash';

export default function Dashboard() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
      }} className='pt-16'
    >
      <Navbar />

      <main
        style={{
          flex: 1,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '3rem 2rem',
        }}
      >
        {/* Hero Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#0F172A',
              marginBottom: '1rem',
            }}
          >
            Welcome to Your Dashboard
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              color: '#64748B',
              lineHeight: '1.6',
              marginBottom: '2rem',
            }}
          >
            Manage your projects and tasks efficiently with our intuitive dashboard.
          </p>
        </section>

        {/* Stats Section */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          <StatCardDash title="Total Projects" value="12" />
          <StatCardDash title="Active Tasks" value="24" />
          <StatCardDash title="Team Members" value="8" />
          <StatCardDash title="Completion Rate" value="85%" />
        </section>

        {/* Recent Activity Section */}
        <section>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#0F172A',
              marginBottom: '1.5rem',
            }}
          >
            Recent Activity
          </h2>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              overflow: 'hidden',
            }}
          >
            <ActivityItem
              title="Project Alpha"
              description="Completed Phase 1 development"
              timestamp="2 hours ago"
            />
            <ActivityItem
              title="Team Meeting"
              description="Quarterly review scheduled"
              timestamp="5 hours ago"
              isLast={true}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
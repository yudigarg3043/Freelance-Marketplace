'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Dashboard() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
      }}
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
          <StatCard title="Total Projects" value="12" />
          <StatCard title="Active Tasks" value="24" />
          <StatCard title="Team Members" value="8" />
          <StatCard title="Completion Rate" value="85%" />
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

function StatCard({ title, value }) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#2563EB';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E5E7EB';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <p
        style={{
          color: '#64748B',
          fontSize: '0.875rem',
          margin: '0 0 0.5rem 0',
        }}
      >
        {title}
      </p>
      <p
        style={{
          color: '#0F172A',
          fontSize: '2rem',
          fontWeight: 'bold',
          margin: 0,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function ActivityItem({ title, description, timestamp, isLast = false }) {
  return (
    <div
      style={{
        padding: '1.5rem',
        borderBottom: isLast ? 'none' : '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'background-color 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#F8FAFC';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <div>
        <p
          style={{
            color: '#0F172A',
            fontSize: '1rem',
            fontWeight: '600',
            margin: '0 0 0.25rem 0',
          }}
        >
          {title}
        </p>
        <p
          style={{
            color: '#64748B',
            fontSize: '0.875rem',
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
      <span
        style={{
          color: '#64748B',
          fontSize: '0.875rem',
          whiteSpace: 'nowrap',
          marginLeft: '1rem',
        }}
      >
        {timestamp}
      </span>
    </div>
  );
}

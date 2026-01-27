'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import StatsGrid from '../components/StatsGrid';
import QuickActions from '../components/QuickActions';
import ActiveProjects from '../components/ActiveProjects';
import EarningsChart from '../components/EarningsChart';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ stats: {}, jobs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch all data
    Promise.all([
      fetch('http://localhost:4080/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()),
      fetch('http://localhost:4080/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json())
    ])
    .then(([userData, dashboardData]) => {
      setUser(userData.user);
      setData(dashboardData);
      setLoading(false);
    })
    .catch(() => router.push('/login'));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Header user={user} />
      <div className={styles.content}>
        <StatsGrid stats={data.stats} />
        <QuickActions />
        <div className={styles.grid}>
          <ActiveProjects jobs={data.jobs} />
          <EarningsChart stats={data.stats} />
        </div>
      </div>
    </div>
  );
}

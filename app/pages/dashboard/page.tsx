'use client';

import dynamic from 'next/dynamic';

const DashboardPage = dynamic(() => import('@/pages/DashboardPage'), {
  loading: () => <div className="flex items-center justify-center h-screen">Loading dashboard...</div>
});

export default function DashboardRoute() {
  return <DashboardPage />;
}
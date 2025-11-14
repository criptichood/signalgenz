'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const DashboardPage = dynamicImport(() => import('@/page-components/DashboardPage'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen">Loading dashboard...</div>
});

export default function DashboardRoute() {
  return <DashboardPage />;
}

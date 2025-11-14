'use client';

import dynamic from 'next/dynamic';

const HistoryPage = dynamic(() => import('@/pages/HistoryPage'), {
  loading: () => <div className="flex items-center justify-center h-screen">Loading history...</div>
});

export default function HistoryRoute() {
  return <HistoryPage />;
}
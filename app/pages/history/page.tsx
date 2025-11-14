'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const HistoryPage = dynamicImport(() => import('@/page-components/HistoryPage'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen">Loading history...</div>
});

export default function HistoryRoute() {
  return <HistoryPage />;
}

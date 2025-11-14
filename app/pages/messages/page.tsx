'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const MessagesPage = dynamicImport(() => import('@/page-components/MessagesPage'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen">Loading messages...</div>
});

export default function MessagesRoute({ handleNavigateToProfile }: { handleNavigateToProfile: (username: string) => void }) {
  return <MessagesPage onNavigateToProfile={handleNavigateToProfile} />;
}

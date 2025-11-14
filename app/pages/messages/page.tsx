'use client';

import dynamic from 'next/dynamic';

const MessagesPage = dynamic(() => import('@/pages/MessagesPage'), {
  loading: () => <div className="flex items-center justify-center h-screen">Loading messages...</div>
});

export default function MessagesRoute({ handleNavigateToProfile }: { handleNavigateToProfile: (username: string) => void }) {
  return <MessagesPage onNavigateToProfile={handleNavigateToProfile} />;
}
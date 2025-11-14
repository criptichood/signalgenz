'use client';

import dynamic from 'next/dynamic';

const ProfilePage = dynamic(() => import('@/pages/ProfilePage'), {
  loading: () => <div className="flex items-center justify-center h-screen">Loading profile...</div>
});

export default function ProfileRoute({ handleNavigateToProfile }: { handleNavigateToProfile: (username: string) => void }) {
  return <ProfilePage onNavigateToProfile={handleNavigateToProfile} />;
}
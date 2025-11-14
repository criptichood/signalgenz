'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const ProfilePage = dynamicImport(() => import('@/page-components/ProfilePage'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen">Loading profile...</div>
});

export default function ProfileRoute({ handleNavigateToProfile }: { handleNavigateToProfile: (username: string) => void }) {
  return <ProfilePage onNavigateToProfile={handleNavigateToProfile} />;
}

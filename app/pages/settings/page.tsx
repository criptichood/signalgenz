'use client';

import dynamic from 'next/dynamic';

const SettingsPage = dynamic(() => import('@/pages/SettingsPage'), {
  loading: () => <div className="flex items-center justify-center h-screen">Loading settings...</div>
});

export default function SettingsRoute() {
  return <SettingsPage />;
}
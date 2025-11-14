'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const SettingsPage = dynamicImport(() => import('@/page-components/SettingsPage'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen">Loading settings...</div>
});

export default function SettingsRoute() {
  return <SettingsPage />;
}

'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const MainApp = dynamicImport(() => import('./main-app'), {
  ssr: false,
});

export default function HomePage() {
  return <MainApp />;
}
'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const ScreenerPage = dynamicImport(() => import('@/page-components/ScreenerPage'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen">Loading screener...</div>
});

export default function ScreenerRoute({ signalGenerator }: { signalGenerator: any }) {
  if (!signalGenerator) {
    return <div>Loading...</div>;
  }

  return (
    <ScreenerPage
      onGenerateSignal={signalGenerator.triggerSignalGeneration}
      onGenerateScalp={signalGenerator.triggerScalpGeneration}
    />
  );
}

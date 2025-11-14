'use client';

import dynamic from 'next/dynamic';

const ScreenerPage = dynamic(() => import('@/pages/ScreenerPage'), {
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
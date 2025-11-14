'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

const ScalpingPageComponent = dynamicImport(() => import('@/page-components/ScalpingPage'), {
  ssr: false,
});

export default function ScalpingRoute({ 
  bybitApiKey, 
  bybitApiSecret, 
  signalGenerator,
  handleShareSignalAsPost
}: { 
  bybitApiKey: string; 
  bybitApiSecret: string; 
  signalGenerator: any;
  handleShareSignalAsPost: (signal: any) => void;
}) {
  if (!signalGenerator) {
    return <div>Loading...</div>;
  }

  return (
    <ScalpingPageComponent 
      bybitApiKey={bybitApiKey} 
      bybitApiSecret={bybitApiSecret} 
      controller={signalGenerator.scalpController}
      onShareSignalAsPost={handleShareSignalAsPost}
    />
  );
}

'use client';

import ScalpingPage from '@/pages/ScalpingPage';

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
    <ScalpingPage 
      bybitApiKey={bybitApiKey} 
      bybitApiSecret={bybitApiSecret} 
      controller={signalGenerator.scalpController}
      onShareSignalAsPost={handleShareSignalAsPost}
    />
  );
}
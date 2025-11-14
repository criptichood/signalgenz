'use client';

import { useEffect } from 'react';
import SignalGenPage from '@/pages/SignalGenPage';

export default function SignalGenRoute({
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
  // When rendered as a route, we need to access the signalGenerator from context
  // This is a client-only component since it contains browser-specific code
  if (!signalGenerator) {
    // Fallback if signalGenerator isn't passed as prop
    return <div>Loading...</div>;
  }

  return (
    <SignalGenPage
      bybitApiKey={bybitApiKey}
      bybitApiSecret={bybitApiSecret}
      controller={signalGenerator.signalGenController}
      onShareSignalAsPost={handleShareSignalAsPost}
    />
  );
}
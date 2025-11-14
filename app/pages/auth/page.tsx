'use client';

import dynamic from 'next/dynamic';

// Dynamically import AuthPage without SSR since it might have browser-specific code
const AuthPage = dynamic(() => import('@/pages/AuthPage'), {
  loading: () => <div className="flex items-center justify-center h-screen">Loading authentication...</div>
});

export default function AuthRoute() {
  return <AuthPage onAuthSuccess={() => {}} />;
}
'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';

// Dynamically import AuthPage without SSR since it might have browser-specific code
const AuthPage = dynamicImport(() => import('@/page-components/AuthPage'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen">Loading authentication...</div>
});

export default function AuthRoute() {
  return <AuthPage onAuthSuccess={() => {}} />;
}

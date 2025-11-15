'use client';

import MainApp from './main-app';

export default function HomePage({ children }: { children: React.ReactNode }) {
  return <MainApp>{children}</MainApp>;
}
'use client';

import { useRef } from 'react';
import { useStore } from '@/store';
import { useSocialStore } from '@/store/socialStore';
import { useScreenerStore } from '@/store/screenerStore';

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  // Using useRef to ensure stores are created only once
  const appStoreRef = useRef<any>(null);
  const socialStoreRef = useRef<any>(null);
  const screenerStoreRef = useRef<any>(null);

  if (!appStoreRef.current) {
    appStoreRef.current = useStore();
  }

  if (!socialStoreRef.current) {
    socialStoreRef.current = useSocialStore();
  }

  if (!screenerStoreRef.current) {
    screenerStoreRef.current = useScreenerStore();
  }

  // Since these are Zustand stores, we don't need Provider components for client-side only
  // Zustand stores are global by default when instantiated in client components
  return <>{children}</>;
}
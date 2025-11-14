'use client';

import React from 'react';
import type { Page } from '@/types';
import { TrendingUp, Menu } from 'lucide-react';
import { NotificationBell } from '@/components/header/NotificationBell';
import { useStore } from '@/store';
import { useSocialStore } from '@/store/socialStore';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { setCurrentPage } = useStore();
  const { notifications, users, setActiveConversationId, handleMarkNotificationsAsRead } = useSocialStore();

  const handleNavigate = (page: Page, relatedId?: string) => {
    setCurrentPage(page);
    if (page === 'messages' && relatedId) {
        setActiveConversationId(relatedId);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border shadow-lg">
      <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div className="hidden lg:flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold tracking-wider">
              Signal <span className="text-primary">Gen</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
            <NotificationBell
                notifications={notifications}
                onNavigate={handleNavigate}
                onMarkAsRead={handleMarkNotificationsAsRead}
                users={users}
            />
        </div>

      </div>
    </header>
  );
};
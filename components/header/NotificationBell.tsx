'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import type { Notification } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NotificationBellProps {
  notifications: Notification[];
  onNavigate: (page: any, relatedId?: string) => void;
  onMarkAsRead: (ids: string[]) => void;
  users: any; // Replace any with actual type if available
}

export const NotificationBell = ({ 
  notifications, 
  onNavigate, 
  onMarkAsRead 
}: NotificationBellProps) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const handleMarkAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    onMarkAsRead(unreadIds);
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    onMarkAsRead([notification.id]);
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'new_message':
        onNavigate('messages', notification.relatedEntityId);
        break;
      default:
        onNavigate('messages');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <div className="p-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
          
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground p-2">No notifications</p>
          ) : (
            <div className="space-y-1">
              {notifications.slice(0, 10).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`cursor-pointer ${!notification.isRead ? 'bg-accent' : ''}`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {notification.type === 'new_message' && 'New message'}
                      {notification.type === 'new_follower' && 'New follower'}
                      {notification.type === 'post_like' && 'Post liked'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      From: {notification.fromUsername}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="h-2 w-2 rounded-full bg-primary ml-2" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
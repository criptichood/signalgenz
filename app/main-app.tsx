'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { useSocialStore } from '@/store/socialStore';
import { useScreenerStore } from '@/store/screenerStore';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { useChat } from '@/hooks/useChat';
import { useSignalGenerator } from '@/hooks/useSignalGenerator';
import { Toast } from '@/components/ui/toast';
import { SharePostModal } from '@/components/messages/SharePostModal';
import { ViewPostModal } from '@/components/profile/ViewPostModal';
import { Page, PageContext } from '@/types';





export default function MainApp({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const {
    // State
    isAuthenticated,
    bybitApiKey, bybitApiSecret, isSidebarOpen,
    theme, audioAlertsEnabled,
    contextualChatEnabled, functionCallingEnabled,
    chatIcon, isChatOpen, toast,
    // Actions
    login, setIsSidebarOpen, setIsChatOpen, setToast
  } = useStore();

  const {
    users, posts,
    setConversations, setNotifications, setPostToView, setPostToShare,
    setViewingProfileUsername,
    postToShare, postToView,
    handleCreateStrategy, handleCreatePost,
    handleSharePost, handleShareSignalAsPost,
  } = useSocialStore();

  const { pruneOldScans } = useScreenerStore();

  const currentUser = useMemo(() => users?.find(u => u.username === 'CryptoTrader123'), [users]);

  // Apply theme changes to the DOM
  useEffect(() => {
    const themeName = `${theme.mode}-${theme.accent}`;
    document.documentElement.dataset.theme = themeName;
  }, [theme]);

  // Prune old screener runs on initial app load
  useEffect(() => {
    pruneOldScans();
  }, [pruneOldScans]);

  useEffect(() => {
    const hasReceivedMockMessage = localStorage.getItem('hasReceivedMockMessage');
    if (!hasReceivedMockMessage) {
      const timer = setTimeout(() => {
        const newMessage: any = { // Using any since we need the full type definition
          id: crypto.randomUUID(),
          senderUsername: 'JaneTrader',
          content: 'Hey! Saw your last BTC trade, nice analysis. What do you think about the SOL chart right now?',
          timestamp: Date.now(),
          isRead: false,
        };

        let convoId = '';
        setConversations(prev => {
          return prev.map(convo => {
            if (convo.participantUsernames.includes('JaneTrader')) {
              convoId = convo.id;
              return { ...convo, messages: [...convo.messages, newMessage] };
            }
            return convo;
          });
        });

        const newNotification: any = {
          id: crypto.randomUUID(),
          type: 'new_message',
          fromUsername: 'JaneTrader',
          relatedEntityId: convoId,
          timestamp: Date.now(),
          isRead: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
        setToast({ message: "New message from @JaneTrader", variant: 'success' });

        localStorage.setItem('hasReceivedMockMessage', 'true');
      }, 5000); // 5 seconds after app load

      return () => clearTimeout(timer);
    }
  }, [setConversations, setNotifications, setToast]); // Run only once

  const handleNavigateToProfile = (username: string) => {
    if (currentUser && username === currentUser.username) {
      setViewingProfileUsername(null);
      router.push('/profile' as any);
    } else {
      setViewingProfileUsername(username);
      router.push('/view-profile' as any);
    }
  };

  const signalGenerator = useSignalGenerator(audioAlertsEnabled);

  const signalGenState = signalGenerator.signalGenController.generationState;
  const scalpState = signalGenerator.scalpController.generationState;

  const pageContext: PageContext = {
    page: pathname.split('/')[1] as Page || 'dashboard', // Derive page from pathname
    symbol: pathname.split('/')[1] === 'signal-gen' ? signalGenState.currentParams?.symbol : pathname.split('/')[1] === 'scalping' ? scalpState.currentParams?.symbol : undefined,
    timeframe: pathname.split('/')[1] === 'signal-gen' ? signalGenState.currentParams?.timeframe : pathname.split('/')[1] === 'scalping' ? scalpState.currentParams?.timeframe : undefined,
    model: pathname.split('/')[1] === 'signal-gen' ? signalGenState.currentParams?.model : pathname.split('/')[1] === 'scalping' ? scalpState.currentParams?.model : undefined,
    contextualChatEnabled,
    functionCallingEnabled,
    signal: pathname.split('/')[1] === 'signal-gen' ? signalGenState.signal : pathname.split('/')[1] === 'scalping' ? scalpState.signal : null,
    params: pathname.split('/')[1] === 'signal-gen' ? signalGenState.currentParams : pathname.split('/')[1] === 'scalping' ? scalpState.currentParams : null,
  };

  const chatController = useChat(
    pageContext,
    signalGenerator.triggerSignalGeneration,
    signalGenerator.triggerScalpGeneration,
    handleCreateStrategy,
    handleCreatePost,
    setToast
  );



  return (
    <div className="relative flex min-h-screen bg-black text-gray-100 font-sans">
      {toast && <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />}

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {currentUser && (
        <ChatWidget
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onOpen={() => setIsChatOpen(true)}
          context={pageContext}
          chatController={chatController}
          chatIcon={chatIcon}
          currentUser={currentUser}
          onNavigate={router.push} // Use router.push for chat navigation
        />
      )}

      <SharePostModal
        isOpen={!!postToShare}
        onClose={() => setPostToShare(null)}
        onSelectUser={(username) => handleSharePost(username, router.push)} // Use router.push for share post navigation
      />
      <ViewPostModal
        post={postToView}
        onClose={() => {
          setPostToView(null);
          // Note: For hash-based routing replacement, we'd need to update URL differently
        }}
        onNavigateToProfile={handleNavigateToProfile}
      />
    </div>
  );
}

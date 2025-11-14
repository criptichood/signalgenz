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
import { PageContext } from '@/types';

// Dynamic imports for all pages
import dynamic from 'next/dynamic';

const DashboardPage = dynamic(() => import('@/page-components/DashboardPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading dashboard...</div>
});
const SignalGenPage = dynamic(() => import('@/page-components/SignalGenPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading signal generator...</div>
});
const ScalpingPage = dynamic(() => import('@/page-components/ScalpingPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading scalping...</div>
});
const MemesScalpPage = dynamic(() => import('@/page-components/MemesScalpPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading memes scalping...</div>
});
const ScreenerPage = dynamic(() => import('@/page-components/ScreenerPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading screener...</div>
});
const NewsPage = dynamic(() => import('@/page-components/NewsPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading news...</div>
});
const HistoryPage = dynamic(() => import('@/page-components/HistoryPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading history...</div>
});
const SimulationPage = dynamic(() => import('@/page-components/SimulationPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading simulation...</div>
});
const SpotLogPage = dynamic(() => import('@/page-components/SpotLogPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading spot log...</div>
});
const PerpLogPage = dynamic(() => import('@/page-components/PerpLogPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading perp log...</div>
});
const TutorialsPage = dynamic(() => import('@/page-components/TutorialsPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading tutorials...</div>
});
const CalculatorPage = dynamic(() => import('@/page-components/CalculatorPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading calculator...</div>
});
const AnalyticsPage = dynamic(() => import('@/page-components/AnalyticsPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading analytics...</div>
});
const StablecoinStashPage = dynamic(() => import('@/page-components/StablecoinStashPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading stablecoin stash...</div>
});
const StrategyPage = dynamic(() => import('@/page-components/StrategyPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading strategies...</div>
});
const ProfilePage = dynamic(() => import('@/page-components/ProfilePage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading profile...</div>
});
const SettingsPage = dynamic(() => import('@/page-components/SettingsPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading settings...</div>
});
const DiscoverPage = dynamic(() => import('@/page-components/DiscoverPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading discover...</div>
});
const MessagesPage = dynamic(() => import('@/page-components/MessagesPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading messages...</div>
});
const AuthPage = dynamic(() => import('@/page-components/AuthPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading authentication...</div>
});
const ManualStudioPage = dynamic(() => import('@/page-components/ManualStudioPage'), {

  loading: () => <div className="flex items-center justify-center h-screen">Loading manual studio...</div>
});

// Mapping of page names to components
const pageComponents: Record<string, React.ComponentType<any>> = {
  'dashboard': DashboardPage,
  'signal-gen': SignalGenPage,
  'scalping': ScalpingPage,
  'manual-studio': ManualStudioPage,
  'memes-scalp': MemesScalpPage,
  'screener': ScreenerPage,
  'discover': DiscoverPage,
  'messages': MessagesPage,
  'profile': ProfilePage,
  'view-profile': ProfilePage,
  'news': NewsPage,
  'history': HistoryPage,
  'spot-log': SpotLogPage,
  'perp-log': PerpLogPage,
  'simulation': SimulationPage,
  'analytics': AnalyticsPage,
  'calculator': CalculatorPage,
  'stablecoin-stash': StablecoinStashPage,
  'strategies': StrategyPage,
  'tutorials': TutorialsPage,
  'settings': SettingsPage,
};

export default function MainApp() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract page from pathname (e.g., /dashboard -> 'dashboard', /signal-gen -> 'signal-gen')
  const currentPage = pathname ? pathname.split('/')[1] || 'dashboard' : 'dashboard';
  
  const {
    // State
    isAuthenticated,
    bybitApiKey, bybitApiSecret, isSidebarOpen,
    theme, audioAlertsEnabled,
    contextualChatEnabled, functionCallingEnabled,
    chatIcon, isChatOpen, toast,
    // Actions
    login, setCurrentPage, setIsSidebarOpen, setIsChatOpen, setToast
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

  // Simulate receiving a message for notification demo
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

  const signalGenerator = useSignalGenerator(setCurrentPage, audioAlertsEnabled);

  const signalGenState = signalGenerator.signalGenController.generationState;
  const scalpState = signalGenerator.scalpController.generationState;

  const pageContext: PageContext = {
    page: currentPage as any,
    symbol: currentPage === 'signal-gen' ? signalGenState.currentParams?.symbol : currentPage === 'scalping' ? scalpState.currentParams?.symbol : undefined,
    timeframe: currentPage === 'signal-gen' ? signalGenState.currentParams?.timeframe : currentPage === 'scalping' ? scalpState.currentParams?.timeframe : undefined,
    model: currentPage === 'signal-gen' ? signalGenState.currentParams?.model : currentPage === 'scalping' ? scalpState.currentParams?.model : undefined,
    contextualChatEnabled,
    functionCallingEnabled,
    signal: currentPage === 'signal-gen' ? signalGenState.signal : currentPage === 'scalping' ? scalpState.signal : null,
    params: currentPage === 'signal-gen' ? signalGenState.currentParams : currentPage === 'scalping' ? scalpState.currentParams : null,
  };

  const chatController = useChat(
    pageContext,
    signalGenerator.triggerSignalGeneration,
    signalGenerator.triggerScalpGeneration,
    handleCreateStrategy,
    handleCreatePost,
    setToast
  );

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={login} />;
  }

  // Get the component for the current page
  const PageComponent = pageComponents[currentPage] || DashboardPage;

  return (
    <div className="relative flex min-h-screen bg-black text-gray-100 font-sans">
      {toast && <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />}

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {/* Render the appropriate page based on route */}
          <PageComponent
            bybitApiKey={bybitApiKey}
            bybitApiSecret={bybitApiSecret}
            signalGenerator={signalGenerator}
            handleShareSignalAsPost={(signal) => handleShareSignalAsPost(signal, setCurrentPage)}
            handleNavigateToProfile={handleNavigateToProfile}
            onNavigate={setCurrentPage}
            pageContext={pageContext}
            chatController={chatController}
            currentUser={currentUser}
          />
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
          onNavigate={setCurrentPage}
        />
      )}

      <SharePostModal
        isOpen={!!postToShare}
        onClose={() => setPostToShare(null)}
        onSelectUser={(username) => handleSharePost(username, setCurrentPage)}
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



'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { Page, ChatIconType } from '@/types';
import { useStore } from '@/store';
import { useSocialStore } from '@/store/socialStore';
import {
    TrendingUp, Zap, Newspaper, History, TestTube2, BarChartBig, Calculator, Book, FileText, Shield, Layers, User,
    Bot, Settings, Sparkles, Lightbulb, MessageSquare, Compass, Mail, Home, ScanLine, LogOut, Pencil, Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';




const ChatIcon = ({ icon, className }: { icon: ChatIconType; className: string }) => {
    switch (icon) {
        case 'sparkles': return <Sparkles className={className} />;
        case 'lightbulb': return <Lightbulb className={className} />;
        case 'message': return <MessageSquare className={className} />;
        case 'bot':
        default:
            return <Bot className={className} />;
    }
};


export const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const {
        isSidebarOpen, setIsSidebarOpen,
        setIsChatOpen, chatIcon, logout
    } = useStore();
    const { conversations, users, setViewingProfileUsername } = useSocialStore();
    const currentUser = useMemo(() => users?.find(u => u.username === 'CryptoTrader123'), [users]);

    const unreadMessagesCount = useMemo(() => {
        if (!currentUser) return 0;
        return conversations.reduce((count, convo) => {
            if (convo.participantUsernames.includes(currentUser.username)) {
                return count + convo.messages.filter(m => m.senderUsername !== currentUser.username && !m.isRead).length;
            }
            return count;
        }, 0);
    }, [conversations, currentUser]);

    const handleNavigation = (href: string) => {
        if (href === '/profile') {
            setViewingProfileUsername(null);
        }
        router.push(href);
        if (window.innerWidth < 1024) { // Close sidebar on mobile after navigation
            setIsSidebarOpen(false);
        }
    };

    const handleOpenChat = () => {
        setIsChatOpen(true);
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

  return (
    <>
        {/* Overlay for mobile */}
        <div
            className={`fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsSidebarOpen(false)}
        ></div>

        <aside className={`bg-background border-r border-border w-64 flex-shrink-0 transform transition-transform duration-300 ease-in-out z-40 fixed inset-y-0 left-0 flex flex-col lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-center h-16 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-primary" />
                    <h1 className="text-xl font-bold tracking-wider">
                        Signal <span className="text-primary">Gen</span>
                    </h1>
                </div>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                <h3 className="px-4 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Analysis</h3>
                <Link href="/dashboard" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/dashboard' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/dashboard')}
                    >
                        <Home className="w-5 h-5" />
                        <span className="ml-3">Dashboard</span>
                    </Button>
                </Link>
                <Link href="/signal-gen" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/signal-gen' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/signal-gen')}
                    >
                        <TrendingUp className="w-5 h-5" />
                        <span className="ml-3">Signal Gen</span>
                    </Button>
                </Link>
                <Link href="/scalping" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/scalping' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/scalping')}
                    >
                        <Zap className="w-5 h-5" />
                        <span className="ml-3">Scalping</span>
                    </Button>
                </Link>
                <Link href="/memes-scalp" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/memes-scalp' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/memes-scalp')}
                    >
                        <Flame className="w-5 h-5" />
                        <span className="ml-3">Memes Scalp</span>
                    </Button>
                </Link>
                <Link href="/manual-studio" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/manual-studio' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/manual-studio')}
                    >
                        <Pencil className="w-5 h-5" />
                        <span className="ml-3">Man Signal</span>
                    </Button>
                </Link>
                <Link href="/screener" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/screener' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/screener')}
                    >
                        <ScanLine className="w-5 h-5" />
                        <span className="ml-3">Screener</span>
                    </Button>
                </Link>
                <Link href="/news" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/news' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/news')}
                    >
                        <Newspaper className="w-5 h-5" />
                        <span className="ml-3">News</span>
                    </Button>
                </Link>
                <Link href="/history" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/history' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/history')}
                    >
                        <History className="w-5 h-5" />
                        <span className="ml-3">AI Signal History</span>
                    </Button>
                </Link>
                <Link href="/simulation" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/simulation' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/simulation')}
                    >
                        <TestTube2 className="w-5 h-5" />
                        <span className="ml-3">Simulation</span>
                    </Button>
                </Link>

                 <div className="pt-2">
                    <h3 className="px-4 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assistant</h3>
                     <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleOpenChat}
                    >
                        <ChatIcon icon={chatIcon} className="w-5 h-5 mr-3" />
                        AI Assistant
                    </Button>
                </div>

                <div className="pt-2">
                    <h3 className="px-4 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Logs</h3>
                    <Link href="/spot-log" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/spot-log' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/spot-log')}
                    >
                        <FileText className="w-5 h-5" />
                        <span className="ml-3">Spot Log</span>
                    </Button>
                </Link>
                    <Link href="/perp-log" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/perp-log' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/perp-log')}
                    >
                        <FileText className="w-5 h-5" />
                        <span className="ml-3">Perp Log</span>
                    </Button>
                </Link>
                </div>

                <div className="pt-2">
                    <h3 className="px-4 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Social</h3>
                    <Link href="/discover" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/discover' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/discover')}
                    >
                        <Compass className="w-5 h-5" />
                        <span className="ml-3">Discover</span>
                    </Button>
                </Link>
                    <Link href="/messages" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/messages' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/messages')}
                    >
                        <Mail className="w-5 h-5" />
                        <span className="ml-3">Messages</span>
                        {unreadMessagesCount > 0 && (
                            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                            </span>
                        )}
                    </Button>
                </Link>
                    <Link href="/strategies" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/strategies' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/strategies')}
                    >
                        <Layers className="w-5 h-5" />
                        <span className="ml-3">Strategies</span>
                    </Button>
                </Link>
                    <Link href="/profile" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/profile' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/profile')}
                    >
                        <User className="w-5 h-5" />
                        <span className="ml-3">Profile</span>
                    </Button>
                </Link>
                </div>

                <div className="pt-2">
                    <h3 className="px-4 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tools</h3>
                    <Link href="/analytics" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/analytics' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/analytics')}
                    >
                        <BarChartBig className="w-5 h-5" />
                        <span className="ml-3">Analytics</span>
                    </Button>
                </Link>
                    <Link href="/calculator" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/calculator' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/calculator')}
                    >
                        <Calculator className="w-5 h-5" />
                        <span className="ml-3">Calculator</span>
                    </Button>
                </Link>
                    <Link href="/stablecoin-stash" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/stablecoin-stash' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/stablecoin-stash')}
                    >
                        <Shield className="w-5 h-5" />
                        <span className="ml-3">Stablecoin Stash</span>
                    </Button>
                </Link>
                    <Link href="/tutorials" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/tutorials' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/tutorials')}
                    >
                        <Book className="w-5 h-5" />
                        <span className="ml-3">Tutorials</span>
                    </Button>
                </Link>
                </div>

                <div className="pt-2">
                    <h3 className="px-4 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">System</h3>
                    <Link href="/settings" passHref legacyBehavior>
                    <Button
                        variant={pathname === '/settings' ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigation('/settings')}
                    >
                        <Settings className="w-5 h-5" />
                        <span className="ml-3">Settings</span>
                    </Button>
                </Link>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={logout}
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </Button>
                </div>
            </nav>
        </aside>
    </>
  );
};
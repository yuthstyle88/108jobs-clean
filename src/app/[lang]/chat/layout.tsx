"use client";

import React, {useState} from "react";
import Header from "@/components/Header";
import {ChatLanguageProvider} from "@/contexts/ChatLanguage";
import {LayoutProps} from "@/types/layout";
import {ChatRoomsProvider} from "@/modules/chat/contexts/ChatRoomsContext";
import {WebSocketProvider} from "@/modules/chat/contexts/WebSocketContext";
import {UserService} from "@/services/UserService";
import {useParams} from "next/navigation";
import ChatWrapper from "@/containers/ChatWrapper";
import {EnsureSharedKeyBootstrap} from "@/modules/chat/components/EnsureSharedKeyBootstrap";
import NavBar from "@/components/Home/NavBar";
import MobileSidebar from "@/components/MobileSidebar";
import {JobFlowSidebarProvider} from "@/modules/chat/contexts/JobFlowSidebarContext";
import JobFlowSidebar from "@/modules/chat/components/JobFlowSidebar";

function decodeJwtSub(token?: string | null): number {
    try {
        if (!token) return 0;
        const parts = token.split(".");
        if (parts.length < 2) return 0;
        const payload = JSON.parse(typeof atob === 'function' ? atob(parts[1]) : Buffer.from(parts[1], 'base64').toString('utf-8'));
        return Number(payload?.sub) || 0;
    } catch {
        return 0;
    }
}

function resolveSenderId(token: string | null | undefined): number {
    // 1) Primary: myUserInfo.localUserView.localUser.id
    const id1 = Number((UserService as any)?.Instance?.myUserInfo?.localUserView?.localUser?.id) || 0;
    if (id1) return id1;
    // 2) Secondary: authInfo.localUser.id
    const id2 = Number((UserService as any)?.Instance?.authInfo?.localUser?.id) || 0;
    if (id2) return id2;
    // 3) Tertiary: decode from JWT `sub`
    const id3 = decodeJwtSub(token);
    if (id3) return id3;
    // 4) Last resort: try cached localStorage if app store it
    try {
        const cache = localStorage.getItem('local_user_id');
        const id4 = Number(cache) || 0;
        if (id4) return id4;
    } catch {
    }
    return 0;
}


export default function ProfileLayout({children}: LayoutProps) {
    const params = useParams();
    const activeRoomId = params?.roomId as string;
    const token = UserService.Instance.auth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [senderId, setSenderId] = React.useState<number>(() => resolveSenderId(token));
    React.useEffect(() => {
        const now = resolveSenderId(token);
        if (now && now !== senderId) setSenderId(now);
        if (!now && token) {
            // Retry lazily once; some apps hydrate myUserInfo after mount
            const t = setTimeout(() => {
                const again = resolveSenderId(token);
                if (again && again !== senderId) setSenderId(again);
            }, 300);
            return () => clearTimeout(t);
        }
    }, [token]);

    return (
        <ChatLanguageProvider>
            <EnsureSharedKeyBootstrap/> {/* ✅ run once to generate shared key */}
            {/* Headers remain outside providers so they always render */}
            <div className="hidden sm:block fixed top-0 left-0 right-0 z-50">
                <Header type="primary"/>
            </div>
            {/* Show SpHeader only on /chat (no roomId) */}
            {!activeRoomId && (
                <div className="block sm:hidden">
                    {/* Mobile Header */}
                    <div className="block sm:hidden fixed top-0 inset-x-0 z-[1000] bg-primary">
                        <NavBar
                            isSidebarOpen={isSidebarOpen}
                            onToggleSidebar={() => setIsSidebarOpen(v => !v)}
                            className="text-white"
                        />
                    </div>
                    <MobileSidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />
                </div>
            )}

            {/* Main Content: Adjust top based on whether navbar is visible */}
            <div className={`
                fixed 
                ${!activeRoomId ? 'top-16' : 'top-0'} /* Conditional top - 0 when no navbar, 14 when navbar exists */
                sm:top-20 
                left-0 right-0 
                ${!activeRoomId ? 'h-[calc(100vh-56px)]' : 'h-screen'} /* Conditional height */
                sm:h-[calc(100vh-80px)] 
                overflow-hidden
            `}>
                <div className="flex h-full">
                    {senderId ? (
                        <WebSocketProvider
                            options={{token, senderId, roomId: activeRoomId}}
                        >
                            <ChatRoomsProvider>
                                <div className="flex h-full w-full">
                                    {/* LEFT: Chat list */}
                                    <aside
                                        className={`
                                            ${!activeRoomId ? 'flex' : 'hidden md:flex'}
                                            flex-col w-full md:w-64 lg:w-80 xl:w-96
                                            border-r border-gray-200 bg-white h-full overflow-y-auto
                                        `}
                                    >
                                        <ChatWrapper
                                            isSidebarOpen={isSidebarOpen}
                                            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                                            setIsSidebarOpen={setIsSidebarOpen}
                                        />
                                    </aside>

                                    {/* CENTER + RIGHT: Wrapped in provider */}
                                    <JobFlowSidebarProvider>
                                        <div className="flex flex-1 h-full">

                                            {/* CENTER: Conversation */}
                                            <main className="flex-1 min-w-0 h-full overflow-hidden bg-gray-50">
                                                {children}
                                            </main>

                                            {/* RIGHT: Sidebar */}
                                            {activeRoomId && <JobFlowSidebar />}
                                        </div>
                                    </JobFlowSidebarProvider>
                                </div>
                            </ChatRoomsProvider>
                        </WebSocketProvider>
                    ) : (
                        <div className="flex-1 min-w-0 h-full">{/* waiting senderId */}</div>
                    )}
                </div>
            </div>
        </ChatLanguageProvider>
    );
}
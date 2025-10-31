"use client";

import React, {useState, useEffect} from "react";
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
import {useUserStore} from "@/store/useUserStore";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";

export default function ProfileLayout({children}: LayoutProps) {
    const params = useParams();
    const {user} = useUserStore();
    const activeRoomId = params?.roomId as string;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // lazy token
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const t =
            UserService.Instance.auth() ||
            (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);
        setToken(t);
    }, []);

    // derive senderId from user
    const senderId = user?.id ?? 0;

    if (!user || !token || senderId === 0) {
        return (
            <LoadingBlur text={""}/>
        );
    }

    return (
        <ChatLanguageProvider>
            <EnsureSharedKeyBootstrap/>
            <div className="hidden sm:block fixed top-0 left-0 right-0 z-50">
                <Header type="primary"/>
            </div>

            {!activeRoomId && (
                <div className="block sm:hidden">
                    <div className="block sm:hidden fixed top-0 inset-x-0 z-[1000] bg-primary">
                        <NavBar
                            isSidebarOpen={isSidebarOpen}
                            onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
                            className="text-white"
                        />
                    </div>
                    <MobileSidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />
                </div>
            )}

            <div
                className={`
                    fixed 
                    ${!activeRoomId ? "top-16" : "top-0"}
                    sm:top-20 
                    left-0 right-0 
                    ${!activeRoomId ? "h-[calc(100vh-56px)]" : "h-screen"}
                    sm:h-[calc(100vh-80px)] 
                    overflow-hidden
               `}
            >
                <div className="flex h-full">
                    <WebSocketProvider options={{token, senderId, roomId: activeRoomId}}>
                        <ChatRoomsProvider>
                            <div className="flex h-full w-full">
                                <aside
                                    className={`
                                        ${!activeRoomId ? "flex" : "hidden md:flex"}
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

                                <JobFlowSidebarProvider>
                                    <div className="flex flex-1 h-full">
                                        <main className="flex-1 min-w-0 h-full overflow-hidden bg-gray-50">
                                            {children}
                                        </main>
                                        {activeRoomId && <JobFlowSidebar/>}
                                    </div>
                                </JobFlowSidebarProvider>
                            </div>
                        </ChatRoomsProvider>
                    </WebSocketProvider>
                </div>
            </div>
        </ChatLanguageProvider>
    );
}

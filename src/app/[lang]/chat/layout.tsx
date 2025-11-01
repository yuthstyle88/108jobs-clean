"use client";

import React, {useState} from "react";
import Header from "@/components/Header";
import {ChatLanguageProvider} from "@/contexts/ChatLanguage";
import {LayoutProps} from "@/types/layout";
import {WebSocketProvider} from "@/modules/chat/contexts/WebSocketContext";
import {useParams} from "next/navigation";
import {EnsureSharedKeyBootstrap} from "@/modules/chat/components/EnsureSharedKeyBootstrap";
import NavBar from "@/components/Home/NavBar";
import MobileSidebar from "@/components/MobileSidebar";
import {JobFlowSidebarProvider} from "@/modules/chat/contexts/JobFlowSidebarContext";
import JobFlowSidebar from "@/modules/chat/components/JobFlowSidebar";
import {useUserStore} from "@/store/useUserStore";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";
import {ChatRoomsProvider} from "@/modules/chat/providers/ChatRoomsProvider";
import {UserService} from "@/services";
import {useActiveRoom} from "@/modules/chat/store/roomsStore";
import {useRooms} from "@/modules/chat/store/roomsStore";
import ChatWrapper from "@/containers/ChatWrapper";

export default function ProfileLayout({children}: LayoutProps) {
  const storeActiveRoomId = useActiveRoom();
  const params = useParams() as { roomId?: string };
  const {user, } = useUserStore();
  const activeRoomId = params?.roomId ?? null;
  // Prefer param if present; otherwise fall back to store's activeRoomId
  // normalizedRoomId feeds WebSocketProvider; prefer URL param, else store, else empty
  const normalizedRoomId = (activeRoomId ?? storeActiveRoomId ?? "") as string;
  // default to showing the room list first (especially on mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // derive senderId from user
  const senderId = user?.id ?? 0;
  const token = UserService.Instance.auth();

  const wsOptions = React.useMemo(() => ({ token, senderId, roomId: normalizedRoomId }), [token, senderId, normalizedRoomId]);

  // Keep store in sync with URL param (no-op if action is missing)
  if(!user || !token || senderId === 0) {
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
          <WebSocketProvider options={wsOptions}>
            <ChatRoomsProvider>
              <div className="flex h-full w-full">
                <aside
                  className={`
                                            ${(!activeRoomId || isSidebarOpen) ? "flex" : "hidden md:flex"}
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
                    <main className={`${isSidebarOpen ? "hidden md:flex" : "flex"} flex-1 min-w-0 h-full overflow-hidden bg-gray-50`}>
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

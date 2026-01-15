'use client';

import React, {createContext, useContext, useEffect, useMemo} from 'react';
import {useWebSocket} from '@/modules/chat/hooks/useWebSocket';
import {useUserStore} from '@/store/useUserStore';
import {UserService} from '@/services';
import {useRoomsStore} from '@/modules/chat/store/roomsStore';
import {REQUEST_STATE} from '@/services/HttpService';
import {hydrateUnread} from '@/modules/chat/store/unreadStore';
import {useHttpGet} from "@/hooks/api/http/useHttpGet";

interface UserEventsContextValue {
    status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
    isReady: boolean;
    // We can add specific event listeners or methods here if needed
}

const UserEventsContext = createContext<UserEventsContextValue | undefined>(undefined);

export const UserEventsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { user } = useUserStore();
    const token = UserService.Instance.auth();
    const userId = user?.id;

    const wsOptions = useMemo(() => {
        if (!userId || !token) return null;
        return {
            token,
            senderId: Number(userId),
            roomId: String(userId), // roomId isn't used by our custom topicBuilder but required by type
            topicBuilder: (uid: string) => `user:${uid}:events`,
            autoConnect: true,
            debug: process.env.NODE_ENV === 'development',
        };
    }, [userId, token]);

    // Only call useWebSocket if we have the necessary data
    // useWebSocket handles internal effects, but we pass null if not ready
    const ws = useWebSocket(wsOptions || {
        autoConnect: false,
        roomId: '',
        senderId: 0
    });

    const value = useMemo(() => ({
        status: ws.status,
        isReady: ws.isReady,
    }), [ws.status, ws.isReady]);

    const { data: snapshotRes, state: snapshotState } = useHttpGet("getUnreadSnapshot");

    // Fetch unread snapshot once on mount if user is logged in
    useEffect(() => {
        if (snapshotState.state === REQUEST_STATE.SUCCESS && Array.isArray(snapshotRes)) {
            const snapshot: Record<string, number> = {};
            snapshotRes.forEach(item => {
                if (item.roomId) {
                    snapshot[String(item.roomId)] = item.unreadCount;
                }
            });
            hydrateUnread(snapshot);
        }
    }, [snapshotRes, snapshotState.state]);

    // Example: global listener for notifications
    useEffect(() => {
        if (ws.isReady) {
            return ws.addMessageListener((data: any) => {
                // You can dispatch global events or show toasts here
                if (process.env.NODE_ENV === 'development') {
                    console.log('[UserEvents] Received message:', data);
                }

                // Handle chats:signal to update unread counts
                if (data?.event === 'chats:signal' && data?.payload?.kind === 'chat') {
                    const { roomId, unreadCount } = data.payload;
                    if (roomId) {
                        if (typeof unreadCount === 'number') {
                            useRoomsStore.getState().setUnread(String(roomId), unreadCount);
                        }
                        // Bump room to top on every such signal (usually indicates a new message)
                        useRoomsStore.getState().bumpRoomToTop(String(roomId));
                    }
                }
            });
        }
    }, [ws.isReady, ws.addMessageListener]);

    return (
        <UserEventsContext.Provider value={value}>
            {children}
        </UserEventsContext.Provider>
    );
};

export function useUserEvents() {
    const context = useContext(UserEventsContext);
    if (context === undefined) {
        throw new Error('useUserEvents must be used within a UserEventsProvider');
    }
    return context;
}

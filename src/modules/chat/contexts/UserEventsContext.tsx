'use client';

import React, {createContext, useEffect, useMemo} from 'react';
import {useWebSocket} from '@/modules/chat/hooks/useWebSocket';
import {useUserStore} from '@/store/useUserStore';
import {UserService} from '@/services';
import {useRoomsStore} from '@/modules/chat/store/roomsStore';
import {REQUEST_STATE} from '@/services/HttpService';
import {hydrateUnread} from '@/modules/chat/store/unreadStore';
import {useHttpGet} from "@/hooks/api/http/useHttpGet";
import {maybeHandlePresenceUpdate} from "@/modules/chat/utils";
import {usePresenceStore} from "@/modules/chat/store/presenceStore";
import {PresenceSnapshotItem, PresenceStatus} from "lemmy-js-client";

interface UserEventsContextValue {
    status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
    isReady: boolean;
    // We can add specific event listeners or methods here if needed
}

const UserEventsContext = createContext<UserEventsContextValue | undefined>(undefined);

export const UserEventsProvider: React.FC<React.PropsWithChildren> = ({children}) => {
    const {user} = useUserStore();
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

    const {data: snapshotRes, state: snapshotState} = useHttpGet("getUnreadSnapshot");
    const {data: presenceRes, state: presenceState} = useHttpGet("getPresenceSnapshot");

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

    // Hydrate presence store from snapshot
    useEffect(() => {
        if (presenceState.state === REQUEST_STATE.SUCCESS && Array.isArray(presenceRes)) {
            const list = presenceRes.map((p: PresenceSnapshotItem) => ({
                userId: Number(p.userId),
                lastSeenAt: p.status === PresenceStatus.Online
                    ? (p.at ? new Date(p.at).getTime() : Date.now())
                    : (p.lastSeen ? new Date(p.lastSeen).getTime() : 0)
            }));
            usePresenceStore.getState().setSnapshot(list);
        }
    }, [presenceRes, presenceState.state]);

    useEffect(() => {
        if (ws.isReady) {
            return ws.addMessageListener((data: any) => {
                console.log('[UserEvents] Received message:', data);

                // Handle chats:signal
                if (data?.event === 'chats:signal') {
                    const payload = data?.payload;
                    const meId = Number(userId);

                    if (payload?.kind === 'chat') {
                        const {roomId, unreadCount, lastMessageAt, senderId} = payload;
                        if (roomId) {
                            if (typeof unreadCount === 'number') {
                                useRoomsStore.getState().setUnread(String(roomId), unreadCount);
                            }
                            
                            // If we have lastMessageAt, update metadata. 
                            // Only bump if the room is NOT active. 
                            // (Because if it is active, it's already visible and we don't want it jumping around while reading)
                            const store = useRoomsStore.getState();
                            const isActive = String(store.activeRoomId) === String(roomId);
                            
                            if (lastMessageAt) {
                                store.updateLastMessage(
                                    String(roomId), 
                                    Number(senderId ?? 0), 
                                    lastMessageAt,
                                    !isActive // shouldBump: true if NOT active
                                );
                            } else {
                                // Fallback if no lastMessageAt, just bump if not active
                                if (!isActive) {
                                    store.bumpRoomToTop(String(roomId));
                                }
                            }
                        }
                    }

                    // Handle presence signals via helper
                    maybeHandlePresenceUpdate(data, meId);
                }
            });
        }
    }, [ws.isReady, ws.addMessageListener, userId]);

    return (
        <UserEventsContext.Provider value={value}>
            {children}
        </UserEventsContext.Provider>
    );
};

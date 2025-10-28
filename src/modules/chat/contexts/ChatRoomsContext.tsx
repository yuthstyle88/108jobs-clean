"use client";

import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {ChatRoom as AppChatRoom} from "@/modules/chat/types/chat";
import {HttpService, UserService} from "@/services";
import {useHttpGet} from "@/hooks/useHttpGet";
import type {ListUserChatRoomsResponse} from "lemmy-js-client";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {REQUEST_STATE} from "@/services/HttpService";
import {isBrowser} from "@/utils/browser";
import {useUnreadStore} from "@/modules/chat/store/unreadStore";
import { onChatNewMessage, onWsReconnected } from "@/modules/chat/events";
import {useActiveRoomId, useRoomsStore} from "@/modules/chat/store/roomsStore";
import {disableBackgroundUnread, enableBackgroundUnread} from "@/modules/chat/services/backgroundUnreadWatcher";

// Context state for listing chat rooms with pagination and E2EE-aware lastMessage preview

type RoomsState = {
    rooms: AppChatRoom[];
    isLoading: boolean;
    error: unknown;
    page: number;
    pageSize: number;
    hasMore: boolean;
};

interface ChatRoomsContextValue extends RoomsState {
    refresh: () => void;
    loadMore: () => void;
    markRoomRead: (roomId: string) => Promise<void>;
    bumpRoomToTop: (roomId: string, updatedAt?: string) => void;
    activeRoomId: string | null;
    setActiveRoomId: (roomId: string | null) => void;
}

const ChatRoomsContext = createContext<ChatRoomsContextValue | undefined>(undefined);

export const ChatRoomsProvider: React.FC<{ children: React.ReactNode; pageSize?: number }>
    = ({children, pageSize = 20}) => {
    const { localUser } = useMyUser();

    if (!localUser?.id) {
        const emptyValue: ChatRoomsContextValue = {
            rooms: [],
            isLoading: false,
            error: null,
            page: 1,
            pageSize,
            hasMore: false,
            refresh: () => {},
            loadMore: () => {},
            markRoomRead: async () => {},
            bumpRoomToTop: () => {},
            activeRoomId: null,
            setActiveRoomId: () => {},
        };
        return (
            <ChatRoomsContext.Provider value={emptyValue}>
                {children}
            </ChatRoomsContext.Provider>
        );
    }

    return <InnerChatRoomsProvider pageSize={pageSize}>{children}</InnerChatRoomsProvider>;
};

const InnerChatRoomsProvider: React.FC<{ children: React.ReactNode; pageSize: number }> = ({ children, pageSize }) => {
    const [page, setPage] = useState(1);
    const { localUser } = useMyUser();

    // Persist client-known last-activity timestamps to keep room order stable across reloads
    const LOCAL_ACTIVITY_KEY = 'chat_last_activity_overrides';
    const activityOverridesRef = useRef<Record<string, string>>({});

    const saveOverrides = useCallback(() => {
        try {
            if (isBrowser()) {
                localStorage.setItem(LOCAL_ACTIVITY_KEY, JSON.stringify(activityOverridesRef.current));
            }
        } catch {
        }
    }, []);
    // Load persisted overrides once
    useEffect(() => {
        try {
            if (isBrowser()) {
                const raw = localStorage.getItem(LOCAL_ACTIVITY_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed && typeof parsed === 'object') activityOverridesRef.current = parsed;
                }
            }
        } catch {
        }
        // After loading, re-sort current rooms using effective timestamps
        setState(prev => {
            const sorted = [...prev.rooms].sort((a: any, b: any) => {
                const ao = activityOverridesRef.current[a.id];
                const bo = activityOverridesRef.current[b.id];
                const aet = ao ? new Date(ao).getTime() : 0;
                const bet = bo ? new Date(bo).getTime() : 0;
                return bet - aet;
            });
            return {...prev, rooms: sorted} as any;
        });
    }, []);

    const {
        state: reqState,
        data,
        isMutating: isLoading,
        execute
    } = useHttpGet("listChatRooms", {limit: page * pageSize});
    const error =
      reqState.state === REQUEST_STATE.FAILED ? (reqState as any).err : null;


    const mapToRooms = useCallback(async (input?: ListUserChatRoomsResponse): Promise<RoomsState> => {
        const items = input?.rooms || [];
        const totalLoaded = items.length;
        // Prefer cursor-based hasMore if provided by API, otherwise fall back to count-based heuristic
        const hasMore = typeof (input as any)?.nextPage !== 'undefined' ? !!(input as any).nextPage : totalLoaded >= page * pageSize;

        // Fetch all participant profiles concurrently
        const mapped: AppChatRoom[] = await Promise.all((items as any[]).map(async (it) => {
            // Normalize item shape to ChatRoomView whether input is ChatRoomResponse or ChatRoomView
            const roomView = (it as any)?.room?.room ? (it as any).room : (it as any);
            const rawId = roomView?.room?.id ?? roomView?.id ?? (it as any)?.roomId ?? (it as any)?.id;
            if (!rawId) return null;

            const participantsArr = (roomView?.participants ?? (it as any)?.participants ?? []) as any[];
            const other = participantsArr.find((p: any) => String(p.memberId) !== String(localUser?.id));

            let profileName = "Unknown";
            let partnerAvatar: string = ""; // normalize to string (empty when unknown)
            if (other?.memberId != null) {
                try {
                    const res = await HttpService.client.visitProfile(String(other.memberId));
                    if (res.state === REQUEST_STATE.SUCCESS) {
                        profileName = (res as any)?.data?.profile?.name ?? "Unknown";
                        partnerAvatar = (res as any)?.data?.profile?.avatar ?? "";
                    }
                } catch {}
            }

            let roomName = roomView?.room?.roomName;
            if (rawId === roomName) roomName = profileName;
            else roomName = `${profileName}:Job ${roomName ?? ""}`.trim();

            return {
                id: String(rawId),
                name: roomName,
                partnerAvatar,
                participants: participantsArr.map((p: any) => String(p.memberId)) as any,
                unreadCount: 0,
                postId: roomView?.room?.postId ?? roomView?.post?.id ?? (it as any)?.postId,
            } as any;
        }));

        return {
            rooms: mapped.filter(Boolean) as AppChatRoom[],
            isLoading,
            error,
            page,
            pageSize,
            hasMore,
        };
    }, [error, isLoading, page, pageSize, localUser?.id]);

    const [state, setState] = useState<RoomsState>({
        rooms: [],
        isLoading: true,
        error: null,
        page,
        pageSize,
        hasMore: true
    } as any);

    // Use roomsStore as single source of truth for active room
    const storeActiveRoomId = useActiveRoomId();
    const setRoomsActive    = useRoomsStore(s => s.setActiveRoomId);
    // removed activeToken state
    const markSeen = useUnreadStore(s => s.markSeen);

    const activeRoomId = storeActiveRoomId;
    const setActiveRoomId = useCallback((roomId: string | null) => {
        const current = storeActiveRoomId == null ? null : String(storeActiveRoomId);
        const next = roomId == null ? null : String(roomId);
        if (current === next) return;

        // Delegate active switching to roomsStore (SSOT)
        setRoomsActive(next);

        // Clear unread for the newly active room (if any)
        if (next) {
            try { markSeen(next); } catch {}
        }
    }, [storeActiveRoomId, setRoomsActive, markSeen]);

    useEffect(() => {
        let alive = true;
        (async () => {
            const result = await mapToRooms(data || undefined);
            if (!alive) return;
            // Merge new result into existing state without re-sorting to preserve stable order across pagination
            setState(prev => {
                // Build a map of existing rooms to preserve their order
                const existingOrder = prev.rooms.map(r => r.id);
                const nextById = new Map<string, any>();
                // Start with previous rooms in their current order
                prev.rooms.forEach(r => nextById.set(r.id, r));
                // Upsert incoming rooms (update fields if exist, append later if brand new)
                (result.rooms as any[]).forEach(r => {
                    const old = nextById.get(r.id);
                    nextById.set(r.id, old ? {...old, ...r} : r);
                });
                // Reconstruct list: keep prior order first, then append any brand-new ids at the end
                const kept = existingOrder.map(id => nextById.get(id)).filter(Boolean);
                const appended = Array.from(nextById.keys())
                    .filter(id => !existingOrder.includes(id))
                    .map(id => nextById.get(id));
                const mergedRooms = [...kept, ...appended] as any[];

                // If nothing changed besides loading/error flags, avoid re-render
                const sameLength = prev.rooms.length === mergedRooms.length;
                const isSame = sameLength && prev.rooms.every((r, i) => {
                    const n = mergedRooms[i];
                    return r.id === n.id &&
                        r.name === n.name &&
                        r.unreadCount === n.unreadCount &&
                        r.partnerAvatar === n.partnerAvatar &&
                        r.postId === n.postId;
                });
                if (isSame) {
                    return {...prev, isLoading: isLoading, error} as any;
                }
                const sortedRooms = [...mergedRooms].sort((a: any, b: any) => {
                    const ao = activityOverridesRef.current[a.id];
                    const bo = activityOverridesRef.current[b.id];
                    const aet = ao ? new Date(ao).getTime() : 0;
                    const bet = bo ? new Date(bo).getTime() : 0;
                    return bet - aet;
                });
                return {
                    ...prev,
                    isLoading: isLoading,
                    error,
                    page: result.page,
                    pageSize: result.pageSize,
                    hasMore: result.hasMore,
                    rooms: sortedRooms as any,
                } as any;
            });
        })();
        return () => {
            alive = false;
        };
    }, [data, mapToRooms, page]);

    // Enable background unread counting for non-active rooms ONLY.
    // This provider DOES NOT perform any unread increments itself.
    // Incrementing happens via:
    //   - BackgroundUnreadWatcher (joins non-active rooms) → incrementForIncoming(roomId)
    //   - (Optional) Realtime layer for rooms not currently active (if present)
    // Here we only synchronize per-room unread numbers from the store to the UI list.
    useEffect(() => {
        const tokenGetter = () => {
            try {
                return UserService.Instance.auth() || null;
            } catch {
                return null;
            }
        };
        const userIdGetter = () => (localUser?.id ?? null);
        enableBackgroundUnread(tokenGetter, userIdGetter);
        return () => {
            disableBackgroundUnread();
        };
    }, [localUser?.id]);

    const refresh = useCallback(async () => {
        try {
            await execute();
        } catch {
            // intentionally ignore errors here; state will reflect via reqState
        }
    }, [execute]);

    // Refetch when WS reconnects (event dispatched from RealtimeChatContext)
    useEffect(() => {
        const unsubscribe = onWsReconnected(() => {
            execute().catch(() => {});
        });
        return () => {
            try { unsubscribe?.(); } catch {}
        };
    }, [execute]);

    const loadMore = useCallback(() => {
        if (state.hasMore && !isLoading) setPage(p => p + 1);
    }, [state.hasMore, isLoading]);

    const markRoomRead = useCallback(async (roomId: string) => {
        // อัปเดตที่ global unread store เท่านั้น
        try {
            useUnreadStore.getState().markSeen(roomId);
        } catch {
            // no-op
        }
        // TODO: ถ้ามี API ฝั่งเซิร์ฟเวอร์ค่อยเรียกที่นี่ (ไม่ต้อง await การนำทาง)
        // await axiosPrivate.post(`/messages/rooms/${roomId}/read`);
    }, []);

    // Expose a helper to move a room to the top when a new message arrives
    const bumpRoomToTop = useCallback((roomId: string, updatedAt?: string) => {
        setState((prev) => {
            // Check if the room exists in the current list
            const idx = prev.rooms.findIndex((r) => r.id === roomId);
            if (idx === -1) {
                // Log for debugging; consider fetching the room if it's new
                console.warn(`Room ${roomId} not found in current rooms list`);
                return prev;
            }

            const newUpdatedAt = updatedAt || new Date().toISOString();
            // Persist timestamp override
            activityOverridesRef.current[roomId] = newUpdatedAt;
            try {
                saveOverrides();
            } catch (e) {
                console.error('Failed to save activity overrides:', e);
            }

            // Reorder rooms: move the specified room to the top
            const room = prev.rooms[idx];
            const remaining = prev.rooms.filter((_, i) => i !== idx);
            const nextRooms = [{...room, updatedAt: newUpdatedAt}, ...remaining];

            return {...prev, rooms: nextRooms};
        });
    }, [saveOverrides]);


    // Listen for global chat:new-message events for UI ordering ONLY (no unread increments here)
    useEffect(() => {
        const unsubscribe = onChatNewMessage((detail) => {
            console.log('New message event received:', detail); // Debug log
            if (!detail || !detail.roomId) {
                console.warn('Invalid chat:new-message event:', detail);
                return;
            }
            // Only reorder list here; unread counting handled by realtime + background watcher
            bumpRoomToTop(detail.roomId, detail.createdAt);
        });
        return () => {
            try { unsubscribe?.(); } catch (e) {
                console.error('Failed to unsubscribe from chat:new-message:', e);
            }
        };
    }, [bumpRoomToTop]);

    // === Unread Sync Layer (Display Only) ===
    // This effect mirrors the global unread store into the left room list.
    // DO NOT increment unread here. All counting must happen in the store via incrementForIncoming.
    // Rationale:
    //   - Single source of truth: useUnreadStore handles active-room policy & dedupe
    //   - Avoids double counting from multiple listeners/providers
    useEffect(() => {
        const applyPerRoom = (perRoom: Record<string, number>) => {
            setState(prev => {
                if (!prev.rooms || prev.rooms.length === 0) return prev as any;
                const nextRooms = prev.rooms.map((r: any) => {
                    const cnt = perRoom?.[r.id] || 0;
                    return cnt === r.unreadCount ? r : { ...r, unreadCount: cnt };
                });
                return { ...prev, rooms: nextRooms } as any;
            });
        };
        // initial apply
        applyPerRoom(useUnreadStore.getState().perRoom);
        // subscribe for future changes
        const unsub = useUnreadStore.subscribe((s, prev) => {
            if (s.perRoom !== prev?.perRoom) applyPerRoom(s.perRoom);
        });
        return () => {
            try { unsub?.(); } catch {}
        };
    }, []);

    // Sync current rooms into the global rooms store so background watchers can observe them
    useEffect(() => {
        try {
            const setRooms = (useRoomsStore as any).getState?.().setRooms;
            if (typeof setRooms === 'function') {
                const slim = state.rooms.map((r: any) => {
                    const otherId = Array.isArray(r.participants)
                        ? r.participants.find((pid: any) => String(pid) !== String(localUser?.id))
                        : r.participant?.id ?? r.peerId ?? undefined;

                    const participant = {
                        id: otherId != null ? Number(otherId) : 0,
                        name: r.participant?.name ?? r.participantName ?? r.profileName ?? r.peerName ?? r.name ?? 'Unknown',
                    };

                    return { id: String(r.id), name: r.name ?? undefined, participant };
                });
                setRooms(slim);
            } else {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn('[rooms-store] setRooms not found; skip syncing rooms');
                }
            }
        } catch (e) {
            console.warn('[rooms-store] failed to sync rooms:', e);
        }
        // Re-run when the set of room ids changes
    }, [state.rooms]);

    // removed effect that released activeToken on unmount

    const value = useMemo<ChatRoomsContextValue>(() => ({
        ...state,
        refresh,
        loadMore,
        markRoomRead,
        bumpRoomToTop,
        activeRoomId,
        setActiveRoomId,
    }), [state, refresh, loadMore, markRoomRead, bumpRoomToTop, activeRoomId, setActiveRoomId]);

    return (
        <ChatRoomsContext.Provider value={value}>
            {children}
        </ChatRoomsContext.Provider>
    );
};

export const useChatRoomsContext = (): ChatRoomsContextValue => {
    const ctx = useContext(ChatRoomsContext);
    if (!ctx) throw new Error('useChatRooms must be used within ChatRoomsProvider');
    return ctx;
};

// Optional hook variant for components that may render outside provider (returns undefined instead of throwing)
export const useOptionalChatRooms = (): ChatRoomsContextValue | undefined => {
    try {
        return useContext(ChatRoomsContext);
    } catch {
        return undefined;
    }
};

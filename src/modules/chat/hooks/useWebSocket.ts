import {useCallback, useEffect, useRef, useState} from 'react';
// IMPORTANT: Adjust the import path if your service lives elsewhere
import {getChannelAdapter} from '@/modules/chat/services/PhoenixSocketService';
import {WebSocketStatus} from "@/modules/chat/types";
import {onReadReceipt} from '@/modules/chat/events/chatEvents';
import {useReadLastIdStore} from '@/modules/chat/store/readStore';

export interface UseWebSocketOptions {
    // การยืนยันตัวตน/สโคป
    token?: string | null;
    roomId: string;
    senderId: number;
    // การเชื่อมต่อ
    autoConnect?: boolean;               // default: true
    // NOTE: autoJoin only runs when the underlying adapter sets `requiresManualJoin === true`
    autoJoin?: boolean;                  // default: true
    // ปิด/เปิดการ join room จาก hook นี้ (ค่าเริ่มต้น: ปิด)
    allowJoin?: boolean;
    // Reconnection settings
    autoReconnect?: boolean;             // default: true - automatically reconnect on disconnect
    maxReconnectAttempts?: number;       // default: 5 - max number of reconnection attempts
    reconnectInterval?: number;          // default: 1000ms - base interval for reconnection
    reconnectOnVisible?: boolean;           // default: true - reconnect when tab becomes visible or window gains focus
    // Inactivity timeout settings
    inactivityTimeout?: number;          // default: 300000ms (5 minutes) - disconnect after no typing activity
    disableInactivityTimeout?: boolean;  // default: false - set to true to disable inactivity timeout

    topicBuilder?: (roomId: string) => string;

    // callbacks ระดับ socket (ดิบ)
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: unknown) => void;
    onMessage?: (data: unknown) => void;
    onNewMessage?: (data: any) => void;
    onTyping?: (data: any) => void;
    onReconnecting?: (attempt: number) => void;
    onReconnected?: () => void;
    onReconnectFailed?: () => void;
    onInactivityTimeout?: () => void;    // callback when inactivity timeout triggers
    // แผนที่ event → handler (ยืดหยุ่นกว่า onNewMessage/onTyping แบบ fix ชื่อ)
    eventHandlers?: Record<string, (payload: any) => void>; // e.g. {'chat:message': fn, 'chat:typing': fn}

    debug?: boolean;
}

export interface WebSocketAPI {
    status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
    isReady: boolean;
    topic?: string;

    // ควบคุมการเชื่อมต่อ/เข้าช่อง
    connect: () => void;
    disconnect: () => void;
    join: (params?: { roomId: string; senderId: number }) => Promise<void> | void;
    leave: () => Promise<void> | void;

    // สั่งงานดิบ
    emit: (event: string, payload: any) => Promise<void> | void;

    addMessageListener: (cb: (data: unknown) => void) => () => void;

    // Reset inactivity timer (call on typing or other user activity)
    resetInactivityTimer: () => void;
}

/**
 * React Hook that bridges to your PhoenixSocketService adapter.
 * It assumes the adapter behaves like a WebSocket/Channel bridge with
 * optional methods: connect(), disconnect()/close(), join(), leave(), emit().
 */
export function useWebSocket(options: Partial<UseWebSocketOptions> = {}): WebSocketAPI {
    const {
        token,
        roomId,
        senderId,
        autoConnect = true,
        autoJoin = true,
        autoReconnect = true,
        maxReconnectAttempts = 5,
        reconnectInterval = 1000,
        reconnectOnVisible = true,
        inactivityTimeout = 300000,        // 5 minutes default
        disableInactivityTimeout = false,
        topicBuilder = (roomId: string) => `room:${roomId}`,
        onOpen,
        onClose,
        onError,
        onMessage,
        onNewMessage,
        onTyping,
        onReconnecting,
        onReconnected,
        onReconnectFailed,
        onInactivityTimeout,
        eventHandlers,
        debug,
    } = options;

    const adapterRef = useRef<any | null>(null);
    const listenersRef = useRef<Set<(data: unknown) => void>>(new Set());
    const [status, setStatus] = useState<WebSocketStatus>('idle');
    const [topic, setTopic] = useState<string | undefined>(undefined);

    // Reconnection state
    const reconnectAttemptsRef = useRef<number>(0);
    const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isReconnectingRef = useRef<boolean>(false);
    const isManualDisconnectRef = useRef<boolean>(false);

    // Inactivity timeout state
    const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastActivityTimeRef = useRef<number>(Date.now());
    const disconnectRef = useRef<(() => void) | null>(null);

    const log = (...args: unknown[]) => {
        if (debug) console.log('[useWebSocket]', ...args);
    };

    // Clear reconnection timer
    const clearReconnectTimer = useCallback(() => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
    }, []);

    // Clear inactivity timer
    const clearInactivityTimer = useCallback(() => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
            inactivityTimerRef.current = null;
        }
    }, []);

    // Start inactivity timeout
    const startInactivityTimer = useCallback(() => {
        if (disableInactivityTimeout) return;
        if (status !== 'connected') return;

        clearInactivityTimer();
        lastActivityTimeRef.current = Date.now();

        inactivityTimerRef.current = setTimeout(() => {
            log('inactivity timeout reached - disconnecting');
            try {
                onInactivityTimeout?.();
            } catch {
            }
            // Use ref to avoid circular dependency
            if (disconnectRef.current) {
                disconnectRef.current();
            }
        }, inactivityTimeout);

        log(`inactivity timer started (${inactivityTimeout}ms)`);
    }, [disableInactivityTimeout, status, inactivityTimeout, onInactivityTimeout, clearInactivityTimer]);

    // Reset inactivity timer (call on any user activity)
    const resetInactivityTimer = useCallback(() => {
        if (disableInactivityTimeout) return;
        if (status !== 'connected') return;

        lastActivityTimeRef.current = Date.now();
        startInactivityTimer();
    }, [disableInactivityTimeout, status, startInactivityTimer]);

    // Schedule reconnection with exponential backoff
    const scheduleReconnect = useCallback(() => {
        if (!autoReconnect || isManualDisconnectRef.current) {
            log('reconnection skipped (autoReconnect disabled or manual disconnect)');
            return;
        }

        if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            log('max reconnect attempts reached');
            isReconnectingRef.current = false;
            try {
                onReconnectFailed?.();
            } catch {
            }
            return;
        }

        if (isReconnectingRef.current) {
            log('reconnection already in progress');
            return;
        }

        isReconnectingRef.current = true;
        reconnectAttemptsRef.current += 1;

        // Exponential backoff: 1s, 2s, 4s, 8s, 16s
        const delay = reconnectInterval * Math.pow(2, reconnectAttemptsRef.current - 1);

        log(`scheduling reconnection attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts} in ${delay}ms`);
        try {
            onReconnecting?.(reconnectAttemptsRef.current);
        } catch {
        }

        clearReconnectTimer();
        reconnectTimerRef.current = setTimeout(() => {
            log(`reconnection attempt ${reconnectAttemptsRef.current}`);
            isReconnectingRef.current = false;

            // Trigger reconnection by calling connect
            if (token && roomId) {
                const nextTopic = topicBuilder(roomId);
                setStatus('connecting');
                if (topic !== nextTopic) setTopic(nextTopic);

                const adapter = getChannelAdapter(token, nextTopic, roomId, Number(senderId) ?? 0);
                adapterRef.current = adapter;
                bindAdapterHandlers(adapter);
            }
        }, delay);
    }, [autoReconnect, maxReconnectAttempts, reconnectInterval, token, roomId, senderId, topicBuilder, topic, onReconnecting, onReconnectFailed, clearReconnectTimer]);

    const bindAdapterHandlers = useCallback((adapter: any) => {
        if (!adapter) return;

        // Avoid double-binding on the same adapter instance
        if ((adapter as any).__ws_bound) return;
        (adapter as any).__ws_bound = true;

        // store heartbeat timer per adapter instance
        let heartbeatTimer: NodeJS.Timeout | null = null;

        const startHeartbeat = () => {
            if (heartbeatTimer) clearInterval(heartbeatTimer);
            heartbeatTimer = setInterval(() => {
                if (adapter.readyState === 1 && typeof adapter.sendHeartbeat === "function") {
                    adapter.sendHeartbeat();
                }
            }, 20_000);
        };

        // Wire base-level handlers
        if ('onopen' in adapter) {
            adapter.onopen = () => {
                setStatus('connected');

                // Reset reconnection state on successful connection
                const wasReconnecting = reconnectAttemptsRef.current > 0;
                reconnectAttemptsRef.current = 0;
                isReconnectingRef.current = false;
                clearReconnectTimer();

                onOpen?.();
                log('onopen');

                // Start inactivity timer on successful connection
                startInactivityTimer();
                startHeartbeat();

                // Notify if this was a successful reconnection
                if (wasReconnecting) {
                    try {
                        onReconnected?.();
                    } catch {
                    }
                }
            };
        }
        if ('onclose' in adapter) {
            adapter.onclose = () => {
                setStatus('disconnected');
                onClose?.();
                log('onclose');

                // Trigger reconnection if not manually disconnected
                scheduleReconnect();
            };
        }
        if ('onerror' in adapter) {
            adapter.onerror = (e: unknown) => {
                setStatus('error');
                onError?.(e);
                log('onerror', e);

                // Trigger reconnection on error
                scheduleReconnect();
            };
        }
        if ('onmessage' in adapter) {
            adapter.onmessage = (evt: any) => {
                const data = evt?.data ?? evt; // handle both {data} or raw
                let parsed: any = data;
                try {
                    parsed = typeof data === 'string' ? JSON.parse(data) : data;
                } catch {
                }

                // Reset inactivity timer on any message activity
                resetInactivityTimer();

                // top-level raw handler
                try {
                    onMessage?.(parsed);
                } catch {
                }

                // fan-out to local subscribers
                try {
                    listenersRef.current.forEach(fn => {
                        try {
                            fn(parsed);
                        } catch {
                        }
                    });
                } catch {
                }

                // event routing
                try {
                    const evName = (parsed && (parsed.event || parsed.type)) as string | undefined;
                    const payload = (parsed && (parsed.payload ?? parsed.data)) as any;
                    if (evName) {
                        // specific convenience callbacks
                        if (evName === 'chat:message') {
                            try {
                                onNewMessage?.(payload);
                            } catch {
                            }
                        } else if (evName === 'chat:typing') {
                            try {
                                onTyping?.(payload);
                            } catch {
                            }
                        }
                        // flexible map-based handlers
                        if (eventHandlers && typeof eventHandlers[evName] === 'function') {
                            eventHandlers[evName](payload);
                        }
                    }
                } catch {
                }
            };
        }
    }, [onOpen, onClose, onError, onMessage, onNewMessage, onTyping, onReconnected, eventHandlers, debug, clearReconnectTimer, scheduleReconnect, startInactivityTimer, resetInactivityTimer]);

    const connect = useCallback(() => {
        if (!autoConnect) {
            setStatus('idle');
            return;
        }
        if (!token || !roomId) {
            setStatus('idle');
            return;
        }

        const nextTopic = topicBuilder(roomId);

        // Fast path: if current adapter is connected for the same topic, do nothing
        const current = adapterRef.current as any;
        if (current && status === 'connected' && topic === nextTopic) {
            log('connect skipped (already connected to same topic)');
            return;
        }

        // Clear manual disconnect flag when explicitly connecting
        isManualDisconnectRef.current = false;

        // Teardown existing adapter (if any) before reconnecting
        if (current) {
            try {
                current.close?.();
            } catch {
            }
            try {
                current.disconnect?.();
            } catch {
            }
        }

        setStatus('connecting');
        if (topic !== nextTopic) setTopic(nextTopic);
        const adapter = getChannelAdapter(token, nextTopic, roomId, Number(senderId) ?? 0);
        adapterRef.current = adapter;
        bindAdapterHandlers(adapter);
    }, [token, roomId, senderId, autoConnect, topicBuilder, bindAdapterHandlers, status, topic]);

    const disconnect = useCallback(() => {
        const a = adapterRef.current;
        if (!a) return;

        // Mark as manual disconnect ONLY if we're not currently unmounting/reconnecting
        // or if explicitly called from UI. 
        // For simplicity, let's keep it true here but be careful when calling it.
        isManualDisconnectRef.current = true;

        // Clear any pending reconnection attempts
        clearReconnectTimer();
        reconnectAttemptsRef.current = 0;
        isReconnectingRef.current = false;

        // Clear inactivity timer
        clearInactivityTimer();

        try {
            a?.close?.();
        } catch {
        }
        try {
            a?.disconnect?.();
        } catch {
        }
        adapterRef.current = null;
        setStatus('disconnected');
        // Do not call onClose here; adapter.onclose will invoke it to avoid duplicates
        log('disconnect');
    }, [clearReconnectTimer, clearInactivityTimer]);

    const join = useCallback(async (params?: { roomId: string; senderId: number }) => {
        const a = adapterRef.current;
        if (!a) return;
        const rid = params?.roomId ?? roomId;
        if (!rid) return;
        const sid = params?.senderId ?? senderId;
        if (sid === undefined) return;
        const t = topicBuilder(rid);

        // Prevent duplicate join attempts for same topic; delegate actual join to PhoenixSocketService
        if ((a as any).__joinedTopic === t) {
            if (debug) console.log('[useWebSocket] join skipped (already marked joined):', t);
            return;
        }
        (a as any).__joinedTopic = t;
        if (debug) console.log('[useWebSocket] join delegated to adapter/service for topic:', t, {
            roomId: rid,
            senderId: sid
        });

        // Intentionally no direct join here to avoid double joins.
        return;
    }, [roomId, topicBuilder, senderId, debug]);

    const leave = useCallback(async () => {
        const a = adapterRef.current;
        if (!a) return;
        const rid = roomId;
        if (!rid) return;
        const t = topicBuilder(rid);
        if (typeof a.leave === 'function') {
            return await a.leave(t);
        }
        if (typeof a.emit === 'function') {
            return await a.emit('phx_leave', {topic: t});
        }
    }, [roomId, topicBuilder]);

    const emit = useCallback(async (event: string, payload: any) => {
        const a = adapterRef.current;
        if (!a) return;
        try {
            return await a.emit?.(event, payload);
        } catch (e) {
            log('emit error', {event, e});
        }
    }, []);

    const addMessageListener = useCallback((cb: (data: unknown) => void) => {
        listenersRef.current.add(cb);
        return () => listenersRef.current.delete(cb);
    }, []);

    useEffect(() => {
        if (!autoConnect || !token || !roomId) {
            setStatus('idle');
            return;
        }
        connect();
        return () => {
            const a = adapterRef.current;
            if (a) {
                // For cleanup on unmount, we want a "silent" disconnect
                // that doesn't mark it as manual so that if we remount quickly
                // (due to React StrictMode or navigation) it can reconnect.
                clearReconnectTimer();
                clearInactivityTimer();
                try {
                    a.close?.();
                } catch {
                }
                try {
                    a.disconnect?.();
                } catch {
                }
                adapterRef.current = null;
                setStatus('disconnected');
            }
        };
    }, [autoConnect, token, roomId]);

    // Reconnect when the tab becomes visible or window gains focus
    useEffect(() => {
        if (!reconnectOnVisible) return;

        const tryConnect = () => {
            if (
                autoConnect &&
                document.visibilityState === 'visible' &&
                token &&
                roomId &&
                status !== 'connected'
            ) {
                connect();
            }
        };

        const onVisibility = () => tryConnect();
        const onFocus = () => tryConnect();

        document.addEventListener('visibilitychange', onVisibility);
        window.addEventListener('focus', onFocus);

        return () => {
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('focus', onFocus);
        };
    }, [reconnectOnVisible, autoConnect, token, roomId, status, connect]);

    useEffect(() => {
        if (!autoJoin || status !== 'connected') return;
        if (!roomId) return;
        const a = adapterRef.current as any;
        // Only adapters that declare they require manual join will be joined here.
        if (a && a.requiresManualJoin === true) {
            if (roomId && typeof senderId === 'number') {
                void join({roomId, senderId});
            }
        }
    }, [autoJoin, status, roomId, senderId, join]);

    // Set up disconnect ref for inactivity timer
    useEffect(() => {
        disconnectRef.current = disconnect;
    }, [disconnect]);

    // Cleanup reconnection timer on unmount
    useEffect(() => {
        return () => {
            clearReconnectTimer();
        };
    }, [clearReconnectTimer]);

    // Cleanup inactivity timer on unmount
    useEffect(() => {
        return () => {
            clearInactivityTimer();
        };
    }, [clearInactivityTimer]);

    // Wire read-receipt -> readLastId store update (production readiness: real-time updates)
    useEffect(() => {
        // Subscribe globally to read receipt events and update the store
        const unsubscribe = onReadReceipt(({roomId: rid, readerId}) => {
            try {
                const setPeerLastReadAt = useReadLastIdStore.getState().setPeerLastReadAt;
                if (typeof setPeerLastReadAt === 'function') {
                    const nowIso = new Date().toISOString();
                    setPeerLastReadAt(String(rid), Number(readerId), nowIso);
                }
            } catch {
            }
        });
        return () => {
            try {
                unsubscribe?.();
            } catch {
            }
        };
    }, []);

    return {
        status,
        isReady: status === 'connected',
        topic,
        connect,
        disconnect,
        join,
        leave,
        emit,
        addMessageListener,
        resetInactivityTimer,
    };
}

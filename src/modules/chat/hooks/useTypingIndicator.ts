// hooks/useTypingIndicator.ts
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import { sendTyping } from "@/modules/chat/events";

export function useTypingIndicator(opts: {
    wsAdapter: any;
    roomId: string;
    senderId: number;
    timeoutMs?: number;     // idle กี่ ms ถึงจะส่ง stopped (แนะนำ 1500–2000)
    onAfterSend?: (typing: boolean) => void; // callback after sending true/false
}) {
    const { wsAdapter, roomId, senderId, timeoutMs = 2000, onAfterSend } = opts;

    const [isTypingLocal, setIsTypingLocal] = useState(false);
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const disposedRef = useRef(false);

    const send = useCallback((typing: boolean) => {
      if (!wsAdapter) return;
      try {
        sendTyping({ adapter: wsAdapter, roomId, senderId }, typing);
      } catch {
        // no-op
      } finally {
        try { onAfterSend?.(typing); } catch {}
      }
    }, [wsAdapter, roomId, senderId, onAfterSend]);

    const stopNow = useCallback(() => {
        if(!isTypingLocal) return;
        if(idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
            idleTimerRef.current = null;
        }
        setIsTypingLocal(false);
        send(false); // << ส่งหยุดพิมพ์
    }, [isTypingLocal, send]);

    const startIfNeeded = useCallback(() => {
        if (!isTypingLocal) {
            setIsTypingLocal(true);
            send(true); // ส่งเฉพาะครั้งแรกที่เริ่มพิมพ์
        }
    }, [isTypingLocal, send]);

    const onUserTyping = useCallback(() => {
        startIfNeeded();
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
            if (!disposedRef.current) stopNow();
        }, timeoutMs);
    }, [startIfNeeded, stopNow, timeoutMs]);

    // Ensure we send a final "stop typing" on page hide/unmount
    useEffect(() => {
        const handleBlur = () => stopNow();
        const handleVisibility = () => {
            if (document.hidden) stopNow();
        };
        window.addEventListener('blur', handleBlur);
        document.addEventListener('visibilitychange', handleVisibility);
        return () => {
            disposedRef.current = true;
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('visibilitychange', handleVisibility);
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
                idleTimerRef.current = null;
            }
            // send final stop if we were typing
            if (isTypingLocal) {
                try { send(false); } catch {}
            }
        };
    }, [isTypingLocal, send, stopNow]);

    return {
        isTypingLocal,
        onUserTyping,
        startTyping: startIfNeeded,
        stopTyping: stopNow,
    } as const;
}
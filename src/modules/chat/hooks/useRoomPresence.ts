// hooks/useRoomPresence.ts
// Fetch initial presence snapshot via HTTP only. Realtime diffs are handled elsewhere.

import {useEffect, useRef} from 'react';
import {usePresenceStore} from '@/modules/chat/store/presenceStore';
import {HttpService} from "@/services";
import {LocalUserId} from "lemmy-js-client";
import {REQUEST_STATE} from "@/services/HttpService";
import {dbg} from "@/modules/chat/utils";
import {isBrowser} from "@/utils";

const HEARTBEAT_HTTP_GAP_MS = 5000; // at most one HTTP check per 5s per tab

export function useRoomPresence(peerId: LocalUserId) {
  const { setPeer, setPeerOffline } = usePresenceStore.getState();
  const lastHeartbeatAtRef = useRef(0);

  // Helper: fetch & update presence snapshot once
  const fetchPeerStatusOnce = async (reason: string) => {
    try {
      const res = await HttpService.client.getPeerStatus({peerId} as any);
      if (res.state === REQUEST_STATE.SUCCESS) {
        const payload: any = res.data;
        dbg('[useRoomPresence] getPeerStatus', { reason, peerId, payload });
        const online = payload?.online ?? payload?.data?.online;
        if (online === true) {
          setPeer(Number(peerId), Date.now());
        } else if (online === false) {
          setPeerOffline(Number(peerId));
        }
      }
    } catch (e) {
      // keep phase=unknown; UI may show “checking…”
      dbg('[useRoomPresence] getPeerStatus error', { reason, peerId, e });
    }
  };

  // 1) Fetch snapshot via HTTP on mount/param change
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (peerId == null) return;
      if (cancelled) return;
      await fetchPeerStatusOnce('mount');
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerId]);

  // 2) Re-check when tab becomes visible, window focuses, page shows from bfcache, or network comes online
  useEffect(() => {
    if (peerId == null) return;
    if (!isBrowser() || typeof document === 'undefined') return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    const debounced = (reason: string) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        if (document.visibilityState === 'visible' && document.hasFocus?.()) {
          await fetchPeerStatusOnce(reason);
        }
      }, 120);
    };

    const onFocus: EventListener = () => debounced('focus');
    const onVisibility: EventListener = () => debounced('visibilitychange');
    const onPageShow: EventListener = () => debounced('pageshow');
    const onOnline: EventListener = () => debounced('online');

    // Attach listeners with compact cleanup
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('online', onOnline);

    // Fire once if already visible and focused
    debounced('init-visibility');

    return () => {
      if (timer) clearTimeout(timer);
      try { window.removeEventListener('focus', onFocus); } catch {}
      try { document.removeEventListener('visibilitychange', onVisibility); } catch {}
      try { window.removeEventListener('pageshow', onPageShow); } catch {}
      try { window.removeEventListener('online', onOnline); } catch {}
    };
  }, [peerId]);

  // 3) Re-check on app heartbeat (emitted by socket layer), but rate-limit to avoid spam
  useEffect(() => {
    if (peerId == null) return;
    if (!isBrowser()) return;

    const onHeartbeat: EventListener = () => {
      const now = Date.now();
      if (now - lastHeartbeatAtRef.current < HEARTBEAT_HTTP_GAP_MS) return;
      lastHeartbeatAtRef.current = now;
      void fetchPeerStatusOnce('heartbeat');
    };

    window.addEventListener('chat:heartbeat', onHeartbeat);
    return () => {
      try { window.removeEventListener('chat:heartbeat', onHeartbeat); } catch {}
    };
  }, [peerId]);
}
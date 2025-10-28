"use client";

import {getChannelAdapter} from "@/modules/chat/services/PhoenixSocketService";
import {useRoomsStore} from "@/modules/chat/store/roomsStore";

// Debug toggle: set window.__DEBUG_BG_UNREAD = true or localStorage.DEBUG_BG_UNREAD = '1' to enable logs
const DEBUG_KEY = 'DEBUG_BG_UNREAD';
const dbg = (...args: any[]) => {
  try {
    const w: any = typeof window !== 'undefined' ? window : {};
    const on = !!(w.__DEBUG_BG_UNREAD || (typeof localStorage !== 'undefined' && localStorage.getItem(DEBUG_KEY)));
    if (on) console.log('[bg-unread]', ...args);
  } catch {}
};

// Global singleton state (เพื่อกัน HMR/remount ซ้ำ)
const W: any = typeof window !== "undefined" ? window : {} as any;
const KEY = "__bg_unread_watcher__";

type TokenGetter = () => string | null | undefined;
type UserIdGetter = () => string | number | null | undefined;

type BGState = {
    count: number;
    tokenGetter: TokenGetter | null;
    userIdGetter: UserIdGetter | null;
    stopFns: Array<() => void>;
    adapters: Map<string, ReturnType<typeof getChannelAdapter>>;
    seenByRoom: Map<string, Set<string>>; // de-dup message ids per room
};

function ensureState(): BGState {
    if (!W[KEY]) {
        W[KEY] = { count: 0, tokenGetter: null, userIdGetter: null, stopFns: [], adapters: new Map(), seenByRoom: new Map() } as BGState;
    }
    return W[KEY] as BGState;
}

export function enableBackgroundUnread(tokenGetter: TokenGetter, userIdGetter?: UserIdGetter) {
    const st = ensureState();
    st.count += 1;
    dbg('enable +1 ->', st.count);
    if (st.count > 1) return; // มีอยู่แล้ว

    st.tokenGetter = tokenGetter;
    st.userIdGetter = userIdGetter || null;
    dbg('start watcher', { hasToken: !!st.tokenGetter?.(), userId: st.userIdGetter?.() });
    const unsub = useRoomsStore.subscribe(() => reconcileRooms(st));
    st.stopFns.push(unsub);
    dbg('initial reconcile');
    reconcileRooms(st);
}

export function disableBackgroundUnread() {
    dbg('disable -1 request');
    const st = ensureState();
    st.count = Math.max(0, st.count - 1);
    dbg('disable -1 request');
    if (st.count > 0) return;
    dbg('stopped -> cleaning resources');

    try { st.stopFns.forEach(fn => { try { fn(); } catch {} }); } catch {}
    st.stopFns = [];

    try { st.adapters.forEach(ad => { try { ad.close(); } catch {} }); } catch {}
    st.adapters.clear();
    st.seenByRoom.clear();
    st.userIdGetter = null;
    st.tokenGetter = null;
    dbg('cleaned');
}

function reconcileRooms(st: BGState) {
    try {
        const token = st.tokenGetter?.();
        if (!token) return;

        const rooms = useRoomsStore.getState().rooms as Array<{ id: string }>;

        const active = useRoomsStore.getState().getActiveRoom();

        const selfIdRaw = st.userIdGetter?.();
        const selfId = selfIdRaw == null ? null : String(selfIdRaw);

        dbg('reconcile', { rooms: (rooms || []).map((r: any) => String(r.id)), active, selfId });

        const want = new Set<string>((rooms || []).map(r => String(r.id)));

        // ปิด adapter ที่ไม่ใช้แล้วหรือห้อง active
        for (const [roomId, ad] of Array.from(st.adapters.entries())) {
            if (!want.has(roomId) || String(active ?? '') === roomId) {
                try { ad.close(); } catch {}
                st.adapters.delete(roomId);
                st.seenByRoom.delete(roomId);
                dbg('close adapter', { roomId, reason: (!want.has(roomId) ? 'not-wanted' : 'active') });
            }
        }

        // เปิด adapter สำหรับห้องที่ต้องการ
        for (const id of want) {
            if (String(active ?? '') === id) continue;
            if (st.adapters.has(id)) continue;

            // reset seen cache on (re)subscribe
            st.seenByRoom.delete(id);

            dbg('open adapter', { roomId: id });
            const topic = `room:${id}`;
            const senderIdNum = selfId != null ? Number(selfId) : undefined;
            const adapter = getChannelAdapter(token, topic,id, Number(senderIdNum) ?? 0) as any;

            if (!st.seenByRoom.has(id)) st.seenByRoom.set(id, new Set<string>());
            const seen = st.seenByRoom.get(id)!;

            adapter.onmessage = (evt: { data: string; }) => {
                try {
                    const env = JSON.parse(evt.data);
                    const isMsg = env?.event === 'chat:message'
                        || env?.payload?.event === 'chat:message';
                    if (!isMsg) { dbg('skip non-message event', env?.event || env?.payload?.event); return; }
                    const payload = env.payload || env;
                    const roomId = String((env.topic ?? payload.topic ?? id) || id);
                    const messageId = String(payload.id ?? payload.message_id ?? '');
                    if (!messageId) { dbg('skip: no messageId', { roomId, payload }); return; }

                    if (seen.has(messageId)) { dbg('skip: duplicate', { roomId, messageId }); return; }
                    seen.add(messageId);

                    const sender = payload.senderId;
                    if (selfId != null && sender != null && String(sender) === selfId) { dbg('skip: from self', { roomId, messageId, sender }); return; }

                    const stRooms = useRoomsStore.getState();
                    const activeRoom = stRooms.getActiveRoom();
                    const activeFlag = typeof stRooms.isActive === 'function' ? !!stRooms.isActive(roomId) : (String(activeRoom ?? '') === roomId);
                    if (activeFlag) { dbg('skip: active room', { roomId, messageId }); return; }

                    dbg('increment', { roomId, messageId });
                    try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('bg-unread:increment', { detail: { roomId, messageId } })); } catch {}

                    try {
                      const inc = useRoomsStore.getState().incrementUnread as unknown as ((roomId: string, payload: { messageId: string }) => void) | undefined;
                      if (typeof inc === 'function') {
                        inc(roomId, { messageId });
                      } else {
                        dbg('store action missing: incrementUnread', { roomId, messageId });
                      }
                    } catch (err) {
                      console.error('[bg-unread] incrementUnread failed', err);
                    }

                } catch (e) {
                    dbg('onmessage error', e);
                }
            };
            st.adapters.set(id, adapter);
        }
    } catch (e) {
        console.error('[bg-unread] reconcile error', e);
    }
}
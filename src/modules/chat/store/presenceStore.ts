// store/presenceStore.ts
// Zustand presence store with snapshot-first flow, diff queueing, and robust helpers.
// All inline comments are in English per your preference.

import {create} from 'zustand';
import {subscribeWithSelector} from 'zustand/middleware';
import * as React from 'react';

export type PeerPresence = {
    userId: number;
    lastSeenAt: number; // epoch ms
};

type Phase = 'unknown' | 'ready' | 'subscribed';

type PresenceState = {
    byUserId: Record<number, PeerPresence>;
    phase: Phase;

    // Diffs that arrive before we apply the first snapshot
    _queuedDiffs: { upserts?: PeerPresence[]; removes?: number[] }[];

    // Actions
    setSnapshot: (list: PeerPresence[]) => void;
    setSubscribed: () => void;
    upsert: (p: PeerPresence) => void;
    upsertMany: (list: PeerPresence[]) => void;
    remove: (userId: number) => void;
    removeMany: (ids: number[]) => void;
    setPeer: (userId: number, lastSeenAt?: number) => void;
    setPeerOffline: (userId: number) => void;

    // Utilities
    touch: (userId: number, ts?: number) => void;
    pruneStale: (thresholdMs?: number, now?: number) => void;

    // Diff application (handles pre-snapshot queuing)
    applyDiff: (diff: { upserts?: PeerPresence[]; removes?: number[] }) => void;
};

export const usePresenceStore = create<PresenceState>()(
  subscribeWithSelector((set, get) => ({
      byUserId: {},
      phase: 'unknown',
      _queuedDiffs: [],

      setSnapshot: (list) => {
          set((s) => {
              const next = { ...s.byUserId };
              for (const p of list) {
                  next[p.userId] = p;
              }
              return { byUserId: next, phase: 'ready' };
          });

          const queued = get()._queuedDiffs;
          if (queued.length) {
              queued.forEach((d) => get().applyDiff(d));
              set({ _queuedDiffs: [] });
          }
      },


      setSubscribed: () => set({ phase: 'subscribed' }),

      upsert: (p) =>
        set((s) => ({
            byUserId: { ...s.byUserId, [p.userId]: p },
        })),

      upsertMany: (list) =>
        set((s) => {
            const next = { ...s.byUserId };
            for (const p of list) next[p.userId] = p;
            return { byUserId: next };
        }),

      remove: (userId) =>
        set((s) => {
            const next = { ...s.byUserId };
            delete next[userId];
            return { byUserId: next };
        }),

      removeMany: (ids) =>
        set((s) => {
            const next = { ...s.byUserId };
            for (const id of ids) delete next[id];
            return { byUserId: next };
        }),

      setPeer: (userId, lastSeenAt) =>
        set((s) => ({
            byUserId: {
                ...s.byUserId,
                [userId]: { userId, lastSeenAt: lastSeenAt ?? Date.now() },
            },
            phase: s.phase === 'unknown' ? 'ready' : s.phase,
        })),

      setPeerOffline: (userId) =>
        set((s) => ({
            byUserId: {
                ...s.byUserId,
                [userId]: { userId, lastSeenAt: 0 },
            },
            phase: s.phase === 'unknown' ? 'ready' : s.phase,
        })),

      touch: (userId, ts) =>
        set((s) => {
            const cur = s.byUserId[userId];
            if (!cur) return s; // ignore if peer is unknown
            const lastSeenAt = ts ?? Date.now();
            return { byUserId: { ...s.byUserId, [userId]: { ...cur, lastSeenAt } } };
        }),

      pruneStale: (thresholdMs = 20_000, now = Date.now()) =>
        set((s) => {
            const next: Record<number, PeerPresence> = {};
            for (const [k, p] of Object.entries(s.byUserId)) {
                if (now - p.lastSeenAt < thresholdMs) next[Number(k)] = p;
            }
            return { byUserId: next };
        }),

      applyDiff: (diff) => {
          const { phase } = get();
          if (phase === 'unknown') {
              // Queue until we have the initial snapshot
              set((s) => ({ _queuedDiffs: [...s._queuedDiffs, diff] }));
              return;
          }
          if (diff.upserts?.length) get().upsertMany(diff.upserts);
          if (diff.removes?.length) get().removeMany(diff.removes);
      },
  }))
);

// Derived helpers

/** Returns: true = online, false = offline, undefined = unknown (no snapshot info yet). */
export function isOnline(userId: number, thresholdMs = 20_000, now = Date.now()) {
    const { byUserId } = usePresenceStore.getState();
    const p = byUserId[userId];
    if (!p) return undefined; // still unknown — do not force false
    return now - p.lastSeenAt < thresholdMs;
}

/** React hook for reactive online status with three-state return. */
export function usePeerOnline(userId: number, thresholdMs = 20_000) {
    // Subscribe only to the lastSeenAt we care about
    const lastSeenAt = usePresenceStore((s) => s.byUserId[userId]?.lastSeenAt);

    // Local tick: re-compute exactly when the status would flip (heartbeat expiry)
    const [, forceTick] = React.useReducer((c) => c + 1, 0);

    React.useEffect(() => {
        if (lastSeenAt == null) return; // still unknown ⇒ no timer
        const now = Date.now();
        const msUntilFlip = lastSeenAt + thresholdMs - now;
        if (msUntilFlip <= 0) {
            // already expired; trigger a recompute once
            forceTick();
            return;
        }
        const t = setTimeout(forceTick, msUntilFlip);
        return () => clearTimeout(t);
    }, [lastSeenAt, thresholdMs]);

    if (lastSeenAt == null) return undefined; // unknown
    return Date.now() - lastSeenAt < thresholdMs;
}


/** React hook to read phase. */
export function usePresencePhase() {
    return usePresenceStore((s) => s.phase);
}
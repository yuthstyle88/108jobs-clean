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
  const { setPeerOnline, setPeerOffline } = usePresenceStore.getState();
  const lastHeartbeatAtRef = useRef(0);

  // Helper: fetch & update presence snapshot once
  const fetchPeerStatusOnce = async (reason: string) => {
    // OLD LOGIC REMOVED
  };

  // 1) NO-OP: We now rely on watchUserEvents for presence updates
  useEffect(() => {
    // We no longer fetch status on mount as we use snapshots and realtime signals
  }, [peerId]);

  // 2) NO-OP: We now rely on watchUserEvents for presence updates
  useEffect(() => {
    // We no longer fetch status on visibility change
  }, [peerId]);

  // 3) NO-OP: We now rely on watchUserEvents for presence updates
  useEffect(() => {
    // We no longer fetch status on heartbeat
  }, [peerId]);
}
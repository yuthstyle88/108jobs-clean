// ---- Optional emitter helper (no DOM emits) -------------------------------
export type SocketEmitLike = {
  emit?: (evt: string, payload: any) => void;
  send?: (data: string) => void;
};

/**
 * Create a function that emits read-ack events through a socket-like object.
 * - Injects `readerId` automatically.
 * - Works with either `.emit(evt, payload)` or `.send(JSON.stringify(frame))`.
 * - Debug can be toggled by setting localStorage['debug_read_ack'] = '1'.
 */
export function makeReadAckEmitter(
  ws: SocketEmitLike,
  readerId: number,
  opts?: { debugKey?: string }
) {
  const debugKey = opts?.debugKey ?? 'debug_read_ack';
  return (evt: string, payload: any) => {
    let enriched: any = { ...(payload || {}) };

    // Normalize only for chat:read — backend expects camelCase keys: roomId, readerId, lastReadMessageId
    if (evt === 'chat:read') {
      const roomId = enriched.roomId ?? enriched.topic ?? enriched.roomId;
      const lastReadMessageId =
        enriched.lastReadMessageId ??
        enriched.last_read_message_id ??
        enriched.id ??
        enriched.msgRefId ??
        enriched.messageId;

      enriched = {
        roomId: roomId != null ? String(roomId) : undefined,
        readerId: readerId,
        lastReadMessageId: lastReadMessageId != null ? String(lastReadMessageId) : undefined,
      };
    } else {
      // For other events, just inject readerId and pass through
      enriched.readerId = readerId;
    }
      try {
          if (typeof localStorage !== 'undefined' && localStorage.getItem(debugKey) === '1') {
              console.debug('[read-ack] emit', { evt, enriched });
          }
      } catch {}

    try {
      if (typeof (ws as any)?.emit === 'function') {
        (ws as any).emit(evt, enriched);
      } else if (typeof (ws as any)?.send === 'function') {
        (ws as any).send(JSON.stringify({ event: evt, payload: enriched }));
      }
    } catch {}
  };
}

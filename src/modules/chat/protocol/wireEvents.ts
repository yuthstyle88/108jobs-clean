/**
 * WebSocket wire-protocol event names, mirroring api-108jobs's ChatEvent
 * enum variant-for-variant (crates/ws/src/protocol/api.rs's enum definition,
 * crates/ws/src/protocol/impls.rs's ChatEvent::as_str()/FromStr). A developer
 * working on either side of the wire can look up a name here and find the
 * exact match on the other.
 *
 * Separate from `src/modules/chat/events/chatEvents.ts`'s `CHAT_EVENT`
 * constant, which is an unrelated concern: in-browser DOM CustomEvent names
 * for cross-component signaling within this frontend, not the WebSocket
 * wire protocol.
 *
 * PhxJoin/PhxLeave's values are the real `phoenix` npm client library's own
 * hardcoded wire format (sent internally by Channel.join()/.leave(), not by
 * this frontend's own code) -- included here for documentation/completeness
 * so any code that needs to recognize these frames references this constant
 * instead of a bare literal.
 */
export const WS_EVENT = Object.freeze({
  PhxJoin: "phx_join",
  PhxLeave: "phx_leave",
  Heartbeat: "heartbeat",
  Message: "chat:message",
  MessageAck: "messageAck",
  /** Server-to-client only: a sent message failed to make it into the
   * durable buffer backing persistence. Carries the same `clientId` shape
   * as MessageAck, so it can drive the same resend-until-ack tracking
   * instead of only a client-side timeout (see api-108jobs'
   * crates/ws/src/broker/bridge_message.rs, add_messages_to_room). */
  MessageNack: "messageNack",
  AckConfirm: "ackConfirm",
  SyncPending: "sync:pending",
  ReadUpTo: "readUpTo",
  ActiveRooms: "chat:activeRooms",
  Typing: "chat:typing",
  TypingStart: "typing:start",
  TypingStop: "typing:stop",
  Update: "chat:update",
  ChatsSignal: "chats:signal",
  GlobalOnline: "globalOnline",
  GlobalOffline: "globalOffline",
} as const);

export type WsEventValue = (typeof WS_EVENT)[keyof typeof WS_EVENT];

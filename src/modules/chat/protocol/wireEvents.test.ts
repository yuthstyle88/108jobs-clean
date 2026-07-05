import { describe, expect, it } from "vitest";
import { WS_EVENT } from "@/modules/chat/protocol/wireEvents";

// Pins this frontend's wire-protocol event names to api-108jobs's
// ChatEvent::as_str() (crates/ws/src/protocol/impls.rs) -- one assertion per
// variant, so a change to either side that isn't mirrored here fails loudly
// instead of silently drifting (the exact failure mode that caused real,
// silently-dropped-message bugs before api-108jobs PR #132).
describe("WS_EVENT matches the backend's ChatEvent::as_str() exactly", () => {
  it("PhxJoin is the real phoenix.js wire format", () => {
    expect(WS_EVENT.PhxJoin).toBe("phx_join");
  });

  it("PhxLeave is the real phoenix.js wire format", () => {
    expect(WS_EVENT.PhxLeave).toBe("phx_leave");
  });

  it("Heartbeat", () => {
    expect(WS_EVENT.Heartbeat).toBe("heartbeat");
  });

  it("Message", () => {
    expect(WS_EVENT.Message).toBe("chat:message");
  });

  it("MessageAck (inbound only, server->client)", () => {
    expect(WS_EVENT.MessageAck).toBe("messageAck");
  });

  it("AckConfirm (outbound, client->server)", () => {
    expect(WS_EVENT.AckConfirm).toBe("ackConfirm");
  });

  it("SyncPending", () => {
    expect(WS_EVENT.SyncPending).toBe("sync:pending");
  });

  it("ReadUpTo matches the backend's canonical outgoing string", () => {
    expect(WS_EVENT.ReadUpTo).toBe("readUpTo");
  });

  it("ActiveRooms", () => {
    expect(WS_EVENT.ActiveRooms).toBe("chat:activeRooms");
  });

  it("Typing", () => {
    expect(WS_EVENT.Typing).toBe("chat:typing");
  });

  it("TypingStart", () => {
    expect(WS_EVENT.TypingStart).toBe("typing:start");
  });

  it("TypingStop", () => {
    expect(WS_EVENT.TypingStop).toBe("typing:stop");
  });

  it("Update", () => {
    expect(WS_EVENT.Update).toBe("chat:update");
  });

  it("ChatsSignal", () => {
    expect(WS_EVENT.ChatsSignal).toBe("chats:signal");
  });

  it("GlobalOnline", () => {
    expect(WS_EVENT.GlobalOnline).toBe("globalOnline");
  });

  it("GlobalOffline", () => {
    expect(WS_EVENT.GlobalOffline).toBe("globalOffline");
  });

  it("is frozen (Object.freeze) so no call site can mutate a shared value", () => {
    expect(Object.isFrozen(WS_EVENT)).toBe(true);
  });
});

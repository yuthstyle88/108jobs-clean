import { describe, expect, it, vi } from "vitest";
import { PhoenixSenderAdapter } from "@/modules/chat/adapters/PhoenixSenderAdapter";

/**
 * Minimal fake of a real phoenix.js `Channel`: `push()` returns a chainable
 * "Push" object whose `.receive(status, cb)` registers a callback and
 * returns itself (so `.receive('ok', ..).receive('error', ..)` chaining
 * works exactly like the real library). Every call to `push()` returns the
 * *same* Push instance, mirroring how a real channel would behave for a
 * given logical send -- so if `sendMessage` calls `channel.push()` more
 * than once for one logical send, that's a real *second* network push,
 * not just a second look at the same result.
 */
function makeFakePhoenixChannel() {
  const pushObj: any = {};
  pushObj.receive = vi.fn((status: string, cb: (resp?: any) => void) => {
    if (status === "ok") {
      // Simulate an async server ack, like the real transport would.
      Promise.resolve().then(() => cb({ id: "server-1" }));
    }
    return pushObj;
  });

  const push = vi.fn((_event: string, _payload: unknown) => pushObj);
  return { push, pushObj };
}

describe("PhoenixSenderAdapter.sendMessage (Bug B: duplicate channel.push)", () => {
  it("calls channel.push exactly once per logical send (regression: previously pushed twice)", async () => {
    const channel = makeFakePhoenixChannel();
    const adapter = new PhoenixSenderAdapter(channel as any);

    const result = await adapter.sendMessage("chat:message", {
      id: "client-1",
      roomId: "room-1",
      senderId: 1,
      content: "hello",
      secure: false,
      createdAt: new Date().toISOString(),
      status: "sending",
    } as any);

    // The real bug: sendMessage called ch.push(event, payload) a second,
    // separate time purely to type-check `.receive`, which on a real
    // Phoenix channel sends the message over the wire again. Once the chat
    // bridge is actually connected (Bug A), this would double-send every
    // outbound chat message.
    expect(channel.push).toHaveBeenCalledTimes(1);
    expect(result).toBe("server-1");
  });

  it("still resolves false on an 'error' receive", async () => {
    const pushObj: any = {};
    pushObj.receive = vi.fn((status: string, cb: (resp?: any) => void) => {
      if (status === "error") {
        Promise.resolve().then(() => cb({ reason: "nope" }));
      }
      return pushObj;
    });
    const push = vi.fn(() => pushObj);
    const adapter = new PhoenixSenderAdapter({ push } as any);

    const result = await adapter.sendMessage("chat:message", {
      id: "client-2",
      roomId: "room-1",
      senderId: 1,
      content: "hello",
      secure: false,
      createdAt: new Date().toISOString(),
      status: "sending",
    } as any);

    expect(push).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });

  it("falls back to the client id (single push call) when the channel has no .receive method", async () => {
    const push = vi.fn(() => ({} as any)); // push() succeeds but result has no .receive
    const adapter = new PhoenixSenderAdapter({ push } as any);

    const result = await adapter.sendMessage("chat:message", {
      id: "client-3",
      roomId: "room-1",
      senderId: 1,
      content: "hello",
      secure: false,
      createdAt: new Date().toISOString(),
      status: "sending",
    } as any);

    expect(push).toHaveBeenCalledTimes(1);
    expect(result).toBe("client-3");
  });
});

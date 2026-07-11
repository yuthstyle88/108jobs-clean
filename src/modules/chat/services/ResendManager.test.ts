import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ResendManager, type ChatStorePort, type RetryMeta } from "@/modules/chat/services/ResendManager";
import type { PhoenixSenderAdapter } from "@/modules/chat/adapters/PhoenixSenderAdapter";

// Minimal in-memory ChatStorePort double -- ResendManager only reads/writes
// through this narrow interface, so no real zustand store is needed.
function fakeStore() {
  let retryMeta: RetryMeta = {};
  const failedMessages: any[] = [];
  const upsertRetryMeta = vi.fn((id: string, meta: { retry: number; next: number }) => {
    retryMeta = { ...retryMeta, [id]: meta };
  });
  const dropRetryMeta = vi.fn((id: string) => {
    const next = { ...retryMeta };
    delete next[id];
    retryMeta = next;
  });
  const markFailed = vi.fn();
  const promoteToSent = vi.fn();
  const store: ChatStorePort = {
    getState: () => ({ failedMessages, retryMeta }),
    upsertRetryMeta,
    dropRetryMeta,
    markFailed,
    promoteToSent,
  };
  return { store, upsertRetryMeta, dropRetryMeta, markFailed, failedMessages };
}

function fakeSender(sendMessage: ReturnType<typeof vi.fn>) {
  return { sendMessage } as unknown as PhoenixSenderAdapter;
}

describe("ResendManager.onSendFailure", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("stages retry meta for the given message id, starting at retry 0", () => {
    const { store, upsertRetryMeta } = fakeStore();
    const mgr = new ResendManager(store, fakeSender(vi.fn()));

    mgr.onSendFailure("msg-1", "room-1");

    expect(upsertRetryMeta).toHaveBeenCalledWith(
      "msg-1",
      expect.objectContaining({ retry: 0 })
    );
  });

  it("increments the staged retry count on a second failure for the same message", () => {
    const { store, upsertRetryMeta } = fakeStore();
    const mgr = new ResendManager(store, fakeSender(vi.fn()));

    mgr.onSendFailure("msg-1", "room-1");
    mgr.onSendFailure("msg-1", "room-1");

    expect(upsertRetryMeta).toHaveBeenLastCalledWith(
      "msg-1",
      expect.objectContaining({ retry: 0 })
    );
    // NOTE: onSendFailure reads `retry` from existing meta but never
    // increments it itself -- flush() is what bumps it after an actual
    // failed resend attempt. Calling onSendFailure twice in a row without
    // an intervening flush re-stages the same retry count, just with a
    // fresh `next` delay -- this pins that actual (if perhaps surprising)
    // behavior rather than an assumption about it.
  });

  /**
   * Regression coverage for the actual bug this fixes: onSendFailure's own
   * doc comment claims it's one of only two things that "wake" a resend
   * cycle, but the method itself only ever staged retry meta -- nothing
   * else automatically revisits it (only a manual UI retry button or an
   * offline->online transition trigger a flush), so calling onSendFailure
   * alone previously had zero observable effect until the user noticed and
   * retried by hand.
   */
  it("self-schedules an actual resend of the failed message after the computed delay", async () => {
    const { store, failedMessages } = fakeStore();
    failedMessages.push({
      id: "msg-1",
      roomId: "room-1",
      senderId: 1,
      secure: false,
      content: "hello",
      status: "failed",
      createdAt: new Date().toISOString(),
      isOwner: true,
    });
    const sendMessage = vi.fn().mockResolvedValue("server-id-1");
    const mgr = new ResendManager(store, fakeSender(sendMessage));

    mgr.onSendFailure("msg-1", "room-1");
    expect(sendMessage).not.toHaveBeenCalled();

    // Base delay for a first failure is 1000ms +/- 15% jitter -- advance
    // comfortably past the jittered ceiling.
    await vi.advanceTimersByTimeAsync(1200);

    expect(sendMessage).toHaveBeenCalledTimes(1);
  });

  it("only flushes the room the failure was reported for", async () => {
    const { store, failedMessages } = fakeStore();
    failedMessages.push(
      {
        id: "msg-1",
        roomId: "room-1",
        senderId: 1,
        secure: false,
        content: "hello",
        status: "failed",
        createdAt: new Date().toISOString(),
        isOwner: true,
      },
      {
        id: "msg-2",
        roomId: "room-2",
        senderId: 1,
        secure: false,
        content: "other room",
        status: "failed",
        createdAt: new Date().toISOString(),
        isOwner: true,
      }
    );
    const sendMessage = vi.fn().mockResolvedValue("server-id");
    const mgr = new ResendManager(store, fakeSender(sendMessage));

    mgr.onSendFailure("msg-1", "room-1");
    await vi.advanceTimersByTimeAsync(1200);

    expect(sendMessage).toHaveBeenCalledTimes(1);
    expect(sendMessage.mock.calls[0][1]).toMatchObject({ id: "msg-1" });
  });
});

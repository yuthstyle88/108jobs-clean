import { describe, expect, it } from "vitest";
import {
  parseNackPayload,
  selectFailedMessagesForResend,
} from "@/modules/chat/contexts/PhoenixChatBridgeProvider";

describe("selectFailedMessagesForResend", () => {
  const validMsg = {
    id: "msg-1",
    roomId: "room-1",
    senderId: 1,
    secure: false,
    content: "hello",
    status: "failed",
    createdAt: "2026-01-01T00:00:00Z",
    isOwner: true,
  };

  it("finds a failed message nested under messagesByRoom", () => {
    const result = selectFailedMessagesForResend({ "room-1": [validMsg] });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("msg-1");
  });

  /**
   * Regression coverage for the actual bug this fixes: the previous
   * implementation read from the store's `listMessages` field, which no
   * real message-adding code path (addMessage/addSending/upsertMessage)
   * ever populates -- only `messagesByRoom` is. Reading `listMessages`
   * always returned an empty array, so ResendManager could never find
   * anything to resend regardless of status or retry meta.
   */
  it("flattens across multiple rooms", () => {
    const other = { ...validMsg, id: "msg-2", roomId: "room-2" };
    const result = selectFailedMessagesForResend({
      "room-1": [validMsg],
      "room-2": [other],
    });
    expect(result.map((m) => m.id).sort()).toEqual(["msg-1", "msg-2"]);
  });

  it("excludes messages that are not status 'failed'", () => {
    const sending = { ...validMsg, id: "msg-2", status: "sending" };
    const result = selectFailedMessagesForResend({ "room-1": [validMsg, sending] });
    expect(result.map((m) => m.id)).toEqual(["msg-1"]);
  });

  it("excludes a failed message missing a required field (malformed draft)", () => {
    const noContent = { ...validMsg, id: "msg-2", content: "" };
    const result = selectFailedMessagesForResend({ "room-1": [validMsg, noContent] });
    expect(result.map((m) => m.id)).toEqual(["msg-1"]);
  });

  it("returns an empty array for an empty or missing messagesByRoom", () => {
    expect(selectFailedMessagesForResend({})).toEqual([]);
    expect(selectFailedMessagesForResend(undefined)).toEqual([]);
    expect(selectFailedMessagesForResend(null)).toEqual([]);
  });

  it("tolerates a room entry that isn't an array", () => {
    const result = selectFailedMessagesForResend({
      "room-1": [validMsg],
      "room-2": undefined as any,
    });
    expect(result.map((m) => m.id)).toEqual(["msg-1"]);
  });
});

describe("parseNackPayload", () => {
  it("extracts clientId and roomId from a direct payload", () => {
    const result = parseNackPayload({ clientId: "cid-1", roomId: "room-1" }, "fallback-room");
    expect(result).toEqual({ clientId: "cid-1", roomId: "room-1" });
  });

  it("extracts from a single-wrapped { payload: {...} } envelope", () => {
    const result = parseNackPayload({ payload: { clientId: "cid-1", roomId: "room-1" } }, undefined);
    expect(result).toEqual({ clientId: "cid-1", roomId: "room-1" });
  });

  it("extracts from a double-wrapped { payload: { payload: {...} } } envelope", () => {
    const result = parseNackPayload(
      { payload: { payload: { clientId: "cid-1", roomId: "room-1" } } },
      undefined
    );
    expect(result).toEqual({ clientId: "cid-1", roomId: "room-1" });
  });

  it("unwraps a forwarded envelope ({ event, payload: {...} })", () => {
    const result = parseNackPayload(
      { payload: { event: "messageNack", payload: { clientId: "cid-1", roomId: "room-1" } } },
      undefined
    );
    expect(result).toEqual({ clientId: "cid-1", roomId: "room-1" });
  });

  it("falls back to the provided roomId when the payload carries none", () => {
    const result = parseNackPayload({ clientId: "cid-1" }, "fallback-room");
    expect(result).toEqual({ clientId: "cid-1", roomId: "fallback-room" });
  });

  it("returns null when the payload carries no clientId", () => {
    expect(parseNackPayload({ roomId: "room-1" }, "fallback-room")).toBeNull();
  });

  it("returns null when neither the payload nor the fallback carries a roomId", () => {
    expect(parseNackPayload({ clientId: "cid-1" }, undefined)).toBeNull();
  });
});

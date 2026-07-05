import { describe, expect, it, vi } from "vitest";
import { sendDeliveryAck, sendReadReceipt, sendTyping } from "@/modules/chat/events/sendEvents";
import { WS_EVENT } from "@/modules/chat/protocol/wireEvents";

// A fake adapter that just records what gets pushed, so these tests assert
// on the actual packet.event value sendEvents.ts constructs -- not on the
// string literal in the test itself, which wouldn't catch a typo'd literal
// still lingering in the source.
function fakeAdapter() {
  const sent: Array<{ event: unknown; payload: unknown }> = [];
  return {
    sent,
    adapter: {
      send: vi.fn(),
      emit: (event: string, payload: unknown) => {
        sent.push({ event, payload });
      },
    },
  };
}

describe("sendEvents.ts outbound builders use WS_EVENT, not re-typed literals", () => {
  it("sendReadReceipt emits WS_EVENT.ReadUpTo", () => {
    const { adapter, sent } = fakeAdapter();
    sendReadReceipt({ roomId: "room1", senderId: 1 as any, adapter }, "msg-123");
    expect(sent).toHaveLength(1);
    expect(sent[0].event).toBe(WS_EVENT.ReadUpTo);
  });

  it("sendDeliveryAck emits WS_EVENT.AckConfirm", () => {
    const { adapter, sent } = fakeAdapter();
    sendDeliveryAck({ roomId: "room1", senderId: 1 as any, adapter }, "msg-123");
    expect(sent).toHaveLength(1);
    expect(sent[0].event).toBe(WS_EVENT.AckConfirm);
  });

  it("sendTyping emits WS_EVENT.Typing", () => {
    const { adapter, sent } = fakeAdapter();
    sendTyping({ roomId: "room1", senderId: 1 as any, adapter }, true);
    expect(sent).toHaveLength(1);
    expect(sent[0].event).toBe(WS_EVENT.Typing);
  });
});

import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const CHAT_MODULE_ROOT = join(__dirname, "..");

function listTsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...listTsFiles(full));
    } else if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith(".test.ts")) {
      out.push(full);
    }
  }
  return out;
}

// Guards against someone re-introducing an inline literal instead of using
// WS_EVENT -- the exact kind of drift that caused the original bug (this
// frontend's outbound "chat:readUpTo"/"chat:ack" silently diverging from
// the backend's canonical "readUpTo"/"ackConfirm").
describe("no stray legacy wire-string literals remain outside wireEvents.ts", () => {
  const files = listTsFiles(CHAT_MODULE_ROOT).filter(
    (f) => !f.endsWith(`${join("protocol", "wireEvents.ts")}`)
  );

  it("'chat:readUpTo' does not appear anywhere in src/modules/chat/", () => {
    const offenders = files.filter((f) => readFileSync(f, "utf8").includes("chat:readUpTo"));
    expect(offenders).toEqual([]);
  });

  it("'chat:ack' does not appear anywhere in src/modules/chat/ (outside comments already reviewed)", () => {
    const offenders = files.filter((f) => readFileSync(f, "utf8").includes("'chat:ack'") || readFileSync(f, "utf8").includes('"chat:ack"'));
    expect(offenders).toEqual([]);
  });
});

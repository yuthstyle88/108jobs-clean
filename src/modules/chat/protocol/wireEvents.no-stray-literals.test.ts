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

  // Same guard, for the three names wire v2 retired. These were the `phoenix`
  // npm client's, not ours; the library is gone and so is the Elixir relay
  // that made us speak its dialect. A literal creeping back would be a client
  // quietly talking v1 at a server that only answers v2 -- and since all
  // three clients ship together with no compatibility shim, that is a silent
  // dead connection rather than a loud error.
  it.each(["phx_join", "phx_leave", "phx_reply", "phx_error"])(
    "'%s' does not appear as a string literal anywhere in src/modules/chat/",
    (legacy) => {
      const offenders = files.filter((f) => {
        const src = readFileSync(f, "utf8");
        return src.includes(`'${legacy}'`) || src.includes(`"${legacy}"`);
      });
      expect(offenders).toEqual([]);
    }
  );
});

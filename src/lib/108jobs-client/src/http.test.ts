import { describe, expect, it } from "vitest";
import { Api108Jobs } from "./http";

describe("Api108Jobs identity-platform methods", () => {
  it("exposes loginWithIdentityPlatform and registerWithIdentityPlatform, and no longer exposes login", () => {
    const client = new Api108Jobs("http://localhost:8536");
    expect(typeof client.loginWithIdentityPlatform).toBe("function");
    expect(typeof client.registerWithIdentityPlatform).toBe("function");
    expect((client as unknown as Record<string, unknown>).login).toBeUndefined();
  });
});

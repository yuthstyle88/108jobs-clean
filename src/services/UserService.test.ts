// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { isAdminClaims, JOBS_ADMIN_ROLE } from "./UserService";

describe("isAdminClaims", () => {
  it("returns false for undefined claims", () => {
    expect(isAdminClaims(undefined)).toBe(false);
  });

  it("returns false when roles is missing", () => {
    expect(isAdminClaims({ sub: "1", iss: "auth-service", aud: "jobs", exp: 0, iat: 0, realm: "r", platform: "p", tenant_id: "t" } as any)).toBe(false);
  });

  it("returns false when roles doesn't include jobs:admin", () => {
    expect(isAdminClaims({ roles: ["jobs:user"] } as any)).toBe(false);
  });

  it("returns true when roles includes jobs:admin", () => {
    expect(isAdminClaims({ roles: ["jobs:user", JOBS_ADMIN_ROLE] } as any)).toBe(true);
  });
});

import { UserService } from "./UserService";
import { HttpService } from "./HttpService";

describe("UserService profile hydration", () => {
  it("sources currentLanguage and acceptedTerms from getMyUser(), not from JWT claims", async () => {
    vi.spyOn(HttpService, "client", "get").mockReturnValue({
      getMyUser: vi.fn().mockResolvedValue({
        state: "success",
        data: {
          localUserView: {
            localUser: { interfaceLanguage: "en", acceptedTerms: true },
          },
        },
      }),
    } as any);

    await UserService.Instance.login("not-a-real-jwt");

    expect(UserService.Instance.getLanguage).toBe("en");
    expect(UserService.Instance.getAcceptedTerms).toBe(true);
  });
});

describe("UserService refresh scheduling", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("schedules exactly one refresh call after login, firing before the token's expiry", async () => {
    vi.spyOn(HttpService, "client", "get").mockReturnValue({
      getMyUser: vi.fn().mockResolvedValue({ state: "failed" }),
      refreshWithIdentityPlatform: vi.fn().mockResolvedValue({
        state: "success",
        data: { accessToken: "new-token", refreshToken: "new-refresh", expiresIn: 3600 },
      }),
    } as any);

    const nowSeconds = Math.floor(Date.now() / 1000);
    const header = { alg: "none" };
    const payload = { sub: "1", iss: "auth-service", aud: "jobs", exp: nowSeconds + 120, iat: nowSeconds, roles: ["user"], realm: "r", platform: "p", tenant_id: "t" };
    const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
    const fakeJwt = `${b64(header)}.${b64(payload)}.sig`;

    await UserService.Instance.login(fakeJwt, "a-refresh-token");

    const refreshSpy = HttpService.client.refreshWithIdentityPlatform as ReturnType<typeof vi.fn>;
    expect(refreshSpy).not.toHaveBeenCalled();

    // Token expires in 120s from "now"; REFRESH_MARGIN_MS is 60s, so the
    // timer should fire at ~60s, well before the full 120s.
    await vi.advanceTimersByTimeAsync(61_000);

    expect(refreshSpy).toHaveBeenCalledTimes(1);
    expect(refreshSpy).toHaveBeenCalledWith({ refreshToken: "a-refresh-token" });
  });

  it("does not schedule a refresh when no refreshToken is provided", async () => {
    vi.spyOn(HttpService, "client", "get").mockReturnValue({
      getMyUser: vi.fn().mockResolvedValue({ state: "failed" }),
      refreshWithIdentityPlatform: vi.fn(),
    } as any);

    await UserService.Instance.login("some-token-without-refresh");
    await vi.advanceTimersByTimeAsync(10 * 60 * 1000);

    const refreshSpy = HttpService.client.refreshWithIdentityPlatform as ReturnType<typeof vi.fn>;
    expect(refreshSpy).not.toHaveBeenCalled();
  });
});

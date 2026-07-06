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
import { getAuthJWTCookie, setAuthJWTCookie } from "@/utils/browser";

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

  it("re-arms the refresh timer from setToken(), the page-reload rehydration path", async () => {
    vi.spyOn(HttpService, "client", "get").mockReturnValue({
      getMyUser: vi.fn().mockResolvedValue({ state: "failed" }),
      refreshWithIdentityPlatform: vi.fn().mockResolvedValue({
        state: "success",
        data: { accessToken: "new-token", refreshToken: "new-refresh", expiresIn: 3600 },
      }),
    } as any);

    // setToken() is called by UserServiceContext on every app mount/reload,
    // reading the access-token cookie back into memory -- it must re-arm the
    // refresh timer the same way login() does, using the refresh-token cookie
    // that a prior login() already left in place.
    document.cookie = "refresh_token=a-refresh-token; path=/;";

    const nowSeconds = Math.floor(Date.now() / 1000);
    const header = { alg: "none" };
    const payload = { sub: "1", iss: "auth-service", aud: "jobs", exp: nowSeconds + 120, iat: nowSeconds, roles: ["user"], realm: "r", platform: "p", tenant_id: "t" };
    const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
    const fakeJwt = `${b64(header)}.${b64(payload)}.sig`;

    await UserService.Instance.setToken(fakeJwt);

    const refreshSpy = HttpService.client.refreshWithIdentityPlatform as ReturnType<typeof vi.fn>;
    expect(refreshSpy).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(61_000);

    expect(refreshSpy).toHaveBeenCalledTimes(1);
    expect(refreshSpy).toHaveBeenCalledWith({ refreshToken: "a-refresh-token" });

    document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  });

  it("retries once after a failed refresh while the access token is still valid, and succeeds without logging out", async () => {
    vi.spyOn(HttpService, "client", "get").mockReturnValue({
      getMyUser: vi.fn().mockResolvedValue({ state: "failed" }),
      refreshWithIdentityPlatform: vi.fn()
        .mockRejectedValueOnce(new Error("network blip"))
        .mockResolvedValueOnce({
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

    // First attempt fires at ~60s and fails (network blip). The access token
    // still has ~60s of life left, so this must NOT trigger a logout -- it
    // should instead schedule a retry.
    await vi.advanceTimersByTimeAsync(61_000);

    expect(refreshSpy).toHaveBeenCalledTimes(1);
    expect(UserService.Instance.authInfo).toBeDefined();
    expect(UserService.Instance.authInfo?.claims?.exp).toBe(payload.exp);

    // Retry fires 3s later and succeeds.
    await vi.advanceTimersByTimeAsync(3_000);

    expect(refreshSpy).toHaveBeenCalledTimes(2);
    expect(UserService.Instance.authInfo).toBeDefined();
    expect(getAuthJWTCookie()).toBe("new-token");
  });

  it("logs out after the retry also fails", async () => {
    vi.spyOn(HttpService, "client", "get").mockReturnValue({
      getMyUser: vi.fn().mockResolvedValue({ state: "failed" }),
      logout: vi.fn().mockResolvedValue({ state: "success" }),
      refreshWithIdentityPlatform: vi.fn().mockRejectedValue(new Error("network blip")),
    } as any);

    const nowSeconds = Math.floor(Date.now() / 1000);
    const header = { alg: "none" };
    const payload = { sub: "1", iss: "auth-service", aud: "jobs", exp: nowSeconds + 120, iat: nowSeconds, roles: ["user"], realm: "r", platform: "p", tenant_id: "t" };
    const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
    const fakeJwt = `${b64(header)}.${b64(payload)}.sig`;

    await UserService.Instance.login(fakeJwt, "a-refresh-token");

    const refreshSpy = HttpService.client.refreshWithIdentityPlatform as ReturnType<typeof vi.fn>;
    expect(refreshSpy).not.toHaveBeenCalled();

    // Original attempt at ~60s fails.
    await vi.advanceTimersByTimeAsync(61_000);

    expect(refreshSpy).toHaveBeenCalledTimes(1);
    expect(UserService.Instance.authInfo).toBeDefined();

    // First retry (+3s) also fails. retryCount was 0, still < MAX_REFRESH_RETRIES=2,
    // so another retry is scheduled instead of giving up.
    await vi.advanceTimersByTimeAsync(3_000);

    expect(refreshSpy).toHaveBeenCalledTimes(2);
    expect(UserService.Instance.authInfo).toBeDefined();

    // Second retry (+3s) also fails. retryCount was 1, now == MAX_REFRESH_RETRIES=2,
    // so retries are exhausted and logout() is called.
    await vi.advanceTimersByTimeAsync(3_000);

    expect(refreshSpy).toHaveBeenCalledTimes(3);
    expect(UserService.Instance.authInfo).toBeUndefined();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("detects a sibling tab's already-rotated refresh token and retries immediately instead of waiting", async () => {
    vi.spyOn(HttpService, "client", "get").mockReturnValue({
      getMyUser: vi.fn().mockResolvedValue({ state: "failed" }),
      refreshWithIdentityPlatform: vi.fn()
        .mockImplementationOnce(async () => {
          // Simulates a sibling tab's rotation landing in the shared cookie
          // at roughly the same moment this tab's own request is rejected.
          document.cookie = "refresh_token=rt-from-sibling; path=/;";
          throw new Error("refresh_token_reuse");
        })
        .mockResolvedValueOnce({
          state: "success",
          data: { accessToken: "sibling-rotated-token", refreshToken: "sibling-rotated-refresh", expiresIn: 3600 },
        }),
    } as any);

    const nowSeconds = Math.floor(Date.now() / 1000);
    const header = { alg: "none" };
    const payload = { sub: "1", iss: "auth-service", aud: "jobs", exp: nowSeconds + 120, iat: nowSeconds, roles: ["user"], realm: "r", platform: "p", tenant_id: "t" };
    const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
    const fakeJwt = `${b64(header)}.${b64(payload)}.sig`;

    await UserService.Instance.login(fakeJwt, "rt-original");

    const refreshSpy = HttpService.client.refreshWithIdentityPlatform as ReturnType<typeof vi.fn>;

    // Token expires in 120s; REFRESH_MARGIN_MS is 60s, so the initial refresh
    // fires at ~60s. Its failure handler detects the sibling-rotated cookie
    // and schedules the retry with a 0ms delay, so the retry runs within this
    // same advance (a 0ms timer gets no separate time budget to wait out) --
    // the sequence of calls, rather than an intermediate call count, is what
    // proves the retry fired immediately rather than after the fixed delay.
    await vi.advanceTimersByTimeAsync(61_000);

    expect(refreshSpy).toHaveBeenCalledTimes(2);
    expect(refreshSpy).toHaveBeenNthCalledWith(1, { refreshToken: "rt-original" });
    expect(refreshSpy).toHaveBeenNthCalledWith(2, { refreshToken: "rt-from-sibling" });
    expect(UserService.Instance.authInfo).toBeDefined();

    document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  });
});

describe("UserService refresh scheduling with Web Locks", () => {
  let mockLocksRequest: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockLocksRequest = vi.fn((_name: string, callback: () => Promise<unknown>) => {
      return Promise.resolve().then(callback);
    });
    Object.defineProperty(navigator, "locks", {
      value: { request: mockLocksRequest },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    // @ts-expect-error -- test-only stub; real jsdom has no `locks` property
    delete navigator.locks;
  });

  it("adopts an already-fresh cookie without calling the network", async () => {
    vi.spyOn(HttpService, "client", "get").mockReturnValue({
      getMyUser: vi.fn().mockResolvedValue({ state: "failed" }),
      refreshWithIdentityPlatform: vi.fn(),
    } as any);

    const nowSeconds = Math.floor(Date.now() / 1000);
    const header = { alg: "none" };
    const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
    const makeJwt = (exp: number) => {
      const payload = { sub: "1", iss: "auth-service", aud: "jobs", exp, iat: nowSeconds, roles: ["user"], realm: "r", platform: "p", tenant_id: "t" };
      return `${b64(header)}.${b64(payload)}.sig`;
    };

    // Schedules a refresh at ~60s (exp is 120s out, REFRESH_MARGIN_MS is 60s).
    const staleJwt = makeJwt(nowSeconds + 120);
    await UserService.Instance.login(staleJwt, "a-refresh-token");

    // Simulate a sibling tab completing a refresh in the meantime: overwrite
    // the access-token cookie with a fresh one, well outside REFRESH_MARGIN_MS.
    const freshJwt = makeJwt(nowSeconds + 10_000);
    setAuthJWTCookie(freshJwt);

    const refreshSpy = HttpService.client.refreshWithIdentityPlatform as ReturnType<typeof vi.fn>;

    await vi.advanceTimersByTimeAsync(61_000);

    expect(mockLocksRequest).toHaveBeenCalled();
    expect(refreshSpy).not.toHaveBeenCalled();
    expect(UserService.Instance.authInfo?.claims?.exp).toBe(nowSeconds + 10_000);
  });

  it("performs the real refresh under the lock when the cookie is still near-expiry, invoking the Locks API with the expected name", async () => {
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

    await vi.advanceTimersByTimeAsync(61_000);

    expect(mockLocksRequest).toHaveBeenCalledTimes(1);
    expect(mockLocksRequest).toHaveBeenCalledWith("108jobs-refresh-token-lock", expect.any(Function));
    expect(refreshSpy).toHaveBeenCalledTimes(1);
    expect(refreshSpy).toHaveBeenCalledWith({ refreshToken: "a-refresh-token" });
  });

  it("routes the retry back through the lock instead of calling #refreshAccessToken directly", async () => {
    vi.spyOn(HttpService, "client", "get").mockReturnValue({
      getMyUser: vi.fn().mockResolvedValue({ state: "failed" }),
      refreshWithIdentityPlatform: vi.fn()
        .mockRejectedValueOnce(new Error("network blip"))
        .mockResolvedValueOnce({
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

    // Initial attempt at ~60s fails (network blip), acquiring the lock once.
    await vi.advanceTimersByTimeAsync(61_000);

    expect(mockLocksRequest).toHaveBeenCalledTimes(1);
    expect(refreshSpy).toHaveBeenCalledTimes(1);

    // Retry fires 3s later. It must ALSO acquire the lock -- not call
    // #refreshAccessToken directly, unlocked -- which is exactly the bug
    // this test exists to catch.
    await vi.advanceTimersByTimeAsync(3_000);

    expect(mockLocksRequest).toHaveBeenCalledTimes(2);
    expect(refreshSpy).toHaveBeenCalledTimes(2);
    expect(UserService.Instance.authInfo).toBeDefined();
  });
});

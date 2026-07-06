// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach } from "vitest";
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

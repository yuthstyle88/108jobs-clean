import { Page } from '@playwright/test';

export type MockAuthOptions = {
  success?: boolean;
  user?: { id: number; name: string; email: string };
};

/**
 * Enable mocked authentication network routes so login tests can run without a real backend.
 * It intercepts these endpoints (described textually to avoid closing comment tokens):
 *  - POST login endpoint under /api (returns 200 with a token & user, or 401 on failure)
 *  - GET  /api/session (returns authenticated session payload)
 *  - GET  /api/v4/site (returns minimal site info to avoid dev warning banners)
 */
// A structurally-valid (but unsigned) fake JWT: LoginForm/handlers.ts decodes
// the login response's accessToken via jwt-decode immediately on success
// (jwtDecode throws on anything that isn't three base64url segments), so a
// plain placeholder string like the old 'mock-jwt' value crashes the app
// before this mock's job (letting the UI render as authenticated) is done.
function fakeJwt(): string {
  const b64url = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');
  const header = b64url({ alg: 'none', typ: 'JWT' });
  const nowSeconds = Math.floor(Date.now() / 1000);
  const payload = b64url({
    sub: 'mock-user',
    iss: 'mock-issuer',
    aud: 'jobs',
    exp: nowSeconds + 3600,
    iat: nowSeconds,
    roles: ['user'],
    realm: 'mock',
    platform: 'jobs',
    tenant_id: 'mock-tenant',
  });
  return `${header}.${payload}.mock-signature`;
}

export async function enableMockAuth(page: Page, opts: MockAuthOptions = {}) {
  const { success = true, user = { id: 1, name: 'Test User', email: 'test@example.com' } } = opts;

  await page.route('**/api/**', async (route) => {
    const req = route.request();
    const url = req.url();
    const method = req.method();

    // POST .../api/...login
    if (method === 'POST' && /\/api\/.*login/i.test(url)) {
      if (success) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            accessToken: fakeJwt(),
            refreshToken: fakeJwt(),
            expiresIn: 3600,
            user,
          }),
        });
      }
      return route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid credentials' }),
      });
    }

    // GET /api/session (filesystem route in project)
    if (method === 'GET' && /\/api\/session$/i.test(url)) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          authenticated: success,
          token: success ? fakeJwt() : null,
          user: success ? user : null,
        }),
      });
    }

    // GET .../api/v4/site — avoid warning banner when backend is down in dev
    if (method === 'GET' && /\/api\/v4\/site/i.test(url)) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ site: { name: 'Mock Site' } }),
      });
    }

    return route.continue();
  });
}

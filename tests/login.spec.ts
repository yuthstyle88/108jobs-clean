import { test, expect } from '@playwright/test';
import { captureConsole } from './utils/console';
import type { CapturedConsole } from './utils/console';
import { enableMockAuth } from './utils/auth';

const LOCALE = process.env.TEST_LOCALE || 'en';

async function fillLoginForm(page: import('@playwright/test').Page, email: string, password: string) {
  // Prefer accessible labels first, then fall back to common attributes or data-testid
  const emailInput = page
    .getByLabel(/^(email|อีเมล|อีเมล์|correo|メール|邮箱)$/i)
    .or(page.locator('[data-testid="login-email"], input[name="email"], input[type="email"], input[placeholder*="email" i]'));

  const passwordInput = page
    .getByLabel(/^(password|รหัสผ่าน|contraseña|パスワード|密码)$/i)
    .or(page.locator('[data-testid="login-password"], input[name="password"], input[type="password"]'));

  await emailInput.fill(email);
  await passwordInput.fill(password);

  const submit = page
    .getByRole('button', { name: /log in|login|เข้าสู่ระบบ|sign in|เข้าสู่บัญชี|ลงชื่อเข้าใช้/i })
    .or(page.locator('[data-testid="login-submit"], button[type="submit"]'));

  await submit.click();
}

let con: CapturedConsole | null = null;

// Before each test, hook console to capture JS errors (ignore known dev network warnings via your config/allowlist if any)
test.beforeEach(async ({ page }) => {
  con = captureConsole(page);
});

test.afterEach(async () => {
  con?.stop();
  con = null;
});

// Mocked login tests (stable without backend)
// If you later want to run against a real backend, remove enableMockAuth and provide TEST_USER_EMAIL/TEST_USER_PASSWORD.

test.describe('Login (mocked)', () => {
  test('logs in successfully and shows authenticated UI', async ({ page }) => {
    await enableMockAuth(page, { success: true });

    await page.goto(`/${LOCALE}/login`);

    const email = process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'Password123!';
    await fillLoginForm(page, email, password);
    // Ensure auth cookie exists for middleware checks (mock environment)

    // Wait until we are no longer on the login page and network settles
    await page.waitForURL(url => !/\/login(\/|$)/.test(new URL(url).pathname), { timeout: 15000 });
    await page.waitForLoadState('networkidle');

    const authenticatedUi = page.locator([
      'button[name="profile"]',
      'button:has(img[alt="avatar"])',
      '[data-testid="user-menu"]',
      '[data-testid="logout-button"]',
      '[data-testid="user-avatar"]',
      'button[aria-haspopup="menu"]',
      'button[aria-label*="profile" i]',
      'button[title*="profile" i]'
    ].join(', ')).first();

    await expect(authenticatedUi).toBeVisible({ timeout: 15000 });

    // Optional: Protected route should not bounce back to login when authenticated
    // await page.goto(`/${LOCALE}/account-setting/work-sample`);
    // await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account-setting/work-sample`));
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await enableMockAuth(page, { success: false });

    await page.goto(`/${LOCALE}/login`);
    await fillLoginForm(page, 'wrong@example.com', 'wrong-password');

    // Adjust this to your real UI. We check for a generic error message.
    const err = page.getByText(/invalid|Incorrect password|failed|unauthorized|เข้าสู่ระบบไม่สำเร็จ/i);
    await expect(err).toBeVisible();
  });
});

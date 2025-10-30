import { test, expect } from '@playwright/test';
import { captureConsole } from './utils/console';

const ALLOW_ERROR_PATTERNS = [
  'ERR_CONNECTION_REFUSED',
  'Failed to load resource',
  'fetchIsoData',
];

function filterAllowedErrors(errors: string[]) {
  return errors.filter((e) => !ALLOW_ERROR_PATTERNS.some((p) => e.includes(p)));
}

test('protected route redirects to login', async ({ page, baseURL }) => {
  const cap = captureConsole(page);
  const root = baseURL ?? 'http://localhost:3001';
  const target = `${root}/en/account-setting/bank-account`;

  const resp = await page.goto(target, { waitUntil: 'domcontentloaded' });
  expect(resp).toBeTruthy();

  // Expect a redirect or navigation to login page
  await page.waitForURL(/\/en\/login\?/, { timeout: 30000 });
  expect(page.url()).toMatch(/\/en\/login\?/);

  const hardErrors = filterAllowedErrors(cap.errors);
  expect(cap.pageErrors, `page errors: \n${cap.pageErrors.join('\n')}`).toHaveLength(0);
  expect(hardErrors, `console errors: \n${hardErrors.join('\n')}`).toHaveLength(0);

  cap.stop();
});

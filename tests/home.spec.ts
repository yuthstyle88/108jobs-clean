import { test, expect } from '@playwright/test';
import { captureConsole } from './utils/console';

// Allow-list substrings for noisy but non-fatal dev warnings
const ALLOW_ERROR_PATTERNS = [
  'ERR_CONNECTION_REFUSED',
  'Failed to load resource',
  'fetchIsoData',
];

function filterAllowedErrors(errors: string[]) {
  return errors.filter((e) => !ALLOW_ERROR_PATTERNS.some((p) => e.includes(p)));
}

test('home page renders without JS errors', async ({ page, baseURL }) => {
  const cap = captureConsole(page);
  const url = baseURL ?? 'http://localhost:3001';

  const resp = await page.goto(url, { waitUntil: 'domcontentloaded' });
  expect(resp?.ok()).toBeTruthy();

  await page.waitForLoadState('networkidle');
  await expect(page.locator('body')).toBeVisible();

  const hardErrors = filterAllowedErrors(cap.errors);
  expect(cap.pageErrors, `page errors: \n${cap.pageErrors.join('\n')}`).toHaveLength(0);
  expect(hardErrors, `console errors: \n${hardErrors.join('\n')}`).toHaveLength(0);

  cap.stop();
});

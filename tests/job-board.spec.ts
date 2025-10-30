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

test('job board page loads and shows basic UI', async ({ page, baseURL }) => {
  const cap = captureConsole(page);
  const root = baseURL ?? 'http://localhost:3001';
  const url = `${root}/en/job-board`;

  const resp = await page.goto(url, { waitUntil: 'domcontentloaded' });
  expect(resp).toBeTruthy();

  await page.waitForLoadState('networkidle');
  await expect(page.locator('body')).toBeVisible();

  // Very loose smoke assertions: page title or a known element renders
  // Try a few potential selectors; don't fail if missing, this is a smoke test
  const possibleSelectors = [
    'h1:has-text("Job")',
    'text=/Job Board/i',
    '[data-testid="job-board-root"]',
  ];
  let found = false;
  for (const sel of possibleSelectors) {
    const loc = page.locator(sel);
    if (await loc.count().catch(() => 0)) {
      if ((await loc.count()) > 0) { found = true; break; }
    }
  }
  expect(found).toBeTruthy();

  const hardErrors = filterAllowedErrors(cap.errors);
  expect(cap.pageErrors, `page errors: \n${cap.pageErrors.join('\n')}`).toHaveLength(0);
  expect(hardErrors, `console errors: \n${hardErrors.join('\n')}`).toHaveLength(0);

  cap.stop();
});

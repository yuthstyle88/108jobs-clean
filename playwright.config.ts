import { defineConfig, devices } from '@playwright/test';

// The port the dev server under test listens on. It is overridable because
// 3001 is not free everywhere: the self-hosted CI runner carries a long-lived
// listener on 127.0.0.1:3001 owned by another user, so the webServer died with
// EADDRINUSE and killing the port did not help — an unprivileged `lsof`/`fuser`
// cannot even see that process, which is why the workflow's "free the port"
// step reported the port idle two seconds before the bind failed. CI picks a
// genuinely free port and passes it in here instead of fighting for this one.
const port = Number(process.env.E2E_PORT ?? 3001);
const baseURL = process.env.E2E_BASE_URL || `http://localhost:${port}`;

// See https://playwright.dev/docs/test-configuration
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: `PORT=${port} __NEXT_EXPERIMENTAL_MCP_SERVER=true npm run dev`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // You can enable more browsers as needed
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});

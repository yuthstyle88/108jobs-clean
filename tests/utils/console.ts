import type { Page, ConsoleMessage } from '@playwright/test';

export type CapturedConsole = {
  errors: string[];
  warnings: string[];
  logs: string[];
  pageErrors: string[];
  stop: () => void;
};

// Collect console output and page errors. We fail tests only on true JS errors, not on network warnings.
export function captureConsole(page: Page): CapturedConsole {
  const errors: string[] = [];
  const warnings: string[] = [];
  const logs: string[] = [];
  const pageErrors: string[] = [];

  const onConsole = (msg: ConsoleMessage) => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      errors.push(text);
    } else if (type === 'warning') {
      warnings.push(text);
    } else {
      logs.push(`[${type}] ${text}`);
    }
  };
  const onPageError = (err: Error) => {
    pageErrors.push(String(err));
  };

  page.on('console', onConsole);
  page.on('pageerror', onPageError);

  return {
    errors,
    warnings,
    logs,
    pageErrors,
    stop: () => {
      page.off('console', onConsole);
      page.off('pageerror', onPageError);
    },
  };
}

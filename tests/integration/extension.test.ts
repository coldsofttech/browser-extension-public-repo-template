import { chromium, type BrowserContext } from 'playwright';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Loads dist/chromium into a real Chromium. The same build is shipped for Chrome and Edge.
// Set CHROMIUM_PATH to use a browser other than the one Playwright installed.
const extensionPath = resolve('dist/chromium');
const pageUrl = 'https://example.com/';

let context: BrowserContext;
let profileDir: string;
let extensionId: string;

beforeAll(async () => {
  profileDir = mkdtempSync(join(tmpdir(), 'extension-profile-'));
  context = await chromium.launchPersistentContext(profileDir, {
    channel: 'chromium', // the new headless mode, which supports extensions
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });
  // Serve the matched page locally so the test needs no network.
  await context.route(pageUrl, (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Test</title><p>Page</p>',
    }),
  );
  const [worker = await context.waitForEvent('serviceworker')] = context.serviceWorkers();
  extensionId = new URL(worker.url()).host;
});

afterAll(async () => {
  await context.close();
  rmSync(profileDir, { recursive: true, force: true });
});

describe('built extension in Chromium', () => {
  it('registers a background service worker', () => {
    expect(extensionId).toMatch(/^[a-p]{32}$/);
  });

  it('shows the banner on a matching page', async () => {
    const page = await context.newPage();
    await page.goto(pageUrl);
    const banner = page.locator('#browser-extension-template-banner .banner');
    await banner.waitFor();
    expect((await banner.textContent())?.trim()).toBeTruthy();
    await page.close();
  });

  it('hides the banner after the popup toggle is switched off', async () => {
    const page = await context.newPage();
    await page.goto(pageUrl);
    const banner = page.locator('#browser-extension-template-banner');
    await banner.waitFor({ state: 'attached' });

    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await popup.locator('#enabled').uncheck();

    await banner.waitFor({ state: 'detached' });
    await popup.close();
    await page.close();
  });

  it('saves the banner message from the options page', async () => {
    const options = await context.newPage();
    await options.goto(`chrome-extension://${extensionId}/options.html`);
    await options.locator('#message').fill('Custom message');
    await options.locator('button[type=submit]').click();
    await options.locator('#status:has-text("Saved")').waitFor();
    await options.close();
  });
});

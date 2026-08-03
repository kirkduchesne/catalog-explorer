const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 950 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const base = process.env.CATALOG_URL || 'http://127.0.0.1:8605';
  await page.goto(base);
  await page
    .getByRole('button', { name: 'Save to reading list', exact: true })
    .first()
    .click();
  await page
    .getByRole('button', { name: 'Save to reading list', exact: true })
    .first()
    .click();
  await page
    .getByRole('link', { name: 'Reading list (2)', exact: true })
    .click();
  await page.waitForFunction(
    () =>
      document.querySelectorAll('section[aria-label="Saved references"] li')
        .length === 2,
  );
  await page.reload();
  await page.waitForFunction(
    () =>
      document.querySelectorAll('section[aria-label="Saved references"] li')
        .length === 2,
  );
  await page
    .getByRole('button', { name: 'Mark read', exact: true })
    .first()
    .click();
  await page.getByLabel(/Reading status/).selectOption('read');
  assert.equal(
    await page.locator('section[aria-label="Saved references"] li').count(),
    1,
  );
  const download = page.waitForEvent('download');
  await page
    .getByRole('button', { name: 'Download visible references' })
    .click();
  const file = await download;
  const stream = await file.createReadStream();
  let raw = '';
  for await (const part of stream) raw += part;
  assert.equal(JSON.parse(raw).entries.length, 1);
  await page.getByRole('button', { name: 'Reset reading filters' }).click();
  await page
    .getByLabel('Search saved titles or topics')
    .evaluate(
      (el) =>
        new Promise((resolve) =>
          requestAnimationFrame(() => resolve(el === document.activeElement)),
        ),
    )
    .then((value) => assert.equal(value, true));
  const backup = JSON.stringify({
    version: 1,
    entries: [{ id: 3, read: false, savedAt: '2026-01-01T00:00:00.000Z' }],
  });
  await page.getByLabel('Paste reading-list backup').fill(backup);
  await page.getByRole('button', { name: 'Preview backup' }).click();
  await page.getByRole('button', { name: 'Cancel import' }).click();
  await page.waitForFunction(
    () =>
      document.querySelectorAll('section[aria-label="Saved references"] li')
        .length === 2,
  );
  await page.getByRole('button', { name: 'Preview backup' }).click();
  await page.getByLabel('Paste reading-list backup').fill(backup + ' ');
  assert.equal(
    await page.getByRole('button', { name: 'Confirm merge' }).count(),
    0,
  );
  await page.getByRole('button', { name: 'Preview backup' }).click();
  await page
    .getByRole('button', { name: 'Mark read', exact: true })
    .first()
    .click();
  await page.getByRole('button', { name: 'Confirm merge' }).click();
  assert.equal(
    await page.locator('section[aria-label="Saved references"] li').count(),
    3,
  );
  assert.equal(
    await page
      .getByRole('button', { name: 'Mark unread', exact: true })
      .count(),
    2,
  );
  await page.getByLabel('Paste reading-list backup').fill('{bad');
  await page.getByRole('button', { name: 'Preview backup' }).click();
  assert(
    await page
      .getByText('Invalid backup. No saved data was changed.')
      .isVisible(),
  );
  await page
    .getByRole('link', { name: 'Open next unread reference', exact: true })
    .click();
  assert.equal(
    await page
      .getByRole('link', { name: 'Back to results' })
      .getAttribute('href'),
    '/reading-list',
  );
  await page.getByRole('button', { name: 'Mark read', exact: true }).click();
  await page.getByRole('link', { name: 'Back to results' }).click();
  await page.getByRole('button', { name: 'Clear read references' }).click();
  await page.getByRole('button', { name: 'Cancel clear' }).click();
  assert.equal(
    await page.locator('section[aria-label="Saved references"] li').count(),
    3,
  );
  // Another tab changes storage while the first tab has a reviewed import.
  await page.getByLabel('Paste reading-list backup').fill(backup);
  await page.getByRole('button', { name: 'Preview backup' }).click();
  const other = await context.newPage();
  await other.goto(base);
  await other.evaluate(() =>
    localStorage.setItem(
      'catalog-reading-list-v1',
      JSON.stringify({ version: 1, entries: [] }),
    ),
  );
  await page.getByRole('button', { name: 'Reload saved list' }).waitFor();
  assert(
    await page.getByRole('button', { name: 'Confirm merge' }).isDisabled(),
  );
  await page.getByRole('button', { name: 'Reload saved list' }).click();
  await page.getByRole('button', { name: 'Confirm merge' }).click();
  assert.equal(
    await page.locator('section[aria-label="Saved references"] li').count(),
    1,
  );
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByLabel('Search saved titles or topics').fill('😀'.repeat(100));
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.getByRole('button', { name: 'Reset reading filters' }).click();
  await page.getByRole('button', { name: /^Remove / }).click();
  await page
    .getByLabel('Search saved titles or topics')
    .evaluate(
      (el) =>
        new Promise((resolve) =>
          requestAnimationFrame(() => resolve(el === document.activeElement)),
        ),
    )
    .then((value) => assert.equal(value, true));
  await page.evaluate(() =>
    localStorage.setItem('catalog-reading-list-v1', '{corrupt'),
  );
  await page.reload();
  await page.getByRole('button', { name: 'Reload saved list' }).waitFor();
  assert.equal(
    await page.evaluate(() => localStorage.getItem('catalog-reading-list-v1')),
    '{corrupt',
  );
  const blocked = await browser.newContext();
  await blocked.addInitScript(() =>
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('blocked', 'SecurityError');
      },
    }),
  );
  const unavailable = await blocked.newPage();
  await unavailable.goto(base + '/reading-list');
  await unavailable
    .getByRole('button', { name: 'Reload saved list' })
    .waitFor();
  assert.equal(
    await unavailable
      .getByRole('button', { name: 'Download all saved references' })
      .isDisabled(),
    true,
  );
  assert.deepEqual(errors, []);
  await browser.close();
  console.log(
    'PASS reading save/reload/read/filter/export/import cancel/input invalidation/current-state merge/stale tab/recovery/mobile/focus/corrupt and blocked storage',
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

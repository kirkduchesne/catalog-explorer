const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 1000 },
  });
  await page.goto(
    (process.env.CATALOG_URL || 'http://127.0.0.1:8605') +
      '/?category=JavaScript&sort=title',
  );
  await page
    .getByRole('button', { name: 'Save to reading list', exact: true })
    .first()
    .waitFor();
  await page.screenshot({ path: '/tmp/catalog26-preview.png', fullPage: true });
  await page
    .getByRole('button', { name: 'Save to reading list', exact: true })
    .first()
    .click();
  await page
    .getByRole('button', { name: 'Save to reading list', exact: true })
    .first()
    .click();
  await page.getByRole('link', { name: 'Reading list (2)' }).click();
  await page
    .getByRole('button', { name: 'Mark read', exact: true })
    .first()
    .waitFor();
  await page.screenshot({
    path: '/tmp/catalog26-reading-list.png',
    fullPage: true,
  });
  await page.getByLabel(/Reading status/).selectOption('unread');
  await page
    .getByRole('button', { name: 'Mark read', exact: true })
    .first()
    .focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(
    () =>
      document.activeElement?.tagName === 'A' &&
      document.activeElement?.closest('li'),
  );
  await page.getByRole('button', { name: 'Clear read references' }).click();
  await page.getByRole('button', { name: 'Confirm clear read' }).focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.activeElement?.tagName === 'INPUT');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({
    path: '/tmp/catalog26-reading-mobile.png',
    fullPage: true,
  });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await browser.close();
  console.log(
    'PASS filtered read-toggle focus, clear-confirm keyboard focus,375px layout and actual screenshots',
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

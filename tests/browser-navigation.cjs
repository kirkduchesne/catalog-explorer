const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    const base = process.env.CATALOG_URL || 'http://127.0.0.1:8605';
    await page.goto(base);
    await page.evaluate(() =>
      localStorage.setItem(
        'catalog-reading-list-v1',
        JSON.stringify({
          version: 1,
          entries: [1, 2, 3].map((id) => ({
            id,
            read: false,
            savedAt: '2026-01-01T00:00:00.000Z',
          })),
        }),
      ),
    );
    await page.goto(base + '/notes/1');
    for (const id of [2, 3, 1]) {
      await page
        .getByRole('link', { name: 'Next unread saved reference', exact: true })
        .click();
      await page.waitForURL((url) => url.pathname === '/notes/' + id);
      assert.equal(new URL(page.url()).pathname, '/notes/' + id);
    }
    assert.equal(
      await page.evaluate(
        () =>
          JSON.parse(
            localStorage.getItem('catalog-reading-list-v1'),
          ).entries.filter((entry) => entry.read).length,
      ),
      0,
    );
    console.log(
      'PASS three unread details advance 1→2→3→1 without changing reading state',
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

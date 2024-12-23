// Run against the built app with Playwright available outside project dependencies.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    const base = process.env.CATALOG_TEST_URL || 'http://localhost:3000';
    const query = '😀'.repeat(100);
    await page.goto(base + '/?q=' + encodeURIComponent(query));
    assert.equal(await page.getByLabel('Search notes').inputValue(), query);
    await page.goto(base);
    const input = page.getByLabel('Search notes');
    assert.equal(await input.getAttribute('maxlength'), null);
    await input.focus();
    await page.keyboard.insertText(query);
    assert.equal(await input.inputValue(), query);
    await page.getByRole('button', { name: 'Apply filters' }).click();
    assert.equal(new URL(page.url()).searchParams.get('q'), query);
    assert.equal(await page.getByLabel('Search notes').inputValue(), query);
    await page.getByLabel('Search notes').fill(query + 'extra');
    await page.getByRole('button', { name: 'Apply filters' }).click();
    assert.equal(await page.getByLabel('Search notes').inputValue(), query);
    console.log('PASS 100 non-BMP characters through direct URL and no-JavaScript form; server truncates over-limit search');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

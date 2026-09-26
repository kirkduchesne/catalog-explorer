const base = process.env.CATALOG_URL || 'http://127.0.0.1:8605';
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  await page.goto(base);
  await page.getByLabel('Search notes', { exact: true }).fill('files close');
  await page.getByLabel('Match', { exact: true }).selectOption('words');
  await page.getByLabel('Topic', { exact: true }).selectOption('Python');
  await page.getByLabel('Level', { exact: true }).selectOption('Intermediate');
  await page.getByLabel('Notes per page', { exact: true }).selectOption('12');
  await page.getByRole('button', { name: 'Apply filters' }).click();
  assert.equal(await page.locator('ul > li').count(), 1);
  assert(page.url().endsWith('#results'));
  assert(
    (await page.locator('meta[name=robots]').getAttribute('content')).includes(
      'noindex',
    ),
  );
  await page
    .getByRole('link', { name: 'Context managers', exact: true })
    .click();
  const back = await page
    .getByRole('link', { name: 'Back to results', exact: true })
    .getAttribute('href');
  assert(
    back.includes('mode=words') &&
      back.includes('category=Python') &&
      back.includes('size=12'),
  );
  await page
    .getByRole('link', { name: 'Next: CSV reading', exact: true })
    .click();
  assert(
    (
      await page
        .getByRole('link', { name: 'Back to results' })
        .getAttribute('href')
    ).includes('q=files+close'),
  );
  await page.getByRole('link', { name: 'Back to results' }).click();
  await page
    .getByRole('link', { name: 'Remove topic: Python', exact: true })
    .click();
  assert.equal(
    await page.getByLabel('Topic', { exact: true }).inputValue(),
    '',
  );
  assert.equal(
    await page.getByLabel('Match', { exact: true }).inputValue(),
    'words',
  );
  await page
    .getByRole('link', { name: 'Clear search only', exact: true })
    .click();
  assert.equal(
    await page.getByLabel('Level', { exact: true }).inputValue(),
    'Intermediate',
  );
  await page.goto(base + '/?size=12&sort=title-desc&page=99');
  assert.equal(await page.locator('ul > li').count(), 12);
  assert(
    (await page.locator('#results').textContent()).includes('Showing 13–24'),
  );
  assert(
    (await page.locator('main').textContent()).includes(
      'outside these results',
    ),
  );
  await page
    .getByRole('link', { name: 'Previous result page', exact: true })
    .click();
  assert(
    page.url().includes('size=12') && page.url().includes('sort=title-desc'),
  );
  await page.goto(base + '/?q=' + encodeURIComponent('😀'.repeat(100)));
  assert.equal(
    Array.from(
      await page.getByLabel('Search notes', { exact: true }).inputValue(),
    ).length,
    100,
  );
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page
    .getByRole('link', { name: 'Try without the search text', exact: true })
    .click();
  assert.equal(await page.locator('ul > li').count(), 6);
  await page.goto(
    base + '/?q=a&q=b&category=invalid&mode=invalid&size=100&page=-9',
  );
  assert.equal(await page.locator('ul > li').count(), 6);
  for (let id = 1; id <= 24; id++) {
    const response = await page.goto(
      base + '/notes/' + id + '?back=https://example.com',
    );
    assert.equal(response.status(), 200);
    assert.equal(
      await page
        .getByRole('link', { name: 'Back to results' })
        .getAttribute('href'),
      '/',
    );
    assert((await page.title()).includes('Catalog Explorer'));
  }
  for (const path of ['/notes/0', '/notes/01', '/notes/25', '/notes/nope'])
    assert.equal((await page.goto(base + '' + path)).status(), 404);
  await page.goto(base + '/?category=JavaScript&sort=title');
  await page.screenshot({ path: '/tmp/catalog26-mobile.png', fullPage: true });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.goto(base + '/');
  await page.keyboard.press('Tab');
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent),
    'Skip to content',
  );
  await page.keyboard.press('Enter');
  assert(page.url().endsWith('#main-content'));
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto(base + '/?category=JavaScript&sort=title');
  await page.screenshot({
    path: '/tmp/catalog26-catalog-preview.png',
    fullPage: true,
  });
  await browser.close();
  console.log(
    'PASS noJS composed filters, GET anchor, metadata, contextual reading, clearcontrols, clamp/sizes/sort,100emoji mobile,malformedURLs,24details,404,skipkeyboard',
  );
})();

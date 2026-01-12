const assert = require('node:assert/strict');
const {
  detailUrl,
  safeReturn,
} = require(process.env.CATALOG_TEST_LIB + '/navigation.js');
assert.equal(
  detailUrl(1, '/?q=a&category=CSS'),
  '/notes/1?back=%2F%3Fq%3Da%26category%3DCSS'
);
for (const back of [
  'https://example.com',
  '//example.com',
  '/notes/1',
  '/?q=x#fragment',
  undefined,
  ['/?q=a'],
])
  assert.equal(safeReturn(back), '/');

assert.equal(
  safeReturn('/?category=CSS&sort=title&page=99'),
  '/?category=CSS&sort=title&page=1'
);
assert.equal(safeReturn('/?q=a&q=b'), '/?page=1');

assert.equal(
  safeReturn('/?q=' + encodeURIComponent('😀'.repeat(100))),
  '/?q=' + encodeURIComponent('😀'.repeat(100)) + '&page=1'
);
assert.equal(safeReturn('/?page=999999&size=12'), '/?size=12&page=2');
assert.equal(safeReturn('/?q=' + 'a'.repeat(5000)), '/');
assert.equal(safeReturn('/?back=https://example.com'), '/?page=1');

const assert=require('node:assert/strict');
const {detailUrl,safeReturn}=require('/tmp/catalog-explorer-2025-tests/navigation.js');
assert.equal(detailUrl(1,'/?q=a&category=CSS'),'/notes/1?back=%2F%3Fq%3Da%26category%3DCSS');
for(const back of ['https://example.com','//example.com','/notes/1','/?q=x#fragment',undefined,['/?q=a']])assert.equal(safeReturn(back),'/');

assert.equal(safeReturn('/?category=CSS&sort=title&page=99'),'/?category=CSS&sort=title&page=1');
assert.equal(safeReturn('/?q=a&q=b'),'/?page=1');

const assert = require('node:assert/strict');
const { readQuery, results, pageUrl } = require('/tmp/catalog-explorer-tests/query.js');
assert.equal(results({}).count, 24);
assert.equal(results({}).entries.length, 6);
assert.equal(results({ category: 'Python', level: 'Beginner' }).count, 3);
assert.equal(results({ q: 'FILES', category: 'Python' }).count, 1);
assert.equal(results({ q: 'zzzz-not-a-topic' }).count, 0);
assert.equal(results({ page: '999' }).query.page, 4);
for (const page of ['-1', '1.5', '0', '1e3', '9999999']) assert.equal(readQuery({ page }).page, 1);
assert.equal(readQuery({ category: 'bad', level: 'bad' }).category, '');
assert.equal(readQuery({ q: ['one', 'two'] }).q, '');
assert.equal(readQuery({ q: 'x'.repeat(200) }).q.length, 100);
assert.equal(
  pageUrl({ q: 'a & b', category: 'CSS', level: 'Beginner', page: 1, sort: 'default' }, 2),
  '/?q=a+%26+b&category=CSS&level=Beginner&page=2'
);
console.log('PASS query validation, combined filters, bounds, pagination and URL encoding');
assert.deepEqual(
  results({ category: 'Python', level: 'Beginner', page: '50' }).entries.map((e) => e.id),
  [19, 21, 24]
);
assert.equal(results({ q: 'zzzz', page: '50' }).query.page, 1);
assert.equal(results({ q: '  files  ' }).query.q, 'files');
assert.equal(readQuery({ page: ['1', '2'] }).page, 1);

assert.equal(readQuery({ q: '  ＦＩＬＥＳ  ' }).q, 'FILES');
assert.equal(results({ q: 'ＦＩＬＥＳ' }).count, 1);
assert.equal(readQuery({ q: 'event   listeners' }).q, 'event listeners');
assert.equal(Array.from(readQuery({ q: '😀'.repeat(101) }).q).length, 100);
assert.equal(readQuery({ sort: ['title', 'topic'] }).sort, 'default');
assert.equal(readQuery({ sort: 'unknown' }).sort, 'default');

assert.equal(results({ category: 'Python', level: 'Beginner' }).facets.categories.Python, 3);
assert.equal(results({ category: 'Python', level: 'Beginner' }).facets.levels.Intermediate, 3);
assert.equal(results({ q: 'files', category: 'CSS' }).facets.categories.Python, 1);
assert.equal(results({ q: 'files', category: 'CSS' }).count, 0);
const alphabetical = results({ sort: 'title' });
assert.equal(alphabetical.entries[0].title, 'Argument parsing');
assert.equal(results({ sort: 'title', page: '2' }).entries.length, 6);
assert.ok(pageUrl(readQuery({ q: 'a & b', sort: 'title' }), 2).includes('sort=title'));
assert.deepEqual(results({}).entries.map((entry) => entry.id), [1, 2, 3, 4, 5, 6]);
for (const value of ['Infinity', 'NaN', '1e2', '999999999999']) assert.equal(readQuery({ page: value }).page, 1);
console.log('PASS contextual facets, unicode, ordering and direct URL edge cases');

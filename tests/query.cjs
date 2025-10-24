const assert = require('node:assert/strict');
const {
  readQuery,
  results,
  pageUrl,
} = require('/tmp/catalog-explorer-2025-tests/query.js');
assert.equal(results({}).count, 24);
assert.equal(results({}).entries.length, 6);
assert.equal(results({ category: 'Python', level: 'Beginner' }).count, 3);
assert.equal(results({ q: 'FILES', category: 'Python' }).count, 1);
assert.equal(results({ q: 'zzzz-not-a-topic' }).count, 0);
assert.equal(results({ page: '999' }).query.page, 4);
for (const page of ['-1', '1.5', '0', '1e3', '9999999'])
  assert.equal(readQuery({ page }).page, 1);
assert.equal(readQuery({ category: 'bad', level: 'bad' }).category, '');
assert.equal(readQuery({ q: ['one', 'two'] }).q, '');
assert.equal(readQuery({ q: 'x'.repeat(200) }).q.length, 100);
assert.equal(
  pageUrl(
    {
      q: 'a & b',
      category: 'CSS',
      level: 'Beginner',
      page: 1,
      sort: 'default',
    },
    2
  ),
  '/?q=a+%26+b&category=CSS&level=Beginner&page=2'
);
console.log(
  'PASS query validation, combined filters, bounds, pagination and URL encoding'
);
assert.deepEqual(
  results({ category: 'Python', level: 'Beginner', page: '50' }).entries.map(
    (e) => e.id
  ),
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

assert.equal(
  results({ category: 'Python', level: 'Beginner' }).facets.categories.Python,
  3
);
assert.equal(
  results({ category: 'Python', level: 'Beginner' }).facets.levels.Intermediate,
  3
);
assert.equal(
  results({ q: 'files', category: 'CSS' }).facets.categories.Python,
  1
);
assert.equal(results({ q: 'files', category: 'CSS' }).count, 0);
const alphabetical = results({ sort: 'title' });
assert.equal(alphabetical.entries[0].title, 'Argument parsing');
assert.equal(results({ sort: 'title', page: '2' }).entries.length, 6);
assert.ok(
  pageUrl(readQuery({ q: 'a & b', sort: 'title' }), 2).includes('sort=title')
);
assert.deepEqual(
  results({}).entries.map((entry) => entry.id),
  [1, 2, 3, 4, 5, 6]
);
for (const value of ['Infinity', 'NaN', '1e2', '999999999999'])
  assert.equal(readQuery({ page: value }).page, 1);
console.log(
  'PASS contextual facets, unicode, ordering and direct URL edge cases'
);

const nonBmpQuery = '😀'.repeat(100);
assert.equal(readQuery({ q: nonBmpQuery }).q, nonBmpQuery);
assert.equal(readQuery({ q: nonBmpQuery + 'a' }).q, nonBmpQuery);
assert.equal(
  new URL(
    pageUrl(readQuery({ q: nonBmpQuery }), 1),
    'https://example.test'
  ).searchParams.get('q'),
  nonBmpQuery
);

assert.equal(results({ q: 'files close', mode: 'words' }).count, 1);
assert.equal(results({ q: 'files close' }).count, 0);
assert.equal(readQuery({ mode: ['words', 'phrase'] }).mode, 'phrase');

assert.ok(pageUrl(readQuery({ mode: 'words' }), 2).includes('mode=words'));

assert.equal(readQuery({ mode: 'invalid' }).mode, 'phrase');
assert.equal(
  results({ q: 'files close', mode: 'words', page: '20' }).query.page,
  1
);

assert.equal(results({ sort: 'title-desc' }).entries[0].title, 'Visible focus');

assert.equal(results({ size: '12' }).entries.length, 12);
assert.equal(results({ size: '12' }).pages, 2);
assert.equal(readQuery({ size: '100' }).size, 6);

assert.equal(results({ page: '99' }).start, 19);
assert.equal(results({ q: 'zzzz' }).start, 0);
assert.equal(results({ page: '99' }).pageAdjusted, true);

const composed = readQuery({
  q: 'files',
  mode: 'words',
  size: '12',
  sort: 'title-desc',
  category: 'Python',
  level: 'Intermediate',
});
const kept = pageUrl({ ...composed, q: '' }, 1);
assert.ok(
  kept.includes('category=Python') &&
    kept.includes('size=12') &&
    kept.includes('mode=words')
);
assert.equal(
  results({
    q: 'close files',
    mode: 'words',
    category: 'Python',
    level: 'Intermediate',
    size: '12',
  }).count,
  1
);
assert.equal(
  results({ q: 'close files', mode: 'words', category: 'CSS' }).count,
  0
);

assert.equal(results({ q: 'nonexistent' }).facets.categories.HTML, 0);
assert.equal(results({ q: 'ＦＩＬＥＳ' }).count, 1);
assert.equal(Array.from(readQuery({ q: '😀'.repeat(100) }).q).length, 100);
assert.equal(readQuery({ category: ['HTML', 'CSS'] }).category, '');
assert.equal(
  results({ q: 'files', level: 'Beginner' }).facets.levels.Intermediate,
  1
);

const source = require('/tmp/catalog-explorer-2025-tests/catalog.js').catalog;
const original = JSON.stringify(source);
const forward = results({ sort: 'title', size: '12' }).entries.map(
  (x) => x.title
);
const reverse = results({ sort: 'title-desc', size: '12' }).entries.map(
  (x) => x.title
);
assert.notDeepEqual(forward, reverse);
assert.equal(JSON.stringify(source), original);
assert.deepEqual(results({ sort: 'title' }), results({ sort: 'title' }));

for (const category of ['', 'HTML', 'CSS', 'JavaScript', 'Python'])
  for (const level of ['', 'Beginner', 'Intermediate'])
    for (const mode of ['phrase', 'words'])
      for (const size of ['6', '12']) {
        const r = results({ category, level, mode, size, page: '999' });
        assert.ok(r.entries.length <= Number(size));
        assert.ok(r.query.page <= r.pages);
        assert.ok(
          r.entries.every(
            (e) =>
              (!category || e.category === category) &&
              (!level || e.level === level)
          )
        );
        assert.equal(
          Object.values(r.facets.categories).reduce((a, b) => a + b, 0),
          results({ level, mode, size }).count
        );
      }

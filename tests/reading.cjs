const assert = require('node:assert/strict');
const reading = require(process.env.CATALOG_TEST_LIB + '/reading-list.js');
const allowed = Array.from({ length: 24 }, (_, i) => i + 1);
const entry = { id: 1, read: false, savedAt: '2026-01-27T15:00:00.000Z' };
assert.deepEqual(reading.parseReadingList(null, allowed), []);
assert.deepEqual(
  reading.parseReadingList(
    reading.serializeReadingList([entry], allowed),
    allowed,
  ),
  [entry],
);
for (const entries of [
  [entry, entry],
  [{ ...entry, id: 25 }],
  [{ ...entry, read: 'yes' }],
  [{ ...entry, savedAt: '2026-02-30T15:00:00.000Z' }],
])
  assert.throws(() => reading.serializeReadingList(entries, allowed));
assert.throws(() => reading.parseReadingList('{bad', allowed));
assert.throws(() =>
  reading.parseReadingList(
    JSON.stringify({ version: 2, entries: [] }),
    allowed,
  ),
);

const storageFns = require(
  process.env.CATALOG_TEST_LIB + '/reading-storage.js',
);
let stored = null;
const store = {
  getItem: () => stored,
  setItem: (key, value) => {
    stored = value;
  },
};
const loaded = storageFns.loadReadingList(store, allowed);
const saved = storageFns.persistReadingList(
  store,
  [entry],
  loaded.raw,
  allowed,
);
assert.equal(stored, saved);
assert.throws(
  () => storageFns.persistReadingList(store, [], null, allowed),
  /another tab/,
);
assert.equal(stored, saved);
assert.throws(() =>
  storageFns.persistReadingList(
    {
      getItem: () => null,
      setItem: () => {
        throw Error('blocked');
      },
    },
    [entry],
    null,
    allowed,
  ),
);

const actions = require(process.env.CATALOG_TEST_LIB + '/reading-actions.js');
assert.equal(actions.saveReference([entry], 1, entry.savedAt).length, 1);
assert.equal(actions.removeReference([entry], 1).length, 0);
assert.equal(actions.setRead([entry], 1, true)[0].read, true);
assert.equal(entry.read, false);

const navigation = require(process.env.CATALOG_TEST_LIB + '/navigation.js');
assert.equal(navigation.safeReturn('/reading-list'), '/reading-list');
assert.equal(navigation.safeReturn('/reading-list/evil'), '/');

const readingQuery = require(
  process.env.CATALOG_TEST_LIB + '/reading-query.js',
);
assert.equal(readingQuery.filterReading([entry], 'read').length, 0);
assert.equal(readingQuery.filterReading([entry], 'unread').length, 1);

assert.equal(
  readingQuery.filterReading([entry], 'all', 'missing reference').length,
  0,
);
assert.equal(readingQuery.filterReading([entry], 'all', ' HTML ').length, 1);

const sortReading = require(
  process.env.CATALOG_TEST_LIB + '/reading-sort.js',
).sortReading;
assert.equal(
  sortReading(
    [entry, { ...entry, id: 2, savedAt: '2026-05-01T00:00:00.000Z' }],
    'saved',
  )[0].id,
  2,
);

const backup = require(process.env.CATALOG_TEST_LIB + '/reading-backup.js');
assert.equal(
  backup.previewBackup(
    reading.serializeReadingList([entry], allowed),
    [entry],
    allowed,
  ).existing,
  1,
);
assert.deepEqual(
  backup.mergeBackup([{ ...entry, read: true }], [entry], allowed),
  [{ ...entry, read: true }],
);

const previewed = backup.previewBackup(
  reading.serializeReadingList([entry], allowed),
  [],
  allowed,
);
const sameTab = [
  { ...entry, read: true },
  { ...entry, id: 2 },
];
assert.deepEqual(
  backup.mergeBackup(sameTab, previewed.entries, allowed),
  sameTab,
);

const full = allowed.map((id) => ({ ...entry, id, read: id % 2 === 0 }));
assert.deepEqual(
  reading.parseReadingList(
    reading.serializeReadingList(full, allowed),
    allowed,
  ),
  full,
);
assert.throws(() =>
  reading.parseReadingList(' '.repeat(reading.backupLimit + 1), allowed),
);
for (const raw of [
  'null',
  '[]',
  '{}',
  JSON.stringify({ version: 1, entries: [{ ...entry, savedAt: 'invalid' }] }),
])
  assert.throws(() => backup.previewBackup(raw, [], allowed));
assert.equal(backup.mergeBackup(full, full, allowed).length, 24);

assert.equal(
  reading.parseReadingList(
    reading.serializeReadingList(
      readingQuery.filterReading(full, 'read'),
      allowed,
    ),
    allowed,
  ).length,
  12,
);

const unchanged = stored;
assert.throws(
  () =>
    storageFns.persistReadingList(
      {
        getItem: () => stored,
        setItem: () => {
          throw Error('quota');
        },
      },
      [],
      stored,
      allowed,
    ),
  /quota/,
);
assert.equal(stored, unchanged);
assert.throws(() =>
  storageFns.loadReadingList(
    { getItem: () => '{broken', setItem: () => assert.fail('must not write') },
    allowed,
  ),
);
assert.throws(
  () =>
    storageFns.loadReadingList(
      {
        getItem: () => {
          throw Error('blocked');
        },
        setItem: () => {},
      },
      allowed,
    ),
  /blocked/,
);

const nextUnread = require(
  process.env.CATALOG_TEST_LIB + '/reading-next.js',
).nextUnread;
assert.equal(nextUnread([{ ...entry, read: true }]), undefined);
assert.equal(nextUnread([entry, { ...entry, id: 2 }], 1), 2);

for (const value of [
  '//evil.example',
  'https://evil.example',
  '/reading-list?next=//evil',
  '/reading-list#fragment',
  ['/reading-list'],
  '/?q=x#fragment',
])
  assert.equal(navigation.safeReturn(value), '/');
assert.match(
  navigation.detailUrl(1, '/reading-list'),
  /^\/notes\/1\?back=%2Freading-list$/,
);

const stalePreview = backup.previewBackup(
  reading.serializeReadingList([{ ...entry, id: 3 }], allowed),
  [entry],
  allowed,
);
let currentRaw = reading.serializeReadingList([entry], allowed);
const expectedRaw = currentRaw;
currentRaw = reading.serializeReadingList([{ ...entry, read: true }], allowed);
assert.throws(
  () =>
    storageFns.persistReadingList(
      { getItem: () => currentRaw, setItem: () => assert.fail('stale write') },
      backup.mergeBackup([entry], stalePreview.entries, allowed),
      expectedRaw,
      allowed,
    ),
  /another tab/,
);

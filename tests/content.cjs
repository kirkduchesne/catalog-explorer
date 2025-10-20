const assert = require('node:assert/strict');
const { validateCatalog } = require('/tmp/catalog-explorer-2025-tests/content-validation.js');
const { catalog, categories, levels } = require('/tmp/catalog-explorer-2025-tests/catalog.js');
assert.doesNotThrow(() => validateCatalog(catalog, categories, levels));
for (const bad of [[catalog[0], catalog[0]], [{...catalog[0], id:0}], [{...catalog[0], category:'Unknown'}], [{...catalog[0], level:'Expert'}], [{...catalog[0], summary:' '}]]) assert.throws(() => validateCatalog(bad,categories,levels));

assert.equal(catalog.length,24);
for(const entry of catalog){assert.match(String(entry.id),/^[1-9][0-9]*$/);assert.ok(categories.includes(entry.category)&&levels.includes(entry.level));assert.ok(entry.title.length<100&&entry.summary.length<500);}

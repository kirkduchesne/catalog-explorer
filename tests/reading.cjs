const assert=require('node:assert/strict');
const reading=require(process.env.CATALOG_TEST_LIB+'/reading-list.js');
const allowed=Array.from({length:24},(_,i)=>i+1);
const entry={id:1,read:false,savedAt:'2026-01-27T15:00:00.000Z'};
assert.deepEqual(reading.parseReadingList(null,allowed),[]);
assert.deepEqual(reading.parseReadingList(reading.serializeReadingList([entry],allowed),allowed),[entry]);
for(const entries of [[entry,entry],[{...entry,id:25}],[{...entry,read:'yes'}],[{...entry,savedAt:'2026-02-30T15:00:00.000Z'}]])assert.throws(()=>reading.serializeReadingList(entries,allowed));
assert.throws(()=>reading.parseReadingList('{bad',allowed));
assert.throws(()=>reading.parseReadingList(JSON.stringify({version:2,entries:[]}),allowed));

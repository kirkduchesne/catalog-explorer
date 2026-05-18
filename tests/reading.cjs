const assert=require('node:assert/strict');
const reading=require(process.env.CATALOG_TEST_LIB+'/reading-list.js');
const allowed=Array.from({length:24},(_,i)=>i+1);
const entry={id:1,read:false,savedAt:'2026-01-27T15:00:00.000Z'};
assert.deepEqual(reading.parseReadingList(null,allowed),[]);
assert.deepEqual(reading.parseReadingList(reading.serializeReadingList([entry],allowed),allowed),[entry]);
for(const entries of [[entry,entry],[{...entry,id:25}],[{...entry,read:'yes'}],[{...entry,savedAt:'2026-02-30T15:00:00.000Z'}]])assert.throws(()=>reading.serializeReadingList(entries,allowed));
assert.throws(()=>reading.parseReadingList('{bad',allowed));
assert.throws(()=>reading.parseReadingList(JSON.stringify({version:2,entries:[]}),allowed));

const storageFns=require(process.env.CATALOG_TEST_LIB+'/reading-storage.js');
let stored=null;const store={getItem:()=>stored,setItem:(key,value)=>{stored=value;}};
const loaded=storageFns.loadReadingList(store,allowed);const saved=storageFns.persistReadingList(store,[entry],loaded.raw,allowed);assert.equal(stored,saved);assert.throws(()=>storageFns.persistReadingList(store,[],null,allowed),/another tab/);assert.equal(stored,saved);
assert.throws(()=>storageFns.persistReadingList({getItem:()=>null,setItem:()=>{throw Error('blocked')}},[entry],null,allowed));

const actions=require(process.env.CATALOG_TEST_LIB+'/reading-actions.js');
assert.equal(actions.saveReference([entry],1,entry.savedAt).length,1);assert.equal(actions.removeReference([entry],1).length,0);assert.equal(actions.setRead([entry],1,true)[0].read,true);assert.equal(entry.read,false);

const navigation=require(process.env.CATALOG_TEST_LIB+'/navigation.js');assert.equal(navigation.safeReturn('/reading-list'),'/reading-list');assert.equal(navigation.safeReturn('/reading-list/evil'),'/');

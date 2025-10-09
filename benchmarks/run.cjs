const {performance} = require('node:perf_hooks');
const assert = require('node:assert/strict');
const os = require('node:os');
const baseline = require('/tmp/catalog-explorer-2025-benchmark/benchmarks/baseline-query.js');
const current = require('/tmp/catalog-explorer-2025-benchmark/lib/query.js');
const cases = [{},{category:'CSS'},{level:'Beginner'},{q:'files'},{q:'close files',mode:'words'},{sort:'title'},{sort:'title-desc',size:'12'},{category:'Python',level:'Intermediate',page:'3'}];
for (const input of cases) assert.deepEqual(current.results(input),baseline.results(input));
function measure(engine, loops) {
  const start = performance.now();
  let consumed = 0;
  for (let n=0;n<loops;n++) for (const input of cases) consumed += engine.results(input).count;
  if (!consumed) throw new Error('Benchmark did not consume results.');
  return performance.now()-start;
}
measure(baseline,100);measure(current,100);
const before=[],after=[];
for(let round=0;round<9;round++) {
  if(round%2) {after.push(measure(current,200));before.push(measure(baseline,200));}
  else {before.push(measure(baseline,200));after.push(measure(current,200));}
}
function median(values){return [...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];}
const result={runtime:process.version,cpu:os.cpus()[0].model,records:24,cases:cases.length,rounds:9,evaluationsPerRound:cases.length*200,baselineMedianMs:median(before),currentMedianMs:median(after),baselineRoundsMs:before,currentRoundsMs:after};
result.changePercent=(1-result.currentMedianMs/result.baselineMedianMs)*100;
console.log(JSON.stringify(result,null,2));

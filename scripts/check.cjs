const { mkdtempSync, readdirSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { execFileSync } = require('node:child_process');
const output = mkdtempSync(join(tmpdir(), 'catalog-check-'));
const benchmark = process.argv[2] === 'benchmark';
try {
  const files = readdirSync('lib').filter(name => name.endsWith('.ts')).map(name => 'lib/' + name);
  if (benchmark) files.push(...readdirSync('benchmarks').filter(name => name.endsWith('.ts')).map(name => 'benchmarks/' + name));
  execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', ...files, '--outDir', output, '--rootDir', '.', '--module', 'commonjs', '--target', 'es2020', '--skipLibCheck'], { stdio: 'inherit' });
  const tests = readdirSync('tests').filter(name => /^(query|content|navigation|reading(?:-backup|-storage)?)\.cjs$/.test(name)).map(name => 'tests/' + name);
  execFileSync(process.execPath, benchmark ? ['benchmarks/run.cjs'] : ['--test', ...tests], { stdio: 'inherit', env: { ...process.env, CATALOG_TEST_LIB: join(output, 'lib'), CATALOG_BENCHMARK_ROOT: output } });
} finally { rmSync(output, { recursive: true, force: true }); }

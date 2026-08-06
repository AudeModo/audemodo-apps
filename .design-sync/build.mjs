// The one command that builds the design-sync bundle correctly.
//
// The steps are chained here rather than as npm pre/post hooks so the order holds
// no matter how it is invoked — package managers disagree about pre/post scripts,
// and this pipeline has a step (resolve-css) that fails silently when skipped.
//
//   pnpm ds:build            build + validate + verify
//   pnpm ds:build --skip-verify   build + validate only (faster inner loop)
//
// The converter itself lives in .ds-sync/, which is gitignored and re-staged from
// the design-sync skill each session — hence the explicit existence check below
// rather than letting node fail with a bare MODULE_NOT_FOUND.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DS_SYNC = join(ROOT, '.ds-sync');
const OUT = join(ROOT, 'ds-bundle');
const PKG = join(ROOT, 'packages', 'design-system');

const skipVerify = process.argv.includes('--skip-verify');

function run(label, cmd, args) {
  console.log(`\n▸ ${label}`);
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd: ROOT, shell: false });
  if (r.status !== 0) {
    console.error(`\n✗ ${label} failed (exit ${r.status ?? 'signal ' + r.signal})`);
    process.exit(r.status || 1);
  }
}

if (!existsSync(join(DS_SYNC, 'package-build.mjs'))) {
  console.error(
    '✗ .ds-sync/ is not staged — the design-sync converter scripts are missing.\n' +
      '  They are gitignored by design (regenerated per session). Re-stage them by\n' +
      '  running the /design-sync skill, which copies them in and installs their deps.',
  );
  process.exit(1);
}

// Step 1 is the whole reason this file exists: skipping it makes the build ship a
// bundle with no component CSS, and the build still reports success.
run('resolve vendor CSS', process.execPath, [join(ROOT, '.design-sync', 'resolve-css.mjs')]);

run('build bundle', process.execPath, [
  join(DS_SYNC, 'package-build.mjs'),
  '--config',
  join(ROOT, '.design-sync', 'config.json'),
  '--node-modules',
  join(PKG, 'node_modules'),
  '--entry',
  join(PKG, 'src', 'index.ts'),
  '--out',
  OUT,
]);

run('validate bundle', process.execPath, [join(DS_SYNC, 'package-validate.mjs'), OUT]);

if (skipVerify) {
  console.log('\n! skipped verify-bundle (--skip-verify) — do not upload on this basis');
} else {
  run('verify bundle', process.execPath, [join(ROOT, '.design-sync', 'verify-bundle.mjs'), OUT]);
}

console.log('\n✓ ds:build complete');

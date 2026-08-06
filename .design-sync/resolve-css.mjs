// Materializes the design system's CSS entry as a single on-disk file inside
// the package.
//
// Why this exists: packages/design-system/src/styles.css is the DS's real CSS
// entry, but it @imports bare package specifiers (@astryxdesign/core/...).
// The converter's cfg.cssEntry is bounded to the package directory (a security
// bound — cssEntry content is uploaded verbatim), and pnpm symlinks
// node_modules/@astryxdesign/* out to the repo-root store, so the vendor files
// resolve outside that bound and get skipped — and the build then silently
// ships a runtime-styles stub with NO component CSS.
//
// Concatenating them here keeps the cascade order src/styles.css declares as
// non-negotiable: reset (@layer reset) -> components (@layer astryx-base) ->
// theme tokens (@layer astryx-theme) -> brand font tokens (unlayered).
//
// Usage:
//   node .design-sync/resolve-css.mjs            regenerate
//   node .design-sync/resolve-css.mjs --check    exit 1 if missing or stale
//
// Output is gitignored; regenerate rather than commit it.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PKG = join(ROOT, 'packages', 'design-system');
const NM = join(PKG, 'node_modules');

// Order mirrors src/styles.css exactly. Keep the two in sync.
//
// ./fonts/fonts.css is deliberately NOT here: its @font-face url()s are relative
// to src/fonts/, which would dangle once concatenated into .ds-css/. The converter
// picks those up from cfg.extraFonts instead and rewrites the paths. Only the token
// mapping, which contains no url(), is concatenated.
const PARTS = [
  ['@astryxdesign/core/reset.css', join(NM, '@astryxdesign/core/src/reset.css')],
  ['@astryxdesign/core/astryx.css', join(NM, '@astryxdesign/core/dist/astryx.css')],
  ['@astryxdesign/theme-neutral/theme.css', join(NM, '@astryxdesign/theme-neutral/dist/theme.css')],
  ['src/fonts/font-tokens.css', join(PKG, 'src/fonts/font-tokens.css')],
];

// src/styles.css is not concatenated, but it IS the spec this file implements:
// if someone adds an @import there and forgets PARTS, the sync ships stale CSS
// and nothing warns. Folding it into the stamp turns that into a failed --check.
const SPEC = join(PKG, 'src', 'styles.css');

export const DEST = join(PKG, '.ds-css', 'resolved.css');

const STAMP = '/* @resolve-css-inputs: ';

function inputsHash() {
  const h = createHash('sha256');
  for (const [spec, path] of PARTS) {
    if (!existsSync(path)) throw new Error(`resolve-css: input missing — ${spec} (${path})`);
    h.update(spec).update('\0').update(readFileSync(path));
  }
  h.update('styles.css\0').update(readFileSync(SPEC));
  return h.digest('hex').slice(0, 16);
}

function build() {
  const hash = inputsHash();
  const body = PARTS.map(([spec, path]) => `/* ${spec} */\n${readFileSync(path, 'utf8')}`).join(
    '\n',
  );
  return { hash, text: `${STAMP}${hash} */\n${body}` };
}

/** Returns null when fresh, or a human-readable reason when not. */
export function staleReason() {
  if (!existsSync(DEST)) return `${DEST} does not exist`;
  const want = inputsHash();
  const head = readFileSync(DEST, 'utf8').slice(0, 200);
  const got = head.startsWith(STAMP) ? head.slice(STAMP.length, STAMP.length + 16) : null;
  if (got === null) return 'output has no input stamp (hand-edited or written by an old version)';
  if (got !== want) return `inputs changed since it was generated (${got} -> ${want})`;
  return null;
}

// pathToFileURL, not string concatenation: on Windows node reports
// file:///C:/... while a hand-built `file://` + path yields file://C:/... and the
// comparison silently fails, turning this whole file into a no-op when spawned.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const check = process.argv.includes('--check');

  if (check) {
    const reason = staleReason();
    if (reason) {
      console.error(`✗ resolved CSS is stale: ${reason}`);
      console.error('  run: pnpm ds:css   (or pnpm ds:build, which does it for you)');
      process.exit(1);
    }
    console.log('✓ resolved CSS is up to date');
  } else {
    const { hash, text } = build();
    mkdirSync(dirname(DEST), { recursive: true });
    writeFileSync(DEST, text);
    console.log(`wrote ${DEST} (${Math.round(text.length / 1024)} KB, inputs ${hash})`);
  }
}

// Materializes the design system's CSS entry as a single on-disk file inside
// the package.
//
// Why this exists: packages/design-system/src/styles.css is the DS's real CSS
// entry, but it @imports bare package specifiers (@astryxdesign/core/...).
// The converter's cfg.cssEntry is bounded to the package directory (a security
// bound — cssEntry content is uploaded verbatim), and pnpm symlinks
// node_modules/@astryxdesign/* out to the repo-root store, so the vendor files
// resolve outside that bound and get skipped.
//
// Concatenating them here keeps the cascade order src/styles.css declares as
// non-negotiable: reset (@layer reset) -> components (@layer astryx-base) ->
// theme tokens (@layer astryx-theme).
//
// Run from packages/design-system before package-build.mjs. Output is
// gitignored; regenerate rather than commit it.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = join(dirname(fileURLToPath(import.meta.url)), '..', 'packages', 'design-system');
const NM = join(PKG, 'node_modules');

// Order mirrors src/styles.css exactly. Keep the two in sync.
//
// ./fonts/fonts.css is deliberately NOT here: its @font-face url()s are relative to
// src/fonts/, which would dangle once concatenated into .ds-css/. The converter picks
// those up from cfg.extraFonts instead and rewrites the paths. Only the token mapping,
// which contains no url(), is concatenated.
const PARTS = [
  ['@astryxdesign/core/reset.css', join(NM, '@astryxdesign/core/src/reset.css')],
  ['@astryxdesign/core/astryx.css', join(NM, '@astryxdesign/core/dist/astryx.css')],
  ['@astryxdesign/theme-neutral/theme.css', join(NM, '@astryxdesign/theme-neutral/dist/theme.css')],
  ['src/fonts/font-tokens.css', join(PKG, 'src/fonts/font-tokens.css')],
];

const out = PARTS.map(([spec, path]) => `/* ${spec} */\n${readFileSync(path, 'utf8')}`).join('\n');
const dest = join(PKG, '.ds-css', 'resolved.css');

mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, out);
console.log(`wrote ${dest} (${Math.round(out.length / 1024)} KB from ${PARTS.length} vendor files)`);

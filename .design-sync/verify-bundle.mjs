// Post-build assertions for the design-sync bundle.
//
// package-validate.mjs already covers structural integrity. This file covers the
// two failures THIS repo has actually hit, both of which validate reports as
// non-blocking warnings or not at all:
//
//   1. resolve-css.mjs was not run -> cfg.cssEntry is skipped -> the bundle ships
//      a runtime-styles stub with no component CSS. Validate says [CSS_RUNTIME],
//      which is a legitimate state for CSS-in-JS systems, so it does not fail.
//
//   2. The brand font token override does not reach the components. The vendor
//      theme declares its tokens inside @scope ([data-astryx-theme="neutral"]) and
//      <Theme> creates such an element per subtree, so a :root override changes
//      only <html> while every component keeps the vendor family. Nothing warns:
//      the @font-face IS shipped, so [FONT_MISSING] clears, and the render check
//      passes. Only the computed style reveals it.
//
// Both are checked against a real headless render over http (file:// restricts
// font loading, which would produce a false failure).
//
//   node .design-sync/verify-bundle.mjs [./ds-bundle]

import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { staleReason } from './resolve-css.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(process.argv[2] ?? join(ROOT, 'ds-bundle'));
const TOKENS_CSS = join(ROOT, 'packages/design-system/src/fonts/font-tokens.css');

const failures = [];
const fail = (msg) => failures.push(msg);
const ok = (msg) => console.log(`  ✓ ${msg}`);

// ---------------------------------------------------------------- static checks

if (staleReason()) {
  fail(`resolved CSS is stale — ${staleReason()}. Run: pnpm ds:css`);
} else {
  ok('resolved CSS is up to date with its inputs');
}

const bundleCss = join(OUT, '_ds_bundle.css');
if (!existsSync(bundleCss)) {
  fail('_ds_bundle.css is missing');
} else {
  const text = readFileSync(bundleCss, 'utf8');
  const bytes = statSync(bundleCss).size;
  if (text.includes('@ds-css-runtime') || bytes < 10_000) {
    fail(
      `_ds_bundle.css is the runtime-styles stub (${bytes}B) — cfg.cssEntry was skipped, so the ` +
        'bundle has NO component CSS. Almost always: resolve-css.mjs did not run. Run: pnpm ds:css',
    );
  } else {
    ok(`_ds_bundle.css carries real CSS (${Math.round(bytes / 1024)} KB)`);
  }
}

const stylesCss = join(OUT, 'styles.css');
if (!existsSync(stylesCss)) {
  fail('styles.css is missing');
} else if (!readFileSync(stylesCss, 'utf8').includes('_ds_bundle.css')) {
  // Designs receive only the styles.css @import closure.
  fail('styles.css does not @import ./_ds_bundle.css — component CSS will not reach designs');
} else {
  ok('styles.css reaches _ds_bundle.css');
}

// Expected families come from the repo's own token file, so this check keeps
// working when the brand fonts change — nothing is hardcoded here.
function expectedFamilies() {
  if (!existsSync(TOKENS_CSS)) return null;
  const css = readFileSync(TOKENS_CSS, 'utf8');
  const first = (prop) => {
    const m = css.match(new RegExp(`--font-family-${prop}\\s*:([^;]+);`));
    if (!m) return null;
    return m[1]
      .trim()
      .split(',')[0]
      .trim()
      .replace(/^['"]|['"]$/g, '');
  };
  const body = first('body');
  const heading = first('heading');
  return body && heading ? { body, heading } : null;
}

const want = expectedFamilies();
if (!want) fail(`could not read expected font families from ${TOKENS_CSS}`);

// ---------------------------------------------------------------- rendered check

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

async function withServer(dir, fn) {
  const server = createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '');
    const file = join(dir, rel);
    if (!file.startsWith(dir) || !existsSync(file) || statSync(file).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  try {
    return await fn(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
  }
}

if (want && failures.length === 0) {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    fail(
      'playwright is not importable — the rendered font check did NOT run. ' +
        'Recreate the fork symlink: ln -sfn ../.ds-sync/node_modules .design-sync/node_modules',
    );
  }

  if (chromium) {
    // Sampling every card rather than a chosen one: the trap is per-subtree, so a
    // component whose preview happens to nest deeper is exactly what would slip past.
    const cards = [];
    const { readdirSync } = await import('node:fs');
    const collect = (d) => {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        const p = join(d, e.name);
        if (e.isDirectory()) collect(p);
        else if (e.name.endsWith('.html')) cards.push(p);
      }
    };
    const componentsDir = join(OUT, 'components');
    if (existsSync(componentsDir)) collect(componentsDir);

    if (cards.length === 0) fail('no component preview cards found to check');

    await withServer(OUT, async (base) => {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      const bad = [];
      let sampledBody = 0;
      let sampledHeading = 0;

      for (const card of cards) {
        const rel = card
          .slice(OUT.length + 1)
          .split(/[\\/]/)
          .join('/');
        await page.goto(`${base}/${rel}`, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);

        const r = await page.evaluate(() => {
          const firstFamily = (el) =>
            getComputedStyle(el)
              .fontFamily.split(',')[0]
              .trim()
              .replace(/^['"]|['"]$/g, '');
          // Only inside the mount roots (#r0, #r1, ...). The card's own scaffolding
          // — grid, story labels — is deliberately unthemed and renders in
          // system-ui; sampling it would fail every card for the wrong reason.
          const roots = [...document.querySelectorAll('[id^="r"]')];
          const sample = (sel) =>
            roots
              .flatMap((root) => [...root.querySelectorAll(sel)])
              .filter((el) => (el.textContent || '').trim())
              .slice(0, 3)
              .map(firstFamily);
          return {
            rootCount: roots.length,
            body: sample('p'),
            heading: sample('h1, h2, h3, h4, h5, h6'),
            faces: [...document.fonts].map((f) => `${f.family}:${f.status}`),
          };
        });

        if (r.rootCount === 0) bad.push(`${rel}: no mount root (#r0…) found — card did not render`);

        for (const got of r.body) {
          sampledBody++;
          if (got !== want.body) bad.push(`${rel}: <p> renders "${got}", expected "${want.body}"`);
        }
        for (const got of r.heading) {
          sampledHeading++;
          if (got !== want.heading)
            bad.push(`${rel}: heading renders "${got}", expected "${want.heading}"`);
        }
        const unloaded = r.faces.filter((f) => f.endsWith(':unloaded'));
        if (
          r.faces.length &&
          unloaded.length === r.faces.length &&
          (r.body.length || r.heading.length)
        )
          bad.push(`${rel}: no @font-face actually loaded (${unloaded.join(', ')})`);
      }

      await browser.close();

      if (sampledBody === 0 && sampledHeading === 0)
        fail('no text elements were sampled — the font check proved nothing');

      // One line per distinct problem; the same root cause repeats across cards.
      const uniq = [...new Set(bad.map((b) => b.replace(/^[^:]+: /, '')))];
      if (uniq.length) {
        fail(
          `brand fonts are NOT applied in ${bad.length} sampled element(s) across ${cards.length} card(s):\n` +
            uniq.map((u) => `      - ${u}`).join('\n') +
            '\n      The token override is not reaching the components. Check that\n' +
            '      src/fonts/font-tokens.css targets :root, [data-astryx-theme] and sits\n' +
            '      OUTSIDE any @layer — see the Fonts section of .design-sync/NOTES.md.',
        );
      } else {
        ok(
          `brand fonts applied — ${sampledBody} body + ${sampledHeading} heading element(s) ` +
            `across ${cards.length} cards render ${want.body} / ${want.heading}`,
        );
      }
    });
  }
}

// ---------------------------------------------------------------- report

if (failures.length) {
  console.error(`\n✗ verify-bundle: ${failures.length} problem(s)\n`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  console.error('');
  process.exit(1);
}
console.log('\n✓ verify-bundle: bundle carries real CSS and the brand fonts actually render');

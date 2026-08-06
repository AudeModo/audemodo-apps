# design-sync notes — @audemodo/design-system

Repo-specific gotchas for future syncs. Read this before re-running.

## Shape and entry

- Shape is `package` (no Storybook anywhere in the monorepo, no `*.stories.*`).
- The package has **no build step** — `main`/`exports` point straight at `src/index.ts`.
  Bundle with `--entry packages/design-system/src/index.ts`; esbuild handles the TS.
  There is no `buildCmd` to run first.
- `packages/design-system` is a thin re-export shell: every component except
  `DesignSystemProvider` comes from `@astryxdesign/core`, which ships its own prebuilt
  `dist/` + `.d.ts`. That is why prop extraction is rich despite the DS having no `.d.ts`
  of its own (`[DTS] parsed 0 .d.ts files from .../src` in the build log is expected, not
  a failure — the 10/10 line further down is the real result).
- Run the converter **from the repo root** with `--node-modules
  packages/design-system/node_modules`. That node_modules has its own `react`/`react-dom`,
  so it is the correct one. Running with cwd inside `ds-bundle/` has intermittently hit
  `EBUSY: resource busy or locked, rmdir ds-bundle` on Windows — rerun from the repo root.

## CSS — why `.design-sync/resolve-css.mjs` exists

`packages/design-system/src/styles.css` is the DS's real CSS entry, but it `@import`s bare
package specifiers (`@astryxdesign/core/reset.css`, etc.). `cfg.cssEntry` is bounded to the
package directory as a security measure, and pnpm symlinks `node_modules/@astryxdesign/*`
out to the repo-root store — so pointing `cssEntry` at a vendor path is rejected with
`! cssEntry: … resolves outside the package — skipped`, and the build silently ships a
runtime-styles stub (`[CSS_RUNTIME]`) with **no component CSS at all**.

Fix: `node .design-sync/resolve-css.mjs` concatenates the three vendor files into
`packages/design-system/.ds-css/resolved.css` (gitignored), preserving the cascade order
`src/styles.css` declares as non-negotiable: reset → astryx.css → theme.css.
`cfg.cssEntry` points there.

**Run `node .design-sync/resolve-css.mjs` before `package-build.mjs` on every sync.** If
`@astryxdesign/*` is upgraded, re-run it and keep `PARTS` in that script in sync with
`src/styles.css`.

## Known render warns (checked and benign — a warn NOT listed here is new)

- `[TOKENS_MISSING]` — ~24 `--x-*` custom properties (`--x-gap`, `--x-borderWidth`,
  `--x-animationDelay`, `--x---_tab-indicator-bottom`, …). These are StyleX's *dynamic*
  style variables, set inline by components at runtime. They are correctly absent from
  static CSS. Do not chase; do not add a tokens package for them.
- `[RENDER_THIN] … rendered height is 0px` on every authored preview (Card, List, Text so
  far). False measurement — the screenshots are 40–50 KB and render correctly, and
  `.render-check.json` reports `bad: []`, `rootEmpty: false`. Astryx's StyleX root layout
  measures as 0 height. Confirm via the screenshot, not the height.

## Preview authoring

- **No emoji in previews.** Headless Chromium here has no emoji font — `📄` rendered as a
  tofu box in `ListItem.startContent`. Use a `<Text>` glyph instead.
- Content is Korean, drawn from the repo's own devlog domain — matches how the DS is
  actually used and keeps the cards honest.
- The canonical compositions are ported from real app code, not invented:
  - `apps/devlog/src/_pages/posts/ui/posts-list-page` → List/ListItem
  - `apps/devlog/src/_pages/posts/ui/post-detail-page` → Heading/Text/Divider/VStack
  - `apps/devlog/app/not-found.tsx` → Heading/Text/Link/VStack
  - `apps/devlog/app/providers.tsx` → DesignSystemProvider with `linkComponent={NextLink}`
- `cfg.provider` is `DesignSystemProvider`. Astryx components read theme from context; the
  provider supplies `Theme` + `neutralTheme`. Without it previews render unthemed.
- Multiple roots per export (a bare `<>…</>` sweep) render fine — the grid cell stacks them
  vertically.
- **Watch the contact sheet for grid clipping even when validate is silent.** `[GRID_OVERFLOW]`
  did not fire, but `Card.PostSummary` and `Link.Standalone` were visibly clipped by their
  grid column at `maxWidth={380}`/`{420}`. Trimmed both to `300`. Keep canonical stories at
  roughly ≤300px wide, or give the component a `cardMode` override.
- `List` and `ListItem` carry `cfg.overrides.<Name>.cardMode = "column"` — they are
  inherently full-width, so one export per row reads far better than a 3-column grid.
- **Editing a `previews/<Name>.tsx` clears that component's grade** (grades follow their
  sources). After a late tweak, re-capture and re-grade just that component — the driver
  lists them under `verification.pendingGrade`.

## Fonts — resolved, and the trap that cost an hour

Brand fonts live at `packages/design-system/src/fonts/` (SUIT Variable → body,
SUITE Variable → heading; both SIL OFL, licences committed alongside). Two files wire them:

- `src/fonts/fonts.css` — `@font-face` only, `font-weight: 100 900`, `font-display: swap`.
  Registered as `cfg.extraFonts`; the converter extracts the faces, copies the woff2 into
  `fonts/` and rewrites the urls. **Do not** add this file to `resolve-css.mjs` — its
  `url()`s are relative to `src/fonts/` and would dangle once concatenated into `.ds-css/`.
- `src/fonts/font-tokens.css` — maps them onto `--font-family-body`/`--font-family-heading`.
  This one IS in `resolve-css.mjs` (no `url()`, so nothing to break).

Both are `@import`ed from `src/styles.css`, so the app gets them too — not just the sync.

**The trap: `:root` is the wrong selector, and it fails silently.** The vendor theme declares
its tokens inside `@scope ([data-astryx-theme="neutral"])`, and Astryx's `<Theme>` renders a
`data-astryx-theme` div *per subtree* — six of them in a single preview card. The scope rule
re-declares Figtree on every one. Custom properties inherit, so the nearest ancestor wins:
a `:root` override changes `<html>` and nothing else, while every actual component keeps
rendering Figtree. Nothing warns — `[FONT_MISSING]` clears (the faces *are* shipped), the
render check passes, and the screenshots look plausible unless you know the brand shapes.

The override therefore targets `:root, [data-astryx-theme]` and sits **outside any
`@layer`** so it beats the layered declaration on the same element.

**How to verify after any font/theme change** (don't trust the screenshot):

```js
// over http, not file:// — then check document.fonts and the computed family
[...document.fonts].map(f => `${f.family}:${f.status}`)   // want "loaded", not "unloaded"
getComputedStyle(document.querySelector('p')).fontFamily  // want 'SUIT Variable', not Figtree
```

`unloaded` faces mean nothing on the page actually uses the family — i.e. the token override
did not reach the elements. `--font-family-code` is deliberately left on the vendor's
monospace stack.

## Re-sync risks

- **`resolve-css.mjs` drift.** If `src/styles.css` gains or reorders an `@import` and
  nobody updates `PARTS` in `resolve-css.mjs`, the sync ships stale or mis-ordered CSS and
  *nothing warns* — the build still reports a healthy 157 KB `_ds_bundle.css`. Diff the two
  files whenever the DS's CSS entry changes.
- **Vendor-version coupling.** Everything visual comes from `@astryxdesign/core` and
  `@astryxdesign/theme-neutral` (both `0.2.0` at sync time). An Astryx major bump can change
  component APIs and token names wholesale; on such a bump, re-verify grades rather than
  trusting carry-forward, and re-validate `conventions.md` names against the fresh build.
- **`.ds-css/` is gitignored**, so a fresh clone has no CSS until `resolve-css.mjs` runs.
  This is the single easiest step to forget.
- **An Astryx upgrade can silently un-brand the fonts.** The override in `font-tokens.css`
  depends on the vendor's `[data-astryx-theme]` attribute and on its tokens staying inside a
  `@layer`. If either changes, the override stops winning and everything quietly reverts to
  the vendor family — with no warning from validate. Re-run the two-line browser check in
  the Fonts section after any `@astryxdesign/*` bump.
- **Grid fit is font-dependent.** Switching to the brand fonts pushed `HStack` over its grid
  cell (`[GRID_OVERFLOW]`) and re-clipped `Card.PostSummary`, both of which had been fine on
  the fallback. `Card`, `HStack`, `List` and `ListItem` are now `cardMode: "column"`. Any
  future type change means re-checking the contact sheet, not just the per-story sheets.
- **`conventions.md` names real tokens and props** (verified against `tokens/theme.css` and
  the emitted `.d.ts` at sync time). If Astryx renames a token family or a prop enum, those
  names rot silently — the design agent will happily emit vocabulary that no longer resolves.
  Re-run the validation pass (grep each named token against the fresh `tokens/theme.css`)
  on every re-sync; the driver prompts for this automatically.
- **Astryx exposes ~100 components; this DS re-exports 10.** If someone adds a re-export to
  `src/index.ts`, the next sync picks it up automatically and it will ship with a *floor
  card* until a preview is authored for it. That is the expected flow, not a failure.

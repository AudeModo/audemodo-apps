# Building with @audemodo/design-system

A small, deliberate surface: 9 components plus one provider, wrapping Astryx under an
owned boundary. Prefer composing these over writing raw markup.

## Wrap the tree in DesignSystemProvider

Every component reads its theme from React context. **Without the provider they render
unthemed** — correct DOM, no tokens, no colours, no type scale. Wrap once at the root:

```jsx
<DesignSystemProvider>
  <App />
</DesignSystemProvider>
```

`DesignSystemProvider` ships in the bundle but has no props of its own worth setting here
except `linkComponent`, which injects a router component (e.g. `next/link`) so `Link`
renders through it. Omit it and `Link` renders a plain `<a>` — fine for most designs.

## There are no CSS classes — style through props

This is a **prop-styled** system. Do not write utility classes, do not invent class names,
and do not reach for `className` on these components. The design language is carried by
props, and every one is a closed enum — values outside it silently do nothing.

- **Spacing** (`padding`, `paddingBlock`, `paddingInline`, `gap`) is a numeric step scale,
  not pixels: `0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10`. Use `gap={4}`, never
  `gap="16px"`.
- **Layout** is `VStack` / `HStack`, never a raw flex div. They take `gap`, `align`/`hAlign`,
  `justify`/`vAlign`, `wrap`, `padding*`, `width`/`height`/`maxWidth`/`minHeight`.
- **Text colour** (`color` on `Text`, `Heading`, and friends):
  `primary | secondary | accent | placeholder | disabled | inherit`.
- **Text sizing** is semantic: `Text type=` is
  `body | large | label | supporting | code | display-1 | display-2 | display-3`.
  `Heading level={1..6}` sets both the element and the size; `type="display-*"` overrides
  the size. Reach for `size=` only to override a specific step.
- **Surfaces**: `Card` takes `variant` (`default | muted | transparent` plus the hues
  `blue | cyan | gray | green | orange | pink | purple | red | teal | yellow`),
  `elevation` (`none | low | med | high`) and `padding`.

For your _own_ layout glue outside these components, use the CSS custom properties the
theme defines rather than literals — `--color-text-primary`, `--color-text-secondary`,
`--color-background-body`, `--color-background-card`, `--color-background-muted`,
`--color-border`, `--color-border-emphasized`, `--color-accent`, `--radius-element`,
`--radius-container`, `--shadow-*`, `--font-family-body`, `--font-family-heading`.
Note spacing is **not** exposed as tokens — use the components' step props.

## Where the truth lives

- `_ds/<folder>/styles.css` and its imports — the real cascade: reset → component styles
  (`@layer astryx-base`) → theme tokens (`@layer astryx-theme`, in `tokens/theme.css`).
  Read `tokens/theme.css` for the exact token names; it is the authoritative list.
- `components/<group>/<Name>/<Name>.d.ts` — the prop contract, with per-prop docs.
- `components/<group>/<Name>/<Name>.prompt.md` — per-component usage.

Import order in `styles.css` is a cascade contract; don't reorder it.

## An idiomatic composition

```jsx
<DesignSystemProvider>
  <VStack gap={6} maxWidth={720} padding={4}>
    <VStack gap={2}>
      <Heading level={1}>글 목록</Heading>
      <Text as="p" color="secondary">
        최근에 쓴 글을 최신순으로 보여줍니다.
      </Text>
    </VStack>

    <Divider />

    <List hasDividers>
      <ListItem
        label={<Link href="/posts/first">디자인 시스템의 경계 설계</Link>}
        description="벤더 컴포넌트를 그대로 노출하지 않고 경계를 두면 무엇이 좋아지는가."
      />
    </List>
  </VStack>
</DesignSystemProvider>
```

Note the shape: `VStack` for all vertical rhythm, `Heading`/`Text` for every string,
`ListItem` always inside `List`, and `Link` inside `ListItem.label` rather than wrapping
the row (use `ListItem href=` when the whole row should navigate).

# separator

2026-07-05 — golden pair via CLI (base-nova), progressive/coexistence mode. Clean.

Project layout note: Radix wrappers stay in `@/components/ui`; migrated Base UI
wrappers are written to `@/components/base/ui` (both coexist). The Radix original
is intentionally left in place.

## Changed

- `src/components/base/ui/separator.tsx` (new) — Base UI `@base-ui/react/separator`.
  `Separator.Root` -> callable `Separator` (`SeparatorPrimitive.Props`); the
  `decorative` prop is dropped (Base separator is always semantic). Classes match
  the base-nova golden verbatim.
- Consumers repointed `@/components/ui/separator` -> `@/components/base/ui/separator`
  (pure import swap; no call site used `decorative`):
  `src/app/(preview)/components/block-viewer.tsx`,
  `src/features/portfolio/components/education/education-item.tsx`,
  `src/features/portfolio/components/bookmarks/bookmark-item.tsx`,
  `src/features/portfolio/components/awards/award-item.tsx`,
  `src/features/portfolio/components/certifications/certification-item.tsx`,
  `src/features/portfolio/components/experiences/experience-position-item.tsx`,
  `src/components/site-header.tsx`, `src/components/site-bottom-nav.tsx`.

Leftover scan clean: `grep -n "radix-ui\|@radix-ui" src/components/base/ui/separator.tsx` -> none.

## Left alone

- `src/components/ui/separator.tsx` (Radix original, kept for coexistence).
- `src/components/ui/field.tsx` still imports `@/components/ui/separator` (Radix);
  `field.tsx` is not a Radix wrapper and was not part of this scope.
- `src/components/ui/button-group.tsx` / `src/components/ui/sidebar.tsx` consume
  separator internally; handled by their own base/ui migrations.

## Behavior changes

None. `decorative` was only ever set internally; no consumer passed it.

## Verify by hand

- Check horizontal + vertical separators still render as 1px rules in header,
  bottom nav, and portfolio item cards (light + dark).

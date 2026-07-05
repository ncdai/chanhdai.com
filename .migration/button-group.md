# button-group

2026-07-05 — transformation engine, progressive/coexistence mode. Clean.

Project layout note: Radix wrappers stay in `@/components/ui`; migrated Base UI
wrappers are written to `@/components/base/ui`.

## Changed

- `src/components/base/ui/button-group.tsx` (new). Two Radix touch points:
  (1) `ButtonGroupText`'s manual `Slot` idiom -> `useRender` + `mergeProps`
  (`useRender.ComponentProps<"div">`); (2) imports `Separator` from
  `@/components/base/ui/separator` (see separator.md). `ButtonGroup` and the cva
  variants are unchanged.
- `src/features/doc/components/doc-page-actions.tsx`: import repoint
  `@/components/ui/button-group` -> `@/components/base/ui/button-group`
  (uses only `ButtonGroup` + `ButtonGroupSeparator`, no `asChild`).

Leftover scan clean: `grep -n "radix-ui\|@radix-ui" src/components/base/ui/button-group.tsx` -> none.

## Left alone

- `src/components/ui/button-group.tsx` (Radix original, kept for coexistence).

## Behavior changes

- `ButtonGroupText` `asChild` prop removed in favor of `render`. No consumer used
  it.

## Verify by hand

- The doc page-actions "Copy page" + view-options group renders as one joined
  control with the vertical separator between the two buttons.

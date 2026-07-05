# context-menu

2026-07-05 — transformation engine (classes preserved, primitives rewired),
progressive/coexistence mode. Clean.

Project layout note: Radix wrappers stay in `@/components/ui`; migrated Base UI
wrappers are written to `@/components/base/ui`. Classes preserved for visual parity.

## Changed

- `src/components/base/ui/context-menu.tsx` (new) — Radix `ContextMenu` -> Base UI
  `@base-ui/react/context-menu`. `Content` -> `Portal > Positioner > Popup`;
  `Label` -> `GroupLabel`; `ItemIndicator` -> `CheckboxItemIndicator` /
  `RadioItemIndicator`; `Sub` -> `SubmenuRoot`; `SubTrigger` -> `SubmenuTrigger`
  (`data-open:` -> `data-popup-open:`); `SubContent` reuses `ContextMenuContent`;
  CSS vars renamed (`--radix-context-menu-content-available-height` ->
  `--available-height`, `--radix-context-menu-content-transform-origin` ->
  `--transform-origin`).
- `src/components/brand-context-menu.tsx`: import repoint; the two link items'
  `asChild` -> `render` (`<Link>` and `<a download>`). Trigger keeps children
  (Base UI ContextMenu.Trigger renders a div wrapper, same as before).

Leftover scan clean: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder" src/components/base/ui/context-menu.tsx` -> none.

## Left alone

- `src/components/ui/context-menu.tsx` (Radix original, kept for coexistence).

## Behavior changes

- Base UI `ContextMenu.Root` has no `modal` prop and `ContextMenu.Trigger` has no
  `disabled` prop. Neither was used by the consumer, so no behavior changed here.

## Verify by hand

- Right-click the brand mark: menu opens at the pointer, "Copy Mark/Logotype as
  SVG" copy and toast, "Brand Guidelines" navigates, "Download Brand Assets"
  downloads, Escape/outside-click dismiss.

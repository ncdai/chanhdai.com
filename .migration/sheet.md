# sheet

2026-07-05 — transformation engine (classes preserved, primitives rewired),
progressive/coexistence mode. Clean.

Project layout note: Radix wrappers stay in `@/components/ui`; migrated Base UI
wrappers are written to `@/components/base/ui`.

## Changed

- `src/components/base/ui/sheet.tsx` (new) — Radix `Dialog` -> Base UI
  `@base-ui/react/dialog`. `Overlay` -> `Backdrop`, `Content` -> `Popup`; the
  close button's `asChild` -> `render={<Button/>}` (Button from
  `@/components/base/ui/button`) with `XIcon`. Classes preserved, including the
  `data-open`/`data-closed` animate-in/out + `data-[side=*]` slide classes — this
  matches the already-migrated `src/components/base/ui/dialog.tsx` which relies on
  the same Base UI `data-open`/`data-closed` hooks.

Leftover scan clean: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder" src/components/base/ui/sheet.tsx` -> none.

## Left alone

- `src/components/ui/sheet.tsx` (Radix original, kept for coexistence).
- Only consumer is `src/components/ui/sidebar.tsx`; handled by the sidebar
  migration (its base version imports `@/components/base/ui/sheet`). No separate
  app consumer to repoint.

## Behavior changes

- Kept the project's animate-in/out approach (consistent with base dialog) rather
  than rewriting to `data-starting-style`/`data-ending-style` translate classes,
  for visual parity with the existing base dialog.

## Verify by hand

- Exercised via the mobile sidebar (see sidebar.md): open/close the mobile
  sidebar sheet, confirm slide-in from the correct side, backdrop fade, Escape
  and backdrop-click dismissal, and focus trap.

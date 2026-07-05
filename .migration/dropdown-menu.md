# dropdown-menu

2026-07-05 — transformation engine (classes preserved, primitives rewired),
progressive/coexistence mode. Clean.

Project layout note: Radix wrappers stay in `@/components/ui`; migrated Base UI
wrappers are written to `@/components/base/ui`. Classes were preserved (rather
than adopting the base-nova golden's restyle) because this component has live
consumers and visual parity was required.

## Changed

- `src/components/base/ui/dropdown-menu.tsx` (new) — Radix `DropdownMenu` -> Base UI
  `@base-ui/react/menu`. `Content` -> `Portal > Positioner > Popup`
  (align/alignOffset/side/sideOffset + `collisionPadding` forwarded to Positioner
  per the Pick-means-forward rule); `Label` -> `GroupLabel`; `ItemIndicator` ->
  `CheckboxItemIndicator` / `RadioItemIndicator`; `Sub` -> `SubmenuRoot`;
  `SubTrigger` -> `SubmenuTrigger` (open marker `data-open:` -> `data-popup-open:`);
  `SubContent` reuses `DropdownMenuContent` with submenu defaults; CSS vars renamed
  (`--radix-dropdown-menu-content-available-height` -> `--available-height`,
  `--radix-dropdown-menu-trigger-width` -> `--anchor-width`,
  `--radix-dropdown-menu-content-transform-origin` -> `--transform-origin`);
  `data-[state=closed]:overflow-hidden` -> `data-closed:overflow-hidden`.
- Consumers repointed + call sites migrated:
  - `src/features/doc/components/doc-share-menu.tsx`: import repoint; Trigger
    `asChild` -> `render={<Button/>}`; `onCloseAutoFocus={(e)=>e.preventDefault()}`
    -> `finalFocus={false}` (Popup); item `asChild` -> `render`; the "Other app"
    item's `onClick`+`e.preventDefault()` (keep-open) -> `closeOnClick={false}`.
  - `src/features/doc/components/doc-page-actions.tsx`: import repoint; Trigger
    `asChild` -> `render`; `onCloseAutoFocus` -> `finalFocus={false}`; mapped items
    `asChild` -> `render`. (Also repointed its `button-group` import; see button-group.md.)

Leftover scan clean: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder" src/components/base/ui/dropdown-menu.tsx` -> none.

## Left alone

- `src/components/ui/dropdown-menu.tsx` (Radix original, kept for coexistence).
- `Button` in the two consumers still imports `@/components/ui/button` (Radix) —
  intentional per scope (button cutover excluded); it works fine as a `render`
  target of the Base UI Trigger.

## Behavior changes

- Menu item keep-open now uses `closeOnClick={false}` instead of
  `event.preventDefault()` in `onClick` (Base UI semantics). Behavior preserved.
- `onCloseAutoFocus` prevention is now `finalFocus={false}` on the popup.

## Verify by hand

- Open the doc share menu and the page-actions menu: keyboard arrow nav +
  typeahead, Escape closes, links open in a new tab and close the menu, "Other
  app" triggers the share sheet without closing, and focus does not jump back to
  the trigger on close.

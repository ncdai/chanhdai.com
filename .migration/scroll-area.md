# scroll-area

2026-07-05 — golden pair via CLI (base-nova), progressive/coexistence mode. Clean.

Project layout note: Radix wrappers stay in `@/components/ui`; migrated Base UI
wrappers are written to `@/components/base/ui`.

## Changed

- `src/components/base/ui/scroll-area.tsx` (new) — Base UI `@base-ui/react/scroll-area`.
  `ScrollAreaScrollbar` -> `ScrollArea.Scrollbar`, `ScrollAreaThumb` ->
  `ScrollArea.Thumb`; `ScrollBar` gains `data-orientation` and the orientation
  classes fold into `data-horizontal:*` / `data-vertical:*` per the base-nova golden.

Leftover scan clean: `grep -n "radix-ui\|@radix-ui" src/components/base/ui/scroll-area.tsx` -> none.

## Left alone

- `src/components/ui/scroll-area.tsx` (Radix original, kept for coexistence).
- No app/feature consumers (only `src/registry/**`, explicitly out of scope), so
  nothing was repointed.

## Behavior changes

- Base UI drops the `type` / `scrollHideDelay` visibility model; scrollbar
  visibility is now CSS/state-driven (`data-hovering`/`data-scrolling`). The
  wrapper does not expose those props and none were used.

## Verify by hand

- No live app consumer today. If reused, confirm the scrollbar appears on
  hover/scroll and the thumb drags correctly.

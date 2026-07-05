# select

2026-07-05 — golden pair via CLI (base-nova), progressive/coexistence mode. Clean.

Project layout note: Radix wrappers stay in `@/components/ui`; migrated Base UI
wrappers are written to `@/components/base/ui`.

## Changed

- `src/components/base/ui/select.tsx` (new) — Base UI `@base-ui/react/select`,
  built from the base-nova golden (structural positioning model is mandatory).
  Key transforms: `Select.Root` aliased as `const Select`; content is now
  `Portal > Positioner > Popup`; `Viewport` -> `List`; `ScrollUp/DownButton` ->
  `ScrollUp/DownArrow`; `Label` -> `GroupLabel`; `Icon`/`ItemIndicator` use
  `render`; the Radix `position="item-aligned"|"popper"` model becomes the
  Positioner `alignItemWithTrigger` boolean; CSS vars renamed
  (`--radix-select-content-available-height` -> `--available-height`,
  `--radix-select-content-transform-origin` -> `--transform-origin`,
  `--radix-select-trigger-width` -> `--anchor-width`). The golden's
  `IconPlaceholder` calls were replaced with the project's lucide icons
  (`ChevronDownIcon`, `CheckIcon`, `ChevronUpIcon`) and `@/lib/utils`.

Leftover scan clean: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder" src/components/base/ui/select.tsx` -> none.

## Left alone

- `src/components/ui/select.tsx` (Radix original, kept for coexistence).
- No app/feature consumers (only `src/registry/**`, out of scope), so nothing
  was repointed.

## Behavior changes

- Trigger/item sizing follows base-nova (e.g. trigger `h-8`/`h-7` vs radix-nova
  `h-9`/`h-8`) since this component was pristine and adopted the base golden,
  consistent with how popover was migrated. No consumer depends on it today.
- `position` prop replaced by `alignItemWithTrigger` (default `true`).

## Verify by hand

- No live app consumer today. If reused: open the select, confirm popup width
  tracks the trigger, keyboard typeahead + arrow navigation work, and the check
  indicator shows on the selected item.

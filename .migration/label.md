# label

2026-07-05 — golden pair via CLI (base-nova), progressive/coexistence mode. Clean.

Project layout note: Radix wrappers stay in `@/components/ui`; migrated Base UI
wrappers are written to `@/components/base/ui`.

## Changed

- `src/components/base/ui/label.tsx` (new) — Radix `Label.Root` has no Base UI
  counterpart, so it becomes a native `<label>` (`React.ComponentProps<"label">`),
  matching the base-nova golden. Classes unchanged.

Leftover scan clean: `grep -n "radix-ui\|@radix-ui" src/components/base/ui/label.tsx` -> none.

## Left alone

- `src/components/ui/label.tsx` (Radix original, kept for coexistence).
- `src/components/ui/field.tsx` still imports `@/components/ui/label` — `field.tsx`
  is not a Radix wrapper and is out of scope; it keeps the Radix label.
- `src/components/ui/form.tsx` (Radix original) still imports the Radix label; the
  migrated `src/components/base/ui/form.tsx` imports the new base label.

No app/feature consumers imported `@/components/ui/label` directly, so nothing else
was repointed.

## Behavior changes

None functional. Native `<label>` drops Radix's double-click text-selection
guard; the `select-none` class already present preserves that behavior.

## Verify by hand

- Clicking a form label still focuses its associated control.

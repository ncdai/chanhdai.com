# field

2026-08-22 — golden from the registry (base-nova), progressive/coexistence mode.

Project layout note: Radix wrappers stay in `@/components/ui`; migrated Base UI
wrappers are written to `@/components/base/ui`.

## Changed

- `src/components/base/ui/field.tsx` (new) — verbatim base-nova golden
  (`https://ui.shadcn.com/r/styles/base-nova/field.json`) with imports repointed
  to `@/lib/utils`, `@/components/base/ui/label`, and
  `@/components/base/ui/separator`. Same export surface as the Radix file.

## Differences from `src/components/ui/field.tsx`

The golden is tighter and adds interactive states; nothing else changes:

- Spacing: `FieldSet` gap-6 -> gap-4, `FieldLegend` mb-3 -> mb-1.5,
  `FieldGroup` gap-7 -> gap-5, `Field` gap-3 -> gap-2,
  `FieldContent` gap-1 -> gap-0.5.
- `FieldLabel` wrapping a nested `Field` (choice cards): rounded-md -> rounded-lg,
  p-3 -> p-2.5, plus hover and focus-visible ring states.
- `FieldTitle` drops `leading-snug`.

## Left alone

- `src/components/ui/field.tsx` (Radix label import, kept for coexistence).

## First consumer

- `src/features/doc/components/doc-feedback.tsx` (`Field`, `FieldLabel`,
  `FieldError`).

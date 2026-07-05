# form

2026-07-05 — transformation engine (no base-nova golden ships for this RHF-based
form), progressive/coexistence mode. Clean.

Project layout note: Radix wrappers stay in `@/components/ui`; migrated Base UI
wrappers are written to `@/components/base/ui`.

## Changed

- `src/components/base/ui/form.tsx` (new). This is the standard react-hook-form
  based shadcn form; the only Radix usage was `Slot` (in `FormControl`) and the
  `Label` primitive type import. Transforms: `FormControl`'s `Slot.Root` idiom ->
  `useRender` + `mergeProps` (`useRender.ComponentProps<"div">`, `defaultTagName:
"div"`, `render` prop); `Label` import -> `@/components/base/ui/label`;
  `FormLabel` prop type `React.ComponentProps<typeof LabelPrimitive.Root>` ->
  `React.ComponentProps<typeof Label>`. RHF wiring (`FormField`, `useFormField`,
  contexts, `FormItem`/`FormDescription`/`FormMessage`) unchanged.

  Note: Base UI ships its own `Form`/`Field`/`Fieldset` system, but this file is
  the RHF wrapper (not the Radix `Form` primitive), so it was NOT rebuilt onto
  Base UI Field — only its Radix bits were rewired.

Leftover scan clean: `grep -n "radix-ui\|@radix-ui" src/components/base/ui/form.tsx` -> none.

## Left alone

- `src/components/ui/form.tsx` (Radix `Slot`/`Label` original, kept for coexistence).
- No app/feature consumers imported `@/components/ui/form`, so nothing was repointed.

## Behavior changes

- `FormControl` now takes `render={<Control/>}` instead of a single child
  (Base UI `useRender` idiom). No consumer exists to update.

## Verify by hand

- No live app consumer today. If reused: build a form with `FormField` +
  `FormControl render={<Input/>}`; confirm label association, aria-invalid, and
  validation messages wire up.

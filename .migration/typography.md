# typography

2026-07-05 — transformation engine (custom component, no golden pair),
progressive/coexistence mode. Clean.

Project layout note: Radix wrappers stay in `@/components/ui`; migrated Base UI
wrappers are written to `@/components/base/ui`.

## Changed

- `src/components/base/ui/typography.tsx` (new). This is the project's own
  `Prose`/`ProseMono`/`Code` module (not a stock shadcn component). Only Radix
  usage was `Slot` for `Prose`'s `asChild`. Migrated the manual Slot idiom to
  `useRender` + `mergeProps` (`useRender.ComponentProps<"div">`, `render` prop,
  data-\* object literal cast to `React.ComponentProps<"div">`). `ProseMono` and
  `Code` are unchanged.
- Consumers repointed `@/components/ui/typography` -> `@/components/base/ui/typography`
  (pure import swap; no consumer used `asChild` on `Prose`):
  `src/app/(app)/(docs)/blog/[slug]/page.tsx`,
  `src/app/(app)/(docs)/components/[slug]/page.tsx`,
  `src/features/portfolio/components/hello.tsx`,
  `src/features/portfolio/components/projects/project-item.tsx`,
  `src/features/portfolio/components/education/education-item.tsx`,
  `src/features/portfolio/components/experiences/experience-position-item.tsx`,
  `src/features/portfolio/components/awards/award-item.tsx`,
  `src/features/doc/components/type-table.tsx`,
  `src/components/mdx.tsx`, `src/components/component-preview.tsx`.

Leftover scan clean: `grep -n "radix-ui\|@radix-ui" src/components/base/ui/typography.tsx` -> none.

## Left alone

- `src/components/ui/typography.tsx` (Radix `Slot` original, kept for coexistence).

## Behavior changes

- `Prose` API change: `asChild` prop removed in favor of `render`. No consumer
  used `asChild`, so no call site changed. Any future polymorphic usage must use
  `render={<El/>}` instead of `asChild`.

## Verify by hand

- Render a blog post and a component doc page; confirm prose typography (headings,
  lists, code blocks, links) is unchanged in light + dark.

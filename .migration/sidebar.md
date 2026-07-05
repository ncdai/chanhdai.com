# sidebar

2026-07-05 — transformation engine (classes preserved, primitives rewired),
progressive/coexistence mode. Clean. Migrated last (depends on button, separator,
sheet, tooltip).

Project layout note: Radix wrappers stay in `@/components/ui`; migrated Base UI
wrappers are written to `@/components/base/ui`.

## Changed

- `src/components/base/ui/sidebar.tsx` (new). Radix usage was only `Slot` (5
  `asChild` sites). Each `const Comp = asChild ? Slot.Root : "tag"` -> `useRender`
  - `mergeProps` with the correct `defaultTagName`:
    `SidebarGroupLabel` (div), `SidebarGroupAction` (button),
    `SidebarMenuAction` (button), `SidebarMenuSubButton` (a), and `SidebarMenuButton`
    (button) whose internal `TooltipTrigger asChild` -> `render={button}`.
    Dependency imports repointed to base: `Button`, `Separator`, `Sheet*`,
    `Tooltip*` -> `@/components/base/ui/*`. Non-Radix deps `Input` and `Skeleton`
    intentionally stay on `@/components/ui/*` (not Radix, out of scope).
- `src/app/(preview)/components/block-viewer.tsx`: import repoint
  `@/components/ui/sidebar` -> `@/components/base/ui/sidebar`. No `asChild` on
  sidebar parts (it already used `render` for the collapsible trigger from prior
  in-progress work), so no call-site change beyond the import.

Leftover scan clean: `grep -n "radix-ui\|@radix-ui" src/components/base/ui/sidebar.tsx` -> none.

## Left alone

- `src/components/ui/sidebar.tsx` (Radix original, kept for coexistence).
- `Input` (`@/components/ui/input`) and `Skeleton` (`@/components/ui/skeleton`) —
  not Radix, deliberately untouched.

## Behavior changes

- All `asChild` sidebar props are now `render` (Base UI `useRender`). The one live
  consumer already used `render`, so nothing broke.
- Mobile sidebar now uses the Base UI dialog-based sheet (see sheet.md).

## Verify by hand

- In the block viewer file tree: expand/collapse folders, click files to switch
  the active file, and confirm the collapsed-state tooltips on menu buttons appear
  on the right. On a narrow viewport, open/close the mobile sidebar sheet.

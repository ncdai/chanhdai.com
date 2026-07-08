# Plan 009: Fix `src/lib/blocks.ts` — drop stray `"use server"`, NaN-safe sort, add tests

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 07c2d2fe..HEAD -- src/lib/blocks.ts`
> If the file changed since this plan was written, compare the "Current
> state" excerpts against the live code before proceeding; on a mismatch,
> treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `07c2d2fe`, 2026-07-07

## Why this matters

`src/lib/blocks.ts` opens with a file-level `"use server"`, which turns its
three exported data helpers into publicly callable server actions (POST
endpoints) even though every caller is a server component or build script.
The payload is public registry metadata, so nothing leaks today — but the
directive creates an unintended public RPC surface that would silently expose
anything a future edit reads here. Separately, the block sort comparator
calls `new Date(a.meta?.createdAt).getTime()`; when a block item lacks
`meta.createdAt` (the schema allows it), that yields `NaN` and the comparator
returns `NaN`, producing unstable, implementation-defined ordering of the
blocks listing. Both fixes are small; the tests pin the behavior.

## Current state

- `src/lib/blocks.ts` — the whole file is 75 lines. Line 1 is the directive:

  ```ts
  "use server"

  import { registryItemSchema } from "shadcn/schema"
  import type { z } from "zod"

  import { blockCategories } from "@/config/registry"
  ```

  Exports: `getAllBlockStaticParams()` (lines 8–28), `getAllBlockIds(types,
categories)` (30–36), `getAllBlocks(types, categories)` (38–74). All load
  the registry via `await import("@/registry/__index__")`.

  The sort at lines 69–73:

  ```ts
  .sort((a, b) => {
    const dateA = new Date(a.meta?.createdAt).getTime()
    const dateB = new Date(b.meta?.createdAt).getTime()
    return dateB - dateA
  })
  ```

- Callers of `@/lib/blocks` (all server-side; verified 2026-07-07):
  - `src/app/sitemap.ts`
  - `src/app/(app)/(blocks)/blocks/(list)/[category]/page.tsx`
  - `src/app/(app)/(blocks)/blocks/(view)/[category]/[name]/page.tsx`
  - `src/scripts/build-registry.mts` (build-time, via Bun)

  None of these files begins with `"use client"` — re-verify in Step 1.

- Test conventions: Vitest, node environment, files matched by
  `src/**/*.test.ts` (`vitest.config.ts`), `@` alias resolves to `src`.
  Structural exemplar: `src/utils/url.test.ts` — plain
  `describe`/`it`/`expect` imported from `vitest`, table-of-cases style.

## Commands you will need

| Purpose   | Command            | Expected on success      |
| --------- | ------------------ | ------------------------ |
| Tests     | `pnpm test:run`    | all pass                 |
| Lint      | `pnpm lint`        | exit 0                   |
| Build     | `pnpm build`       | exit 0                   |
| Typecheck | `pnpm check-types` | exit 0 — run AFTER build |

If `pnpm build` fails fetching GitHub contributions, export
`GITHUB_CONTRIBUTIONS_API_URL=https://github-contributions-api.jogruber.de`
(public value from `.env.example`).

## Scope

**In scope** (the only files you should modify):

- `src/lib/blocks.ts`
- `src/lib/blocks.test.ts` (create)

**Out of scope** (do NOT touch):

- `src/registry/__index__.tsx` — generated; the tests import it read-only.
- The three caller pages/sitemap — no signature changes are made, so they
  need no edits.
- `src/lib/registry.ts` — related but covered by plan 011.

## Git workflow

- Branch: `advisor/009-blocks-lib-fixes`
- One commit, e.g. `fix(blocks): remove use server directive and make block sort date-safe`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Confirm no client-side callers

```bash
grep -rln "lib/blocks" src --include="*.ts" --include="*.tsx" --include="*.mts" | xargs head -3
```

**Verify**: none of the listed files starts with `"use client"`. If one
does, STOP — removing `"use server"` would break a client call site.

### Step 2: Remove the directive and make the sort NaN-safe

In `src/lib/blocks.ts`:

1. Delete line 1 (`"use server"`) and the blank line after it if doubled.
2. Extract the comparator as a named export so it is testable, and give
   missing dates a stable fallback of `0` (missing-date blocks sink to the
   end of the newest-first list):

   ```ts
   type DatedBlock = { meta?: { createdAt?: string } & Record<string, unknown> }

   export function compareBlocksByCreatedAtDesc(a: DatedBlock, b: DatedBlock) {
     const dateA = a.meta?.createdAt ? new Date(a.meta.createdAt).getTime() : 0
     const dateB = b.meta?.createdAt ? new Date(b.meta.createdAt).getTime() : 0
     return dateB - dateA
   }
   ```

   and replace the inline `.sort((a, b) => { ... })` with
   `.sort(compareBlocksByCreatedAtDesc)`. Keep the exact registry-item type
   used by the file if it types more cleanly than the structural type above —
   the load-bearing part is the `? ... : 0` fallback.

   (Exporting a sync function is only legal once `"use server"` is gone —
   that ordering is why this is one step.)

**Verify**: `pnpm lint` → exit 0.

### Step 3: Add tests

Create `src/lib/blocks.test.ts`, modeled on `src/utils/url.test.ts`. Cover:

1. `compareBlocksByCreatedAtDesc` — newer date sorts before older; equal
   dates return 0; missing `meta`/`createdAt` never yields `NaN`
   (`expect(Number.isNaN(result)).toBe(false)`) and sorts after any dated
   block.
2. `getAllBlocks()` (default args, real registry index) — resolves to a
   non-empty array; every item has `type === "registry:block"`; the array is
   ordered non-increasing by `new Date(meta.createdAt).getTime()` treating
   missing dates as `0`.
3. `getAllBlockIds()` — returns the same names as `getAllBlocks()` mapped to
   `name`.

**Verify**: `pnpm test:run` → all pass, including the new file.

### Step 4: Full verification

```bash
pnpm lint && pnpm test:run && pnpm build && pnpm check-types
```

**Verify**: all exit 0. The build exercising `generateStaticParams` for the
blocks routes is the integration check that removing the directive broke
nothing.

## Test plan

Covered in Step 3 — new file `src/lib/blocks.test.ts`, three describe
blocks, at least 6 assertions, following the `src/utils/url.test.ts`
pattern. Regression pinned: the NaN comparator case.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `head -1 src/lib/blocks.ts` is NOT `"use server"`
- [ ] `grep -n "use server" src/lib/blocks.ts` → no matches
- [ ] `src/lib/blocks.test.ts` exists; `pnpm test:run` exits 0
- [ ] `pnpm build` and `pnpm check-types` exit 0
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- Any importer of `lib/blocks` is a client component (Step 1).
- The build fails at the blocks routes after removing the directive — the
  directive may have been load-bearing in a way this plan didn't predict;
  report the exact error.
- `getAllBlocks()` in the test returns an empty array (would mean the
  registry index shape drifted; the test assumptions are then wrong).

## Maintenance notes

- If a future feature needs a genuine server action around block data, put
  it in its own file with `"use server"` at the top of that file only.
- The `0` fallback means undated blocks list last; if that's ever wrong for
  a new block, the fix is to add `meta.createdAt` to the block's registry
  definition, not to change the comparator.
- Reviewer should scrutinize: no behavior change for fully-dated blocks
  (ordering identical before/after).

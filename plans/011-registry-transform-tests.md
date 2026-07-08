# Plan 011: Characterization tests for registry transforms + fix the generated lazy-factory bug

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 07c2d2fe..HEAD -- src/lib/registry.ts src/scripts/build-registry.mts`
> If either file changed since this plan was written, compare the "Current
> state" excerpts against the live code before proceeding; on a mismatch,
> treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `07c2d2fe`, 2026-07-07

## Why this matters

`src/lib/registry.ts` produces the file contents, install targets, and file
trees that this site publishes as its shadcn registry — the product external
users install with `npx shadcn add`. Its transforms (`fixImport`,
`getFileTarget`, `normalizeAliasTarget`, `createFileTreeForRegistryItemFiles`)
are pure string/tree functions with zero test coverage; a silent regression
ships broken components to every registry consumer. Additionally, the
registry generator has a real bug: it emits the literal text `item.name`
into the generated `__index__.tsx` where it meant to interpolate the item's
name, so the generated lazy-loader references an out-of-scope variable — a
guaranteed `ReferenceError` on the (currently rare) fallback path. This plan
pins current behavior with characterization tests and fixes the generator.

## Current state

- `src/lib/registry.ts` — 233 lines, transforms for serving registry items:
  - `fixImport(content)` (line 90, exported) — regex-rewrites `@/…/{components,ui,hooks,lib}/x` import paths:

    ```ts
    export function fixImport(content: string) {
      const regex = /@\/(.+?)\/((?:.*?\/)?(?:components|ui|hooks|lib))\/([\w-]+)/g
    ```

  - `fixFilePaths(files)` (line 115, NOT exported) — re-bases paths relative
    to the first file's directory and computes `target` per file.
  - `getFileTarget(file)` (line 133, NOT exported) — derives install target
    from file type when `target` is empty; otherwise delegates to
    `normalizeAliasTarget`.
  - `normalizeAliasTarget(target)` (line 164, NOT exported) — maps
    `@components/…`, `@ui/…`, `@hooks/…`, `@lib/…` aliases to real paths.
  - `createFileTreeForRegistryItemFiles(files)` (line 194, exported) —
    builds a nested `FileTree` from `target ?? path` strings.

- `src/scripts/build-registry.mts` — Bun script that generates
  `src/registry/__index__.tsx`. The bug, lines 83–86 (inside a template
  literal that writes the generated file):

  ```ts
  component: React.lazy(async () => {
    const mod = await import("@/${item.files[0].path.replace("src/", "")}")
    const exportName = Object.keys(mod).find(key => typeof mod[key] === 'function' || typeof mod[key] === 'object') || item.name
    return { default: mod.default || mod[exportName] }
  }),
  ```

  On line 85, `|| item.name` sits inside the emitted string — the generated
  file at `src/registry/__index__.tsx` literally contains `|| item.name`
  (verify: `grep -c "|| item.name" src/registry/__index__.tsx` → 103). In
  the generated scope there is no `item` binding, so if a module ever
  exports no function/object, evaluating the fallback throws
  `ReferenceError: item is not defined` instead of using the item's name.
  The fix is to interpolate: `|| "${item.name}"`.

- Generated outputs (`src/registry/__index__.tsx`,
  `src/registry/transformed/`, `public/r/*.json`, `registry.json`) are
  NEVER edited by hand — they regenerate via `pnpm registry:build`.

- Test conventions: Vitest, node env, `src/**/*.test.ts`, `@` alias → `src`.
  Structural exemplar: `src/utils/url.test.ts` (plain `describe`/`it`/
  `expect` from `vitest`). Note `src/utils/registry.test.ts` already exists
  and covers a DIFFERENT module (`src/utils/registry.ts`) — do not touch it;
  name the new file `src/lib/registry.test.ts`.

## Commands you will need

| Purpose        | Command                  | Expected on success         |
| -------------- | ------------------------ | --------------------------- |
| Tests          | `pnpm test:run`          | all pass                    |
| Lint           | `pnpm lint`              | exit 0                      |
| Registry build | `pnpm registry:build`    | exit 0, regenerates outputs |
| Registry check | `pnpm registry:validate` | exit 0                      |
| Build          | `pnpm build`             | exit 0                      |
| Typecheck      | `pnpm check-types`       | exit 0 — run AFTER build    |

If `pnpm build` fails fetching GitHub contributions, export
`GITHUB_CONTRIBUTIONS_API_URL=https://github-contributions-api.jogruber.de`
(public value from `.env.example`).

## Scope

**In scope** (the only files you should modify):

- `src/lib/registry.ts` — ONLY to add `export` keywords to `fixFilePaths`,
  `getFileTarget`, `normalizeAliasTarget` (no logic changes)
- `src/lib/registry.test.ts` (create)
- `src/scripts/build-registry.mts` — the one-character-class fix on line 85
- Regenerated outputs of `pnpm registry:build` (expected diff:
  `src/registry/__index__.tsx` changes on every `|| item.name` line)

**Out of scope** (do NOT touch):

- Any logic change to the transforms — this plan PINS current behavior,
  even where it looks odd. If a transform's actual output looks like a bug,
  record it in your report; do not "fix" it.
- `src/utils/registry.ts` / `src/utils/registry.test.ts` — different module.
- `shadcn build` config, `components.json`, `_registry.ts` definitions.

## Git workflow

- Branch: `advisor/011-registry-transform-tests`
- Two commits: `fix(registry): interpolate item name in generated lazy factory`
  then `test(registry): characterize import and target transforms`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Fix the generator and regenerate

In `src/scripts/build-registry.mts` line 85, change the emitted fallback
from `|| item.name` to `|| "${item.name}"` (so the generated file contains
the item's name as a string literal). Then:

```bash
pnpm registry:build
```

**Verify**:

```bash
grep -c "|| item.name" src/registry/__index__.tsx   # → 0
grep -c '|| "' src/registry/__index__.tsx            # → 103 (one per entry)
pnpm registry:validate                               # exit 0
```

### Step 2: Export the private transforms

In `src/lib/registry.ts`, add `export` to the declarations of
`fixFilePaths`, `getFileTarget`, and `normalizeAliasTarget`. No other
changes.

**Verify**: `pnpm lint` → exit 0.

### Step 3: Capture actual behavior, then write the tests

These are characterization tests: the expected values are whatever the
current code returns. First observe, then pin. To observe, run one-off
snippets with vitest or `bun`:

```bash
bun -e "import { fixImport } from './src/lib/registry.ts'; console.log(fixImport(\"import { X } from '@/registry/components/foo/bar'\"))"
```

Create `src/lib/registry.test.ts` (model after `src/utils/url.test.ts`)
covering at least:

- `fixImport`: an `@/registry/components/...` path; an `@/registry/ui/...`
  path; an `@/registry/hooks/...` path; an `@/registry/lib/...` path; a
  string with no matching import (returned unchanged); a line with two
  matches (global regex applies to both).
- `getFileTarget`: one file per type with an empty `target`
  (`registry:component`, `registry:ui`, `registry:hook`, `registry:lib`,
  `registry:block`), and one file with an explicit `@lib/...` target
  (delegates to `normalizeAliasTarget`).
- `normalizeAliasTarget`: `@components/x`, `@ui/x`, `@hooks/x`, `@lib/x`,
  and a non-alias target returned unchanged.
- `fixFilePaths`: two files in sibling directories — paths re-based against
  the first file's directory; empty/undefined files → `[]`.
- `createFileTreeForRegistryItemFiles`: files sharing a directory produce
  one folder node with two children; a `target` takes precedence over
  `path`.

Pin the OBSERVED outputs, not what you assume the regex does — the
`fixImport` regex has subtle capture behavior and the observed value is the
contract.

**Verify**: `pnpm test:run` → all pass, including ≥15 new assertions in
`src/lib/registry.test.ts`.

### Step 4: Full verification

```bash
pnpm lint && pnpm test:run && pnpm build && pnpm check-types && pnpm registry:validate
```

**Verify**: all exit 0. `git status` shows only in-scope files plus
regenerated outputs.

## Test plan

Covered in Step 3 — `src/lib/registry.test.ts`, five describe blocks
characterizing the transform surface. These become the safety net for any
future refactor of the registry serving path (including the long-standing
idea of replacing regex transforms with AST-based ones).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `grep -c "|| item.name" src/registry/__index__.tsx` → 0
- [ ] `src/lib/registry.test.ts` exists; `pnpm test:run` exits 0
- [ ] `pnpm registry:validate` exits 0
- [ ] `pnpm build` and `pnpm check-types` exit 0
- [ ] `git status` shows no modified files outside scope + regenerated outputs
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `pnpm registry:build` produces changes beyond the `|| item.name` lines in
  `__index__.tsx` (plus timestamps the script normally rewrites) — the
  generator may have drifted; diff and report.
- Exporting the three functions causes a name collision or type error
  elsewhere.
- An observed transform output in Step 3 looks like a genuine defect (e.g.
  `fixImport` corrupting a path) — pin it anyway ONLY if it matches what
  production currently serves; report the defect separately rather than
  changing behavior in this plan.

## Maintenance notes

- These tests pin CURRENT behavior. When someone intentionally changes a
  transform (e.g. the planned regex→AST migration in
  `src/lib/remark-component.ts`'s TODO), updating these expectations is part
  of that change — the tests make the diff visible, which is the point.
- The generator fix means a registry module with no function/object export
  now falls back to the item name instead of crashing; if that fallback path
  ever renders, the underlying item probably has a packaging mistake worth
  investigating.
- Natural follow-up (deferred): the same characterization treatment for the
  MDX plugins (`src/lib/rehype-npm-command.ts` first — it rewrites install
  commands in every doc).

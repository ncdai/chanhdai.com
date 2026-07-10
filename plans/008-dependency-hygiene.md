# Plan 008: Remove unused `react-use` and upgrade `@c15t/nextjs` to 2.x (supersedes plan 005)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat a6628079..HEAD -- package.json src/registry/components/consent-manager/`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: none (plan 007 was REJECTED 2026-07-10 — PostHog and the
  site-mounted consent banner were removed from the codebase entirely, not
  wired up; see the 2026-07-10 reconcile note below)
- **Category**: migration
- **Planned at**: commit `07c2d2fe`, 2026-07-07; refreshed at commit
  `a6628079`, 2026-07-10 (drift: `src/components/consent-manager-client.tsx`
  no longer exists — deleted as part of the PostHog removal; `posthog-js`
  dropped from `package.json`; `next`/`tailwindcss`/etc. patch-bumped —
  none of that affects this plan's targets)

## Why this matters

`pnpm audit --prod` reported 45 advisories (2 critical, 17 high) on
2026-07-07; re-run 2026-07-10 shows **33 advisories (2 critical, 17 high, 14
moderate)** — the drop is unrelated cleanup, not this plan. **Every
critical/high advisory still arrives through exactly two dependencies**:
`@c15t/nextjs@^1.8.3` (prototype pollution in `@orpc/client` — critical;
arbitrary code execution in `protobufjs` — critical; plus SQL injection in
`typeorm` and ~15 more high via grpc/kysely/drizzle/ws/defu transitive
chains) and `react-use@^17.6.0` (high, via `js-cookie`). `react-use` is
still not imported anywhere in `src` — removing it is free. `@c15t/nextjs`
has a 2.1.0 release available (one major ahead); its transitive tree is
where the rest of the noise comes from. Its integration surface shrank since
this plan was first written: the site no longer mounts a consent banner
(plan 007 was rejected, not implemented), so `@c15t/nextjs` is now used
_only_ by the registry's `ConsentManager` component — a product this site
ships to external users via `npx shadcn add consent-manager`, not by the
site itself.

## Current state

- `package.json` — `"react-use": "^17.6.0"` and `"@c15t/nextjs": "^1.8.3"`
  in `dependencies` (confirmed unchanged 2026-07-10).
- `react-use` usage: **zero imports** in `src` (re-verified 2026-07-10 with
  `grep -rn "react-use" src --include="*.ts" --include="*.tsx"` → no matches).
- `@c15t/nextjs` importers (re-verified 2026-07-10 with
  `grep -rln "@c15t/nextjs" src --include="*.ts" --include="*.tsx"`):
  - `src/registry/components/consent-manager/consent-manager.tsx` — imports
    `ConsentManagerDialog`, `ConsentManagerProvider`, `CookieBanner` from
    `@c15t/nextjs`; passes `options={{ mode: "offline", consentCategories:
["necessary", "measurement"] }}` and extensive `theme` objects to the
    banner and dialog.
  - `src/registry/components/_registry.ts` — registers the item (no c15t
    import itself, just wires the component into the registry).
  - `src/registry/transformed/components/consent-manager/**` and
    `public/r/consent-manager.json` are AUTO-GENERATED mirrors — never edit
    them by hand; they regenerate via `pnpm registry:build`.
  - **No importer remains under `src/app/` or `src/components/`** — there is
    no site-mounted consent banner. `grep -rln "ConsentManager\|consent-manager"
src/app` returns nothing (verified 2026-07-10). The upgrade must be
    verified through the registry item's own preview route
    (`/preview/consent-manager`, per the standard registry preview pattern —
    confirm the slug matches `src/registry/components/_registry.ts` before
    relying on it), not a site-wide smoke check.

Repo conventions: pnpm with `--frozen-lockfile` in CI (so `pnpm-lock.yaml`
changes here are expected and must be committed); conventional commits.

## Commands you will need

| Purpose        | Command                  | Expected on success       |
| -------------- | ------------------------ | ------------------------- |
| Install        | `pnpm install`           | exit 0                    |
| Audit          | `pnpm audit --prod`      | see per-step expectations |
| Lint           | `pnpm lint`              | exit 0                    |
| Build          | `pnpm build`             | exit 0                    |
| Typecheck      | `pnpm check-types`       | exit 0 — run AFTER build  |
| Tests          | `pnpm test:run`          | all pass                  |
| Registry check | `pnpm registry:validate` | exit 0                    |

If `pnpm build` fails fetching GitHub contributions, export
`GITHUB_CONTRIBUTIONS_API_URL=https://github-contributions-api.jogruber.de`
(public value from `.env.example`).

## Scope

**In scope** (the only files you should modify):

- `package.json`, `pnpm-lock.yaml`
- `src/registry/components/consent-manager/consent-manager.tsx` (2.x API
  adjustments if needed)
- `src/registry/components/_registry.ts` — ONLY if the consent-manager
  registry entry pins a c15t version range that must move to 2.x
- Auto-regenerated outputs of `pnpm registry:build`
  (`registry.json`, `src/registry/__index__.tsx`, `src/registry/transformed/`,
  `public/r/*.json`) — regenerate, never hand-edit

**Out of scope** (do NOT touch):

- `src/app/layout.tsx` — the site does not mount a consent banner; do not
  add one as part of this plan (that would be re-litigating the rejected
  plan 007, a product decision for the maintainer, not a dependency bump).
- Any other dependency bump — no drive-by upgrades of Next, React, visx, etc.
- Moderate/low advisories that remain after this plan — report, don't chase.

## Git workflow

- Branch: `advisor/008-dependency-hygiene`
- Two commits: `chore(deps): remove unused react-use` and
  `chore(deps): upgrade @c15t/nextjs to 2.x`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Remove `react-use`

```bash
grep -rn "react-use" src --include="*.ts" --include="*.tsx"
```

Expected: no matches. Then remove the `"react-use"` line from
`package.json` dependencies and run `pnpm install`.

**Verify**: `pnpm lint && pnpm test:run` → exit 0, and
`pnpm audit --prod 2>&1 | grep -c "js-cookie"` → `0`.

### Step 2: Upgrade `@c15t/nextjs` to 2.x

```bash
pnpm add @c15t/nextjs@^2.1.0
```

Then confirm the imports used by this repo still exist in 2.x:

```bash
node -e "const m = require('@c15t/nextjs'); console.log(['ConsentManagerProvider','CookieBanner','ConsentManagerDialog'].map(k => k + ':' + typeof m[k]).join('\n'))"
node -e "const m = require('@c15t/nextjs/client'); console.log('ClientSideOptionsProvider:' + typeof m.ClientSideOptionsProvider)"
```

If any of those come back `undefined`, check the package's exports and
CHANGELOG in `node_modules/@c15t/nextjs` for the renamed equivalent. Apply
ONLY mechanical renames (import name, prop name). If the 2.x API changed
structurally (different provider composition, changed `options`/`theme`
shape that produces type errors you cannot resolve with a rename), STOP.

**Verify**: `pnpm build` → exit 0, `pnpm check-types` → exit 0.

### Step 3: Regenerate the registry and validate

```bash
pnpm registry:build && pnpm registry:validate
```

**Verify**: both exit 0. `git status` shows changes only in generated paths
(`registry.json`, `src/registry/__index__.tsx`, `src/registry/transformed/`,
`public/r/`) plus your in-scope source files.

### Step 4: Re-audit and smoke-check

```bash
pnpm audit --prod 2>&1 | tail -3
```

Record the new totals in your report. Expected: critical count drops (the
two criticals were in c15t 1.x's tree); if criticals remain via
`@c15t/nextjs` 2.x, record them — that is a report finding, not a failure.

Then `pnpm dev` and load `/preview/consent-manager` (the registry item's own
preview route — confirm the exact path by checking how other
`registry:component` items are served under `src/app/(preview)/preview/[name]`
if the slug doesn't resolve) with a cleared profile: the cookie banner still
renders, and accepting/rejecting/opening the customize dialog works. This is
the only runtime surface for this component now that no site page mounts it.
If you cannot drive a browser, flag this for manual QA in your report.

## Test plan

No new unit tests: the change is dependency surface, covered by the existing
suite plus build/typecheck/registry validation. The consent banner smoke
check in Step 4 is the behavioral gate.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `grep -c "react-use" package.json` → 0
- [ ] `grep -n "@c15t/nextjs" package.json` shows a `^2.x` range
- [ ] `pnpm audit --prod 2>&1 | grep -c "js-cookie"` → 0
- [ ] `pnpm lint`, `pnpm test:run`, `pnpm build`, `pnpm check-types`,
      `pnpm registry:validate` all exit 0
- [ ] Audit totals (before → after) recorded in the report and in the
      status row
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The 2.x exports differ beyond mechanical renames (Step 2).
- `pnpm install` or the build fails due to a peer-dependency conflict
  between `@c15t/nextjs@2.x` and Next 16 / React 19.2.7.
- The banner renders broken (unstyled/missing) after the upgrade — the
  `theme` keys in `consent-manager.tsx` may have changed in 2.x; report the
  diff rather than restyling.

## Maintenance notes

- The consent-manager registry item ships to external users; its 2.x
  compatibility is part of the published product. Reviewer should check
  `public/r/consent-manager.json` regenerated with the new dependency range.
- Remaining moderate/low advisories after this plan are accepted noise until
  the next audit; do not chase them piecemeal.
- Supersedes `plans/005-dependency-advisories.md` (written 2026-06-14
  against an older advisory set).

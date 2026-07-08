# Plan 008: Remove unused `react-use` and upgrade `@c15t/nextjs` to 2.x (supersedes plan 005)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 07c2d2fe..HEAD -- package.json src/components/consent-manager-client.tsx src/registry/components/consent-manager/`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/007-wire-consent-gating.md (so the upgraded consent
  API is exercised by mounted UI you can verify)
- **Category**: migration
- **Planned at**: commit `07c2d2fe`, 2026-07-07

## Why this matters

`pnpm audit --prod` reports 45 advisories (2 critical, 17 high). Audited on
2026-07-07, **every critical/high advisory arrives through exactly two
dependencies**: `@c15t/nextjs@^1.8.3` (prototype pollution in `@orpc/client` —
critical; arbitrary code execution in `protobufjs` — critical; plus ~15 high
via grpc/kysely/drizzle/ws/defu transitive chains) and `react-use@^17.6.0`
(high, via `js-cookie`). `react-use` is not imported anywhere in `src` —
removing it is free. `@c15t/nextjs` has a 2.1.0 release available (one major
ahead); its transitive tree is where the rest of the noise comes from, and
its integration surface in this repo is small (two files).

## Current state

- `package.json` — `"react-use": "^17.6.0"` and `"@c15t/nextjs": "^1.8.3"`
  in `dependencies`.
- `react-use` usage: **zero imports** in `src` (verified 2026-07-07 with
  `grep -rn "react-use" src --include="*.ts" --include="*.tsx"` → no matches).
- `@c15t/nextjs` importers (app code):
  - `src/components/consent-manager-client.tsx` — imports
    `ClientSideOptionsProvider` from `@c15t/nextjs/client`; calls
    `posthog.opt_in_capturing()`/`opt_out_capturing()` in `onConsentSet`
    based on `preferences.measurement`.
  - `src/registry/components/consent-manager/consent-manager.tsx` — imports
    `ConsentManagerDialog`, `ConsentManagerProvider`, `CookieBanner` from
    `@c15t/nextjs`; passes `options={{ mode: "offline", consentCategories:
["necessary", "measurement"] }}` and extensive `theme` objects to the
    banner and dialog.
  - `src/registry/transformed/components/consent-manager/**` and
    `public/r/consent-manager.json` are AUTO-GENERATED mirrors — never edit
    them by hand; they regenerate via `pnpm registry:build`.
- After plan 007, the consent manager is mounted in `src/app/layout.tsx`, so
  a dev-server smoke check exercises the real API.

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
- `src/components/consent-manager-client.tsx` (2.x API adjustments if needed)
- `src/registry/components/consent-manager/consent-manager.tsx` (2.x API
  adjustments if needed)
- `src/registry/components/_registry.ts` — ONLY if the consent-manager
  registry entry pins a c15t version range that must move to 2.x
- Auto-regenerated outputs of `pnpm registry:build`
  (`registry.json`, `src/registry/__index__.tsx`, `src/registry/transformed/`,
  `public/r/*.json`) — regenerate, never hand-edit

**Out of scope** (do NOT touch):

- `src/app/layout.tsx` and `src/instrumentation-client.ts` (plan 007's work)
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

Then `pnpm dev` and load the site with a cleared profile: the cookie banner
(mounted by plan 007) still renders, and accepting/rejecting works. If you
cannot drive a browser, flag this for manual QA in your report.

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

- Plan 007 has not landed (no `ConsentManager` in `src/app/layout.tsx`) —
  the upgrade would then be unverifiable at runtime; report and ask whether
  to proceed anyway.
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

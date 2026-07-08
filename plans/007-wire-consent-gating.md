# Plan 007: Mount the consent manager and gate PostHog capture behind consent

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 07c2d2fe..HEAD -- src/instrumentation-client.ts src/components/consent-manager-client.tsx src/app/layout.tsx src/registry/components/consent-manager/consent-manager.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `07c2d2fe`, 2026-07-07

## Why this matters

The site initializes PostHog analytics unconditionally on every client page
load, with no consent prompt and no opt-out path. The consent infrastructure
already exists in the repo — a styled `@c15t` cookie banner/dialog
(`ConsentManager`) and a client callback bridge that opts PostHog in/out
(`ConsentManagerClient`) — but **neither is rendered anywhere**. The result is
a GDPR/ePrivacy consent-gating gap for EU visitors, and dead code that clearly
records the author's intent to have consent gating. This plan mounts the
existing pieces and defaults PostHog to opted-out until the visitor grants
`measurement` consent.

## Current state

Relevant files:

- `src/instrumentation-client.ts` — the only PostHog init; runs on every page
  load when the token env var is set. Full current content:

  ```ts
  import posthog from "posthog-js"

  if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      defaults: "2026-01-30",
    })
  }
  ```

- `src/components/consent-manager-client.tsx` — defined but **never imported
  anywhere** (verify with the grep in Step 1). It wraps children in c15t's
  `ClientSideOptionsProvider` and calls `posthog.opt_in_capturing()` /
  `posthog.opt_out_capturing()` from the `onConsentSet` callback based on
  `preferences.measurement`.

- `src/registry/components/consent-manager/consent-manager.tsx` — a complete,
  site-styled `ConsentManager` component (published as a registry item, but
  it is normal in-repo source and importable by the site). It renders
  `ConsentManagerProvider` (with `mode: "offline"` and
  `consentCategories: ["necessary", "measurement"]`), `CookieBanner`,
  `ConsentManagerDialog`, and `{children}`.

- `src/app/layout.tsx` — root layout. The body currently renders (lines
  160–164):

  ```tsx
  <body>
    <Providers>
      <NuqsAdapter>{children}</NuqsAdapter>
    </Providers>
  </body>
  ```

  The head/body also loads Google AdSense (when `NEXT_PUBLIC_ADSENSE_CLIENT`
  is set) and `GoogleTagManager` (when `NEXT_PUBLIC_GTM_ID` is set) — both
  are OUT OF SCOPE here (see Scope).

- `package.json` — `@c15t/nextjs` is pinned at `^1.8.3`. This plan works
  against the 1.x API that the two existing components already use. Do NOT
  upgrade c15t in this plan (that is plan 008).

Repo conventions: TypeScript strict, kebab-case filenames, no emojis, no
comments explaining "what". Client components start with `"use client"`.

## Commands you will need

| Purpose    | Command            | Expected on success                            |
| ---------- | ------------------ | ---------------------------------------------- |
| Install    | `pnpm install`     | exit 0                                         |
| Lint       | `pnpm lint`        | exit 0                                         |
| Build      | `pnpm build`       | exit 0 (also regenerates registry)             |
| Typecheck  | `pnpm check-types` | exit 0 — run AFTER build (needs `.next/types`) |
| Tests      | `pnpm test:run`    | all pass                                       |
| Dev server | `pnpm dev`         | serves on the printed localhost URL            |

Note: `pnpm build` prerenders the homepage, which fetches GitHub
contributions; if the build fails with an invalid-URL error, export
`GITHUB_CONTRIBUTIONS_API_URL=https://github-contributions-api.jogruber.de`
first (public, non-secret value from `.env.example`).

## Scope

**In scope** (the only files you should modify):

- `src/app/layout.tsx` — mount the consent components
- `src/instrumentation-client.ts` — default capture to opted-out
- `src/components/consent-manager-client.tsx` — only if a minimal adjustment
  is required to compose with the provider (see Step 2)

**Out of scope** (do NOT touch, even though they look related):

- Gating GoogleTagManager or AdSense behind consent — a product decision for
  the maintainer; note it in your report, don't implement it.
- `src/registry/components/consent-manager/**` — published registry source;
  changing it alters what users install.
- Upgrading `@c15t/nextjs` (plan 008).
- `src/lib/events.ts`, `src/lib/openpanel.ts` — OpenPanel consent gating is a
  follow-up decision, not this plan.

## Git workflow

- Branch: `advisor/007-wire-consent-gating`
- Commit style: conventional commits, matching repo history (e.g.
  `feat(consent): mount consent manager and gate PostHog capture`)
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Confirm the components are currently unmounted

Run:

```bash
grep -rn "ConsentManagerClient" src --include="*.tsx" --include="*.ts"
grep -rn "consent-manager/consent-manager" src/app src/components --include="*.tsx"
```

**Verify**: the first grep returns ONLY the definition file
`src/components/consent-manager-client.tsx`; the second returns nothing. If
either is already mounted somewhere, STOP (the work may have landed already).

### Step 2: Mount the consent provider and client bridge in the root layout

In `src/app/layout.tsx`, import both components and wrap the body content:

```tsx
import { ConsentManagerClient } from "@/components/consent-manager-client"
import { ConsentManager } from "@/registry/components/consent-manager/consent-manager"
```

Target body shape:

```tsx
<body>
  <ConsentManager>
    <ConsentManagerClient>
      <Providers>
        <NuqsAdapter>{children}</NuqsAdapter>
      </Providers>
    </ConsentManagerClient>
  </ConsentManager>
</body>
```

Composition note: `ConsentManagerClient` renders c15t's
`ClientSideOptionsProvider`, which must sit INSIDE `ConsentManagerProvider`
(which `ConsentManager` renders). If the 1.8.x types reject this nesting
(check `node_modules/@c15t/nextjs` exports and types if unsure), that is a
STOP condition — report what the actual composition API looks like.

**Verify**: `pnpm lint` → exit 0. Then `pnpm dev`, open the site in a browser
with a fresh profile (or after `localStorage.clear()` + clearing cookies):
the cookie banner renders. If you cannot drive a browser in your environment,
run `pnpm build` (exit 0) and flag the banner check as needing manual QA in
your report.

### Step 3: Default PostHog to opted-out until consent

In `src/instrumentation-client.ts`, add one option to the existing init:

```ts
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: "2026-01-30",
  opt_out_capturing_by_default: true,
})
```

Do not restructure the file otherwise. The opt-in happens via the existing
`onConsentSet` callback in `consent-manager-client.tsx` when
`preferences.measurement` is true.

**Verify**: `pnpm build` → exit 0, then `pnpm check-types` → exit 0.

### Step 4: Full verification pass

```bash
pnpm lint && pnpm test:run && pnpm build && pnpm check-types
```

**Verify**: all exit 0. Runtime behavior to verify in a browser (or hand to
manual QA): with a fresh profile, no `posthog` capture requests fire before
consent; after accepting, capture requests fire; after rejecting, they don't.

## Test plan

No new unit tests — this is wiring of third-party providers whose behavior
is exercised at runtime, not unit-testable in the node Vitest environment.
The regression gate is the full command pass in Step 4 plus the manual
banner/capture checklist. (If a browser-driving tool such as Puppeteer is
available — it is a devDependency — a smoke script that loads the page and
asserts the banner element exists is a welcome bonus, not a requirement.)

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `grep -c "ConsentManagerClient" src/app/layout.tsx` ≥ 1 and
      `grep -c "ConsentManager" src/app/layout.tsx` ≥ 2
- [ ] `grep -n "opt_out_capturing_by_default" src/instrumentation-client.ts` → 1 match
- [ ] `pnpm lint`, `pnpm test:run`, `pnpm build`, `pnpm check-types` all exit 0
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The greps in Step 1 show the consent components are already mounted.
- `ClientSideOptionsProvider` cannot legally nest inside
  `ConsentManagerProvider` on `@c15t/nextjs` 1.8.x (type error or runtime
  error) — report the actual API shape you found.
- The cookie banner renders but breaks layout/interaction on the homepage
  (z-index/overlay conflicts with existing UI).
- Fixing anything appears to require editing files under
  `src/registry/components/consent-manager/` or gating GTM/AdSense.

## Maintenance notes

- Plan 008 upgrades `@c15t/nextjs` to 2.x; whoever executes it must re-verify
  this wiring (banner renders, opt-in/out callbacks still fire).
- GTM and AdSense still load unconditionally; if the maintainer wants full
  consent coverage, they need Google Consent Mode wiring — deferred
  deliberately.
- OpenPanel (`op.track` in `src/lib/events.ts`) is not consent-gated by this
  plan; `trackEvent` calls will still reach OpenPanel. PostHog events stop
  because the SDK itself drops captures while opted out.
- Reviewer should scrutinize: the provider nesting order in `layout.tsx` and
  that `suppressHydrationWarning`/theme scripts in `<head>` are untouched.

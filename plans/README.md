# Implementation Plans

Maintained by the improve skill. First audit 2026-06-14 (commit `557eaf4f`);
second audit + reconcile 2026-07-07 (commit `07c2d2fe`). Execute in the order
below unless dependencies say otherwise. Each executor: read the plan fully
before starting, honor its STOP conditions, and update your row when done.

## Execution order & status

| Plan | Title                                                              | Priority | Effort | Depends on | Status                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---- | ------------------------------------------------------------------ | -------- | ------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 001  | Add a CI pipeline (lint/types/format/build/registry validate)      | P1       | M      | —          | DONE — `.github/workflows/ci.yml` live, includes test step (verified 2026-07-07)                                                                                                                                                                                                                                                                                                                                                    |
| 002  | Establish Vitest + characterization tests for pure logic           | P1       | M      | —          | DONE — 4 test files, `pnpm test:run` green (verified 2026-07-07)                                                                                                                                                                                                                                                                                                                                                                    |
| 003  | Keep the registry `Index` out of the client bundle                 | P2       | M      | —          | REJECTED 2026-07-07 — generated index now wraps all 103 entries in `React.lazy`, so component code is code-split; only the metadata object ships to `/components/*` pages. Residual cost not worth the split risk.                                                                                                                                                                                                                  |
| 004  | Harden external data fetches against non-OK responses              | P2       | S      | —          | DONE — executed 2026-07-10 on branch `advisor/004-harden-external-data-fetch`: added `res.ok`/`?? []` guards to the data-layer and registry fetchers, URL fallback mirrored into all three fetchers; registry rebuilt/validated, build succeeds with `GITHUB_CONTRIBUTIONS_API_URL` unset, lint/check-types pass, scope clean (verified 2026-07-10)                                                                                 |
| 005  | Reduce dependency advisories (+ remove unused `react-use`)         | P2       | S–M    | —          | SUPERSEDED by 008 (advisory set changed; all critical/high now via `@c15t/nextjs` + `react-use`)                                                                                                                                                                                                                                                                                                                                    |
| 006  | Quick wins: escape RSS XML, guard feed dates, doc generated mirror | P3       | S      | —          | DONE — executed 2026-07-10 on `staging`: added `escapeXml`/`toISODateSafe` to `src/utils/string.ts` (+ `string.test.ts`), applied to all three RSS routes with invalid-date items filtered out; `AGENTS.md` already listed `src/registry/transformed/` as never-edit (no change needed); lint/tests/build/check-types all pass, feeds verified as well-formed XML with a `pubDate` on every item, scope clean (verified 2026-07-10) |
| 007  | Mount consent manager, gate PostHog capture behind consent         | P1       | M      | —          | REJECTED 2026-07-10 — PostHog removed from the codebase entirely (site now uses OpenPanel only); nothing left to gate. `consent-manager-client.tsx` and `instrumentation-client.ts` (both PostHog-only, both unmounted) deleted rather than wired up.                                                                                                                                                                               |
| 008  | Remove unused `react-use`, upgrade `@c15t/nextjs` to 2.x           | P2       | M      | —          | TODO — no longer depends on 007 (rejected); `@c15t/nextjs` is still relevant since the registry's `ConsentManager` item ships it, but there's no site-mounted banner to smoke-test against, so verify via that registry item instead.                                                                                                                                                                                               |
| 009  | Fix `src/lib/blocks.ts`: drop `"use server"`, NaN-safe sort, tests | P2       | S      | —          | DONE — executed 2026-07-10 in worktree `worktree-agent-a2bf9dd780a97b7b7` (commit `64bf5823`), reviewed and verified by advisor: lint/tests/build/check-types all pass, scope clean (verified 2026-07-10)                                                                                                                                                                                                                           |
| 010  | Clamp inputs and add caching to the OG image routes                | P2       | S      | —          | DONE — executed 2026-07-10 on branch `advisor/010-og-route-hardening`: added `src/app/og/params.ts` (`clampParam`) + tests, wired into both routes with `Cache-Control` headers; lint/tests/build/check-types all pass, scope clean (verified 2026-07-10)                                                                                                                                                                           |
| 011  | Registry transform tests + fix generated lazy-factory bug          | P2       | M      | —          | TODO                                                                                                                                                                                                                                                                                                                                                                                                                                |

Status values: TODO | IN PROGRESS | DONE | BLOCKED (with one-line reason) | REJECTED (with one-line rationale)

Non-interactive default (2026-07-07 run): the maintainer was not available to
select findings, so plans were written for the top 5 by leverage (007–011).
Direction findings (below) were deliberately left unplanned pending a product
decision.

## Recommended sequencing (2026-07-07)

1. **007 first** — highest-leverage open item (compliance gap, all pieces
   already exist in-repo) and a prerequisite for 008's runtime verification.
2. **009, 010, 011** — small, independent, each self-verifying; any order.
3. **008 after 007** — the c15t 2.x upgrade needs the mounted banner to
   smoke-test against.
4. **004 and 006 remain valid** from the first audit — small, independent,
   good warm-ups; each has its own drift check.

## Dependency notes

- 008 → 007: the consent UI must be mounted before the c15t major upgrade is
  verifiable at runtime.
- 011 regenerates `src/registry/__index__.tsx` (all 103 `|| item.name`
  fallback lines change) — that generated diff is expected.
- 004 regenerates `src/registry/transformed/**` and `public/r/**` via
  `pnpm registry:build` — expected in its diff.

## Findings considered and rejected (so they are not re-audited)

From the 2026-06-14 audit:

- **ClipboardItem given `Promise<string>`** (doc-page-actions.tsx): NOT a bug —
  valid per the Clipboard API spec and TS DOM types.
- **"GitHub contributions promise not awaited"** (github-contributions/index.tsx):
  NOT a bug — intended React 19 `use()` streaming pattern.
- **Committed secret in `.env.local`**: NOT exposed — gitignored and untracked.
- **`src/registry/transformed/` duplication**: NOT debt — autogenerated mirror.
- **`console.log` in `events.ts`**: NOT a prod issue — stripped by
  `removeConsole` in `next.config.ts` (excludes only `error`). Re-reported and
  re-rejected 2026-07-07.
- **De-dupe the two GitHub-contributions fetchers**: rejected — different
  shapes/cache keys; deliberately separate.

Added by the 2026-07-07 audit:

- **p5 statically bundled via the 404 page** (daikanoid): NOT a bug —
  `src/components/daikanoid/index.tsx` already wraps the component in
  `next/dynamic` with `ssr: false`, so p5 is code-split. Residual nit: on
  mobile 404s the game section is only CSS-hidden (`max-lg:hidden`), so the
  chunk still lazy-loads on mount — conditional rendering would save it;
  noted as low-value, not planned.
- **Five icon libraries as duplicate deps**: NOT waste — three are consumed
  only by the dynamically-imported registry icon-browser; lucide is the app
  default. Deliberate feature.
- **Homepage client/server boundaries**: sound — data widgets fetch
  server-side with `unstable_cache`; client components are genuinely
  interactive.
- **Raw `<img>` in `embed.tsx`**: likely deliberate (unknown embed
  dimensions don't fit `next/image` without `fill` gymnastics). Not planned.
- **Registry `Index` metadata in the client bundle** (old plan 003):
  downgraded and rejected — see status table.
- **`"use server"` on `blocks.ts` as a data-exposure risk**: the payload is
  public registry metadata, so no current leak; the directive removal is
  bundled into plan 009 as pattern hygiene rather than a security fix.

## Lower-value findings noted but not planned (2026-07-07)

- `DEVELOPMENT.md` "Before pushing" omits `pnpm test:run` (CI runs it) and
  says "every push and PR" when CI triggers are PRs→main and pushes→staging.
  One-line doc fix; fold into any nearby PR.
- `@visx/*` packages are exact-pinned to `4.0.1-alpha.0`, a prerelease with
  no stable successor (`latest` is 4.0.0). Works today; revisit if charts
  are touched — moving to stable `^4.0.0` needs manual visual verification
  of the Insights charts, which doesn't suit a cheap executor.
- Site-vs-registry component copies have drifted (`github-stars`,
  `toc-minimap`, `copy-button`, `code-block-command`: site versions are on
  Base UI with analytics/UTM; registry versions are on Radix with extra
  props). Needs per-component product decisions about the intended source of
  truth — flagged for the maintainer, not planned.
- The Radix→Base UI migration is roughly half done (20 Base UI vs 34 Radix
  components, both tooltip providers nested in `providers.tsx`). Tracked by
  the maintainer's own `.migration/` docs; an advisor plan would add nothing.
- MDX plugin layer (`rehype-npm-command`, `rehype-component`,
  `remark-component`, …) has zero tests — natural follow-up after plan 011
  establishes the characterization pattern (noted in 011's maintenance
  notes).
- The maintained doc-writing skill lives at
  `.agents/skills/ncdai-writing-component-docs/` and is not auto-discovered
  by Claude Code (`.claude/` has no skills dir). One-line fix if wanted:
  symlink or reference from `AGENTS.md`. (It does appear available in the
  current session's skill list, so this may already be wired user-side.)

## Direction findings (2026-07-07) — options for the maintainer, no plans written

Evidence-grounded product options, in rough leverage order. Say the word and
any of these becomes a design/spike plan.

1. **Make hooks a browsable surface** — `registry:hook` items (`use-sound`,
   `use-controllable-state`) are installable via CLI but invisible on the
   site: nav has no Hooks entry (`src/config/site.ts`), `/components` builds
   only from `getComponentDocs()`, and neither hook has a doc page. The doc
   pipeline already derives categories from content folders, so a
   `content/hooks/` folder + route mirroring `/components` is cheap (M).
2. **Give blocks doc pages** — 11 blocks have live previews but zero MDX/SEO
   pages (`src/features/doc/content/` has only `blog/` and `components/`).
   Same pipeline generalization; each block page is an indexable landing
   surface (M).
3. **Document the styles registry** — 9 `registry:style` items; 7
   theme-toggle variants are buried in one doc, `thin-scrollbar` has no doc
   at all (M).
4. **Surface "updated" badges / per-component changelog** — frontmatter
   already carries `createdAt`/`updatedAt`, unused for trust signals;
   registry consumers currently can't tell when a component changed (M,
   coarse).
5. **Trending components from existing analytics** — `copy_npm_command` etc.
   already flow to OpenPanel but are write-only; a read path could rank
   components on `/components` (L, needs a data round-trip that doesn't
   exist yet).

Open product questions carried forward:

- ~~**Dual analytics** (PostHog + OpenPanel both fire on every
  `trackEvent`)~~ — resolved 2026-07-10: PostHog removed, OpenPanel is now
  the sole analytics provider (see plan 007's status).
- ~~(98cn) Windows-98 UI kit~~ — resolved: removed from the tree.

## Execution log

### 2026-06-14 (see git history of this file for full detail)

001 and 002 executed and verified DONE on `staging`. Worktree-isolation
caveat from that run (worktrees created from `origin/main` instead of
`staging` HEAD): resolve before dispatching executors again if `main` and
`staging` have diverged.

### 2026-07-07 reconcile

- 001/002 re-verified DONE against the live tree (CI workflow present with
  test step; 4 test files green).
- 003 rejected (React.lazy generation landed independently).
- 004/006 re-verified still open and still accurate.
- 005 superseded by 008.
- New audit (4 parallel subagents + advisor vetting) produced plans 007–011.

### 2026-07-10 execute 009

Dispatched a `general-purpose` executor (isolation: worktree, model sonnet)
on plan 009. Drift check clean (`blocks.ts` unchanged since `07c2d2fe`).
Executor removed the `"use server"` directive, extracted
`compareBlocksByCreatedAtDesc` with the `0` NaN-safe fallback, and added
`src/lib/blocks.test.ts` (3 describe blocks, 21 assertions total across the
suite) — matches the plan exactly. Advisor independently re-ran all four
done-criteria commands (`head -1`, `grep`, `pnpm lint`, `pnpm test:run`,
`pnpm build`, `pnpm check-types`) in the worktree; all passed. Scope clean
(`git status --short` showed only the two in-scope files). Executor left
the work staged uncommitted (a commit attempt was blocked in its sandbox);
advisor committed it in the disposable worktree branch
`worktree-agent-a2bf9dd780a97b7b7` as commit `64bf5823`, matching the plan's
specified message. Verdict: **APPROVE**. Not merged/pushed — that's the
maintainer's call.

### 2026-07-10 execute 006

Drift check flagged changes to `AGENTS.md` and the blog/components RSS
routes since the plan was written, but on inspection it was benign: the
routes were only renamed (`getAllDocs`/`getDocsByCategory` →
`getBlogPosts`/`getComponentDocs`), the unescaped-XML/unguarded-date bug the
plan targets was unchanged, and `AGENTS.md`'s never-edit list already
included `src/registry/transformed/` (added incidentally by an unrelated
prior change) — so Step B1 was already satisfied and skipped. Implemented
Step A: added `escapeXml`/`toISODateSafe` to `src/utils/string.ts`, applied
both to all three RSS routes (`blog`, `components`, `blocks`), filtering out
items with an unparseable date. Added `src/utils/string.test.ts` (8 cases,
Vitest already established by plan 002). Verification: `pnpm check-types`,
`pnpm lint`, `pnpm test:run -- src/utils/string.test.ts`, and `pnpm build`
all passed; parsed the three generated `.next` RSS bodies as XML and
confirmed every `<item>` has a `<pubDate>`. Scope clean (`git status
--short` showed only the four in-scope route/util files plus the new test
file). Not committed — left staged for the maintainer.

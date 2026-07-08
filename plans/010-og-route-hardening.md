# Plan 010: Clamp inputs and add caching to the OG image routes

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 07c2d2fe..HEAD -- src/app/og/`
> If anything under `src/app/og/` changed since this plan was written,
> compare the "Current state" excerpts against the live code before
> proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `07c2d2fe`, 2026-07-07

## Why this matters

The two OG image routes accept raw query strings (`title`, `description`,
`domain`, …) with no length limit and render them into 1200x630 PNGs via
Satori on every request — there is no `Cache-Control` header and no segment
cache config, so repeated hits re-do font layout + PNG encoding each time.
That means (1) anyone can cheaply burn serverless CPU by hammering the
endpoints with varying params, and (2) the site's trusted origin will render
arbitrary attacker-chosen text into official-looking branded images. Length
clamps plus CDN caching keep first-party usage identical while capping both
abuse vectors.

## Current state

- `src/app/og/simple/route.tsx` — 91 lines. Reads params at lines 13–17:

  ```tsx
  export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    const title = searchParams.get("title")
    const description = searchParams.get("description")
  ```

  Returns `new ImageResponse(<div tw="...">…{title}…{description}…</div>,
{ width: 1200, height: 630, fonts: [...] })`. No `revalidate`, `dynamic`,
  or `Cache-Control` anywhere in the file (verified by grep 2026-07-07).

- `src/app/og/domain/route.tsx` — same pattern with `domain` (and `sale`)
  params.

- First-party callers build these URLs in page `metadata` (grep
  `og/simple|og/domain` across `src` to see them; they pass page titles and
  descriptions — realistic first-party values are well under 200
  characters).

- `ImageResponse` (from `next/og`) accepts standard `ResponseInit` fields in
  its second argument, including `headers`.

- Test conventions: Vitest node environment, `src/**/*.test.ts`, exemplar
  `src/utils/url.test.ts`.

## Commands you will need

| Purpose   | Command            | Expected on success      |
| --------- | ------------------ | ------------------------ |
| Tests     | `pnpm test:run`    | all pass                 |
| Lint      | `pnpm lint`        | exit 0                   |
| Build     | `pnpm build`       | exit 0                   |
| Typecheck | `pnpm check-types` | exit 0 — run AFTER build |
| Dev       | `pnpm dev`         | serves locally           |

If `pnpm build` fails fetching GitHub contributions, export
`GITHUB_CONTRIBUTIONS_API_URL=https://github-contributions-api.jogruber.de`
(public value from `.env.example`).

## Scope

**In scope** (the only files you should modify):

- `src/app/og/params.ts` (create — shared clamp helper)
- `src/app/og/params.test.ts` (create)
- `src/app/og/simple/route.tsx`
- `src/app/og/domain/route.tsx`

**Out of scope** (do NOT touch):

- The JSX/visual design of either image — text content changes only via
  clamping.
- Pages that build OG URLs — their inputs are already short; no call-site
  changes.
- Rate limiting / WAF — infrastructure concern, note in report if desired.

## Git workflow

- Branch: `advisor/010-og-route-hardening`
- One commit, e.g. `fix(og): clamp query params and cache generated images`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add the clamp helper

Create `src/app/og/params.ts`:

```ts
export function clampParam(
  value: string | null,
  maxLength: number,
  fallback = ""
) {
  if (!value) {
    return fallback
  }
  const trimmed = value.trim()
  return trimmed.length > maxLength
    ? `${trimmed.slice(0, maxLength - 1)}…`
    : trimmed
}
```

**Verify**: `pnpm lint` → exit 0.

### Step 2: Use it in both routes and add cache headers

In `src/app/og/simple/route.tsx`:

```tsx
import { clampParam } from "../params"

const title = clampParam(searchParams.get("title"), 160)
const description = clampParam(searchParams.get("description"), 320)
```

Keep the existing conditional rendering semantics: `description` is
currently truthiness-checked (`{description && ...}`), and `clampParam`
returns `""` for null, so the falsy behavior is preserved. `title` was
previously `string | null` rendered directly; empty string renders the same
blank. In `src/app/og/domain/route.tsx`, clamp `domain` to 120 and apply the
same treatment to its other string params (read the file; `sale` is a flag —
leave non-text params as they are).

Add headers to every `new ImageResponse(...)` call's options object in both
routes:

```tsx
{
  width: 1200,
  height: 630,
  fonts: [...],
  headers: {
    "Cache-Control": "public, max-age=3600, s-maxage=31536000, immutable",
  },
}
```

**Verify**: `pnpm build` → exit 0, `pnpm check-types` → exit 0.

### Step 3: Add tests for the helper

Create `src/app/og/params.test.ts` modeled on `src/utils/url.test.ts`:

- null → fallback (default `""`, and a custom fallback)
- short value passes through unchanged (after trim)
- value exactly at `maxLength` passes through
- value over `maxLength` is truncated to `maxLength` characters ending in `…`
- whitespace-padded value is trimmed

**Verify**: `pnpm test:run` → all pass including the new file.

### Step 4: Runtime check

```bash
pnpm dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/og/simple?title=hello"
curl -s -D - -o /dev/null "http://localhost:3000/og/simple?title=$(python3 -c 'print("a"*5000)')" | grep -i "cache-control\|HTTP/"
```

(Adjust the port to what `pnpm dev` prints.) **Verify**: both requests
return 200; the response headers include the `Cache-Control` value from
Step 2. Kill the dev server afterwards.

## Test plan

Covered in Step 3 — `src/app/og/params.test.ts`, ≥5 cases pinning the clamp
behavior. The image routes themselves are covered by the build (they compile
and prerender-check) plus the Step 4 curl checks.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `grep -n "clampParam" src/app/og/simple/route.tsx src/app/og/domain/route.tsx` → ≥1 match in each
- [ ] `grep -n "Cache-Control" src/app/og/simple/route.tsx src/app/og/domain/route.tsx` → ≥1 match in each
- [ ] `pnpm lint`, `pnpm test:run`, `pnpm build`, `pnpm check-types` all exit 0
- [ ] Step 4 curls return 200 with the cache header
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `ImageResponse` rejects the `headers` option (type error) — report the
  actual option shape available in this Next version instead of working
  around it.
- Any first-party OG URL builder passes a param longer than the clamp
  values (grep before assuming) — raise the limit rather than truncating
  real titles, and say so.
- `src/app/og/domain/route.tsx` structure differs materially from
  `simple/route.tsx` (extra params/branches not described here).

## Maintenance notes

- The `s-maxage=31536000, immutable` means a given param combination is
  cached at the CDN for up to a year; if the OG design changes, cached
  images persist until the URL changes — bump a `v=` param in the URL
  builders if a visual refresh must propagate immediately.
- If new OG routes are added later, they should import `clampParam` and set
  the same cache header; reviewer should watch for that in future PRs.
- Deliberately deferred: request rate limiting (platform-level concern) and
  an HMAC-signed params scheme (overkill for a portfolio site today).

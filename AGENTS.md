# AI agent guidelines for chanhdai.com

Next.js 16 (App Router) portfolio, blog, and shadcn registry website.

**Stack**: TypeScript, React 19, Tailwind CSS v4, shadcn/ui, MDX, Vitest, pnpm (Bun for scripts), Vercel

## Project structure

| Directory                              | Purpose                                                    |
| -------------------------------------- | ---------------------------------------------------------- |
| `src/app/`                             | App Router pages, layouts, API routes                      |
| `src/components/`                      | Shared UI components                                       |
| `src/registry/`                        | Registry source (components, hooks, blocks, examples, lib) |
| `src/features/`                        | Feature modules: `doc`, `blog`, `portfolio`, `sponsor`     |
| `src/config/`                          | Site (`site.ts`), registry (`registry.ts`), JSON-LD config |
| `src/scripts/`                         | Build scripts (registry, icons, capture) run with Bun      |
| `src/hooks/`, `src/lib/`, `src/utils/` | Hooks, libraries, utilities                                |

**Key files**: `components.json` (shadcn config), `src/features/portfolio/data/` (portfolio data), `.env.example` (env vars)

## Component registry

Built on shadcn/ui. Registry types and their definition files:

| Type                 | File                                   |
| -------------------- | -------------------------------------- |
| `registry:component` | `src/registry/components/_registry.ts` |
| `registry:hook`      | `src/registry/hooks/_registry.ts`      |
| `registry:block`     | `src/registry/blocks/_registry.ts`     |
| `registry:example`   | `src/registry/examples/_registry.ts`   |
| `registry:lib`       | `src/registry/lib/_registry.ts`        |
| `registry:style`     | `src/registry/styles/_registry.ts`     |

**NEVER EDIT** auto-generated outputs of `pnpm registry:build`: `registry.json`, `registry-stats.json`, `src/registry/__index__.tsx`, `src/registry/transformed/`, `public/r/*.json`

### Adding a new component

1. Create component in `src/registry/components/[name]/`
2. Register in the appropriate `_registry.ts` file
3. Create example in `src/registry/examples/`
4. Run `pnpm registry:build`
5. Add docs MDX in `src/features/doc/content/components/` (category is derived from the folder)

## Content system

All content lives in `src/features/doc/content/` as MDX files, split into `blog/` and `components/`. The category is derived from the immediate subfolder name (not declared in frontmatter), so a file's location determines whether it's a blog post or component doc.

- **Data layer**: `src/features/doc/data/documents.ts` (`getAllDocs`, `getDocBySlug`, `getDocsByCategory`)
- **Blog UI**: `src/features/blog/` (rendering only, imports data from `features/doc`)

## Coding guidelines

- TypeScript strict mode; explicit types when necessary
- kebab-case file naming
- Descriptive names; comments only for "why", not "what"
- No emojis in code, comments, or commit messages
- Tailwind CSS v4 syntax; support dark/light modes
- Follow SOLID principles
- Headings in sentence-case (capitalize only the first word and proper nouns), applies to Markdown/MDX docs and prose

## Commands

```bash
pnpm dev                # Dev server
pnpm build              # Production build (runs registry:build first)
pnpm test               # Vitest (watch)
pnpm test:run           # Vitest (single run)
pnpm lint               # ESLint
pnpm lint:fix           # ESLint with --fix
pnpm format:write       # Prettier
pnpm check-types        # Type checking (tsc --noEmit)
pnpm registry:build     # Build shadcn registry (Bun script + shadcn build)
pnpm registry:validate  # Validate generated registry.json
pnpm icons:build        # Build registry icons
```

### Local dev URL

A dev server is usually already running behind `https://ncdai.localhost` (see `allowedDevOrigins` in `next.config.ts` and `NEXT_PUBLIC_APP_URL` in `.env.local`). Use that origin to test pages and routes, never `http://localhost:3000` or a raw port. It also makes generated absolute URLs match what the code produces.

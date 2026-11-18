import { LICENSE, SOURCE_CODE_GITHUB_URL } from "@/config/site"
import type { BuildInfo } from "@/lib/build-info"
import { getBuildInfo, getStack } from "@/lib/build-info"
import { cn } from "@/lib/utils"
import { SiteFooterInteractiveLogotype } from "@/components/site-footer-brand"
import { SOCIAL } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

// Imported here rather than through `@/config/site`, which client components
// pull in, to keep the manifest out of client bundles.
import packageJson from "../../package.json"
// Precomputed by `pnpm registry:build`, so the count costs no registry import.
import registryStats from "../../registry-stats.json"
import { ChanhDaiSignature } from "./chanhdai-signature"

const INSPIRED_BY = [
  "Tailwind CSS",
  "shadcn/ui",
  "Vercel",
  "Apple",
  "Evil Charts",
  "Devouring Details",
  "Skiper UI",
  "Making Software",
  "shadcncraft",
]

const OPENPANEL_URL =
  "https://openpanel.dev?utm_source=chanhdai.com&utm_medium=referral&utm_campaign=footer"

// Not derived from `SITE_INFO.url`: that follows `NEXT_PUBLIC_APP_URL` and
// would read `ncdai.localhost` in dev.
const SITE_TITLE = "chanhdai.com"

const SITE_SUBTITLE = packageJson.description

export function SiteFooterCad() {
  const xLink = SOCIAL.x
  const githubLink = SOCIAL.github
  const linkedinLink = SOCIAL.linkedin

  const build = getBuildInfo()
  const stack = getStack()

  return (
    <footer className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto border-x border-x-line group-has-data-[slot=layout-wide]/layout:container md:max-w-3xl">
        <div className="screen-line-top screen-line-bottom before:z-1">
          <div className="stripe-divider h-12" />
        </div>

        <div className="relative">
          <div className="screen-line-bottom flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 px-4 py-3">
            <span className="text-3xl/none font-medium text-background [-webkit-text-stroke:1px_var(--foreground)] [paint-order:stroke_fill]">
              {SITE_TITLE}
            </span>
            <span className="text-sm text-muted-foreground">
              {SITE_SUBTITLE}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-px bg-line font-mono md:grid-cols-4">
            <Field label="Crafted by">
              <a
                className="link-underline"
                href={xLink.href}
                target="_blank"
                rel="noopener"
              >
                {xLink.handle}
              </a>
            </Field>

            <Field label="Build">
              <BuildValue build={build} />
            </Field>

            <Field label="Date">
              <time dateTime={build.date}>{build.date}</time>
            </Field>

            <Field label="Registry">{registryStats.total} items</Field>

            <Field label="Deployed on">
              <span className="font-sans" aria-hidden>
                ▲
              </span>
              <span className="sr-only">Vercel</span>
            </Field>

            <Field label="Source code">
              <a
                className="link-underline"
                href={SOURCE_CODE_GITHUB_URL}
                target="_blank"
                rel="noopener"
              >
                GitHub
              </a>
            </Field>

            <Field label="License">
              <a
                className="link-underline"
                href={LICENSE.url}
                target="_blank"
                rel="noopener"
              >
                {LICENSE.name}
              </a>
            </Field>

            <Field label="Typeface">
              <a
                className="link-underline"
                href="https://vercel.com/font"
                target="_blank"
                rel="noopener"
              >
                Geist
              </a>
            </Field>

            <Field className="col-span-2" label="Stack">
              <ul className="flex flex-col gap-1">
                {stack.map(({ name, version }) => (
                  <li key={name}>
                    {name}@{version}
                  </li>
                ))}
              </ul>
            </Field>

            <Field label="Analytics">
              <a
                className="link-underline"
                href={OPENPANEL_URL}
                target="_blank"
                rel="noopener"
              >
                OpenPanel
              </a>
            </Field>

            <Field label="For agents">
              <ul className="flex flex-col gap-1">
                <li>
                  <a
                    className="link-underline"
                    href="/llms.txt"
                    target="_blank"
                    rel="noopener"
                  >
                    llms.txt
                  </a>
                </li>
                <li>
                  <a
                    className="link-underline"
                    href="/index.md"
                    target="_blank"
                    rel="noopener"
                  >
                    index.md
                  </a>
                </li>
              </ul>
            </Field>

            <Field className="col-span-2" label="Inspired by">
              <ol className="-mx-4 grid grid-cols-2 gap-x-px gap-y-1">
                {INSPIRED_BY.map((name) => (
                  <li className="px-4" key={name}>
                    {name}
                  </li>
                ))}
              </ol>
            </Field>

            <Field label="Links">
              <ul className="flex flex-col gap-1">
                <li>
                  <a
                    className="link-underline"
                    href={xLink.href}
                    target="_blank"
                    rel="noopener"
                  >
                    X
                  </a>
                </li>
                <li>
                  <a
                    className="link-underline"
                    href={githubLink.href}
                    target="_blank"
                    rel="noopener"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    className="link-underline"
                    href={linkedinLink.href}
                    target="_blank"
                    rel="noopener"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </Field>

            <Field label="Approved by">
              <div className="flex h-full flex-col justify-end gap-2">
                <ChanhDaiSignature className="w-36 max-w-full self-start text-blue-900 dark:text-foreground" />
                <span className="border-t border-line pt-2 font-sans text-sm/none font-medium tracking-wide uppercase">
                  {USER.displayName}
                </span>
              </div>
            </Field>
          </dl>
        </div>
      </div>

      <SiteFooterInteractiveLogotype />

      <div className="h-(--fade-bottom-height)" />
      <div className="pb-[env(safe-area-inset-bottom,0)]" />
    </footer>
  )
}

function BuildValue({ build }: { build: BuildInfo }) {
  if (!build.commitShortSha) {
    return <span className="text-muted-foreground">unavailable</span>
  }

  return (
    <>
      {build.commitUrl ? (
        <a
          className="link-underline"
          href={build.commitUrl}
          target="_blank"
          rel="noopener"
        >
          {build.commitShortSha}
        </a>
      ) : (
        build.commitShortSha
      )}

      {build.environment !== "production" && (
        <span className="text-muted-foreground">
          {" "}
          ({build.environment === "development" ? "local" : build.environment})
        </span>
      )}
    </>
  )
}

function Field({
  className,
  label,
  children,
}: {
  className?: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1 bg-background px-4 py-3",
        className
      )}
    >
      <dt className="text-[0.625rem]/4 font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="flex-1 text-sm">{children}</dd>
    </div>
  )
}

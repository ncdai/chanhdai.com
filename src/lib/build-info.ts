import { SOURCE_CODE_GITHUB_URL } from "@/config/site"
import { USER } from "@/features/portfolio/data/user"

import packageJson from "../../package.json"

/**
 * Reads the Vercel deployment environment variables, which are server-side
 * only — do not import this from a client component. Set them in `.env.local`
 * to exercise the non-development rendering.
 */

const SHORT_SHA_LENGTH = 7

export type BuildEnvironment = "production" | "preview" | "development"

export type BuildInfo = {
  commitShortSha: string | null
  /** Null while running locally, where HEAD is often unpushed. */
  commitUrl: string | null
  environment: BuildEnvironment
  /** YYYY-MM-DD, in the site owner's time zone. */
  date: string
}

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: USER.timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

/** Stamped by `next.config.ts` at build time. */
const BUILD_DATE = dateFormatter.format(
  process.env.BUILD_TIMESTAMP
    ? new Date(process.env.BUILD_TIMESTAMP)
    : new Date()
)

function resolveEnvironment(): BuildEnvironment {
  const vercelEnv = process.env.VERCEL_ENV
  return vercelEnv === "production" || vercelEnv === "preview"
    ? vercelEnv
    : "development"
}

export function getBuildInfo(): BuildInfo {
  const environment = resolveEnvironment()
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA

  return {
    commitShortSha: commitSha?.slice(0, SHORT_SHA_LENGTH) ?? null,
    commitUrl:
      commitSha && environment !== "development"
        ? `${SOURCE_CODE_GITHUB_URL}/commit/${commitSha}`
        : null,
    environment,
    date: BUILD_DATE,
  }
}

const STACK_DEPENDENCIES = ["next", "react", "tailwindcss"]

const declaredVersions: Record<string, string | undefined> = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
}

/** The stack in npm spec form: `["next@16.3.0", …]`. */
export function getStack(): string[] {
  return STACK_DEPENDENCIES.flatMap((dependency) => {
    // Drops the range prefix, so `^4.3.3` reads as a version.
    const version = declaredVersions[dependency]?.replace(/^[^\d]*/, "")
    return version ? [`${dependency}@${version}`] : []
  })
}

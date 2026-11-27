import fs from "node:fs/promises"
import path from "node:path"

import { GITHUB_USERNAME } from "@/config/site"
import { NPM_PACKAGES } from "@/features/portfolio/data/numbers"

const OUTPUT_PATH = path.join(
  process.cwd(),
  "src/features/portfolio/data/numbers.json"
)

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} from ${url}`)
  }

  return (await res.json()) as T
}

const GITHUB_STARS_QUERY = `
  query ($login: String!, $after: String) {
    user(login: $login) {
      repositories(
        ownerAffiliations: OWNER
        isFork: false
        privacy: PUBLIC
        first: 100
        after: $after
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          stargazerCount
        }
      }
    }
  }
`

type GitHubStarsResponse = {
  data?: {
    user: {
      repositories: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null }
        nodes: { stargazerCount: number }[]
      }
    } | null
  }
  errors?: { message: string }[]
}

/** Forks are excluded because their stars belong to the upstream project. */
async function fetchGitHubStars(): Promise<number> {
  if (!process.env.GITHUB_API_TOKEN) {
    throw new Error("GITHUB_API_TOKEN is not set")
  }

  let total = 0
  let after: string | null = null

  do {
    const json: GitHubStarsResponse = await fetchJson(
      "https://api.github.com/graphql",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: GITHUB_STARS_QUERY,
          variables: { login: GITHUB_USERNAME, after },
        }),
      }
    )

    // GraphQL reports failures with a 200 status, so `ok` alone is not enough.
    const repositories = json.data?.user?.repositories
    if (!repositories) {
      throw new Error(json.errors?.[0]?.message ?? "GitHub user not found")
    }

    for (const repo of repositories.nodes) {
      total += repo.stargazerCount
    }

    after = repositories.pageInfo.hasNextPage
      ? repositories.pageInfo.endCursor
      : null
  } while (after)

  return total
}

const DAY_MS = 24 * 60 * 60 * 1000

/** npm silently clamps ranges longer than 18 months. */
const NPM_RANGE_DAYS = 365

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

async function fetchNpmPackageDownloads(name: string): Promise<number> {
  const { time } = await fetchJson<{ time: { created: string } }>(
    `https://registry.npmjs.org/${name}`
  )

  const today = new Date()
  const ranges: string[] = []

  for (
    let start = new Date(time.created);
    start <= today;
    start = new Date(start.getTime() + NPM_RANGE_DAYS * DAY_MS)
  ) {
    const end = new Date(
      Math.min(start.getTime() + (NPM_RANGE_DAYS - 1) * DAY_MS, today.getTime())
    )
    ranges.push(`${toIsoDate(start)}:${toIsoDate(end)}`)
  }

  const counts = await Promise.all(
    ranges.map((range) =>
      fetchJson<{ downloads: number }>(
        `https://api.npmjs.org/downloads/point/${range}/${name}`
      )
    )
  )

  return counts.reduce((total, { downloads }) => total + downloads, 0)
}

/** Requested per package because the bulk endpoint rejects scoped names. */
async function fetchNpmDownloads(): Promise<number> {
  const counts = await Promise.all(NPM_PACKAGES.map(fetchNpmPackageDownloads))

  NPM_PACKAGES.forEach((name, i) => {
    console.log(`  ${name}: ${counts[i]}`)
  })

  return counts.reduce((total, downloads) => total + downloads, 0)
}

/** OpenPanel has no all-time range, so count from the day tracking began. */
const OPENPANEL_START_DATE = "2026-01-24"

async function fetchPageViews(): Promise<number> {
  const { OPENPANEL_PROJECT_ID, OPENPANEL_CLIENT_ID, OPENPANEL_CLIENT_SECRET } =
    process.env

  if (
    !OPENPANEL_PROJECT_ID ||
    !OPENPANEL_CLIENT_ID ||
    !OPENPANEL_CLIENT_SECRET
  ) {
    throw new Error("OPENPANEL_* credentials are not set")
  }

  const params = new URLSearchParams({
    range: "custom",
    startDate: OPENPANEL_START_DATE,
    endDate: toIsoDate(new Date()),
  })

  const json = await fetchJson<{ summary: { total_screen_views: number } }>(
    `https://api.openpanel.dev/insights/${OPENPANEL_PROJECT_ID}/overview?${params}`,
    {
      headers: {
        "openpanel-client-id": OPENPANEL_CLIENT_ID,
        "openpanel-client-secret": OPENPANEL_CLIENT_SECRET,
      },
    }
  )

  return json.summary.total_screen_views
}

async function main() {
  const [githubStars, npmDownloads, pageViews] = await Promise.all([
    fetchGitHubStars(),
    fetchNpmDownloads(),
    fetchPageViews(),
  ])

  const numbers = {
    githubStars,
    npmDownloads,
    pageViews,
  }

  await fs.writeFile(
    OUTPUT_PATH,
    `${JSON.stringify(numbers, null, 2)}\n`,
    "utf8"
  )

  console.log(`GitHub stars: ${githubStars}`)
  console.log(`npm downloads (all time): ${npmDownloads}`)
  console.log(`Page views (all time): ${pageViews}`)
  console.log(`Wrote ${path.relative(process.cwd(), OUTPUT_PATH)}`)
}

main().catch((error) => {
  console.error("Error syncing numbers:", error)
  process.exit(1)
})

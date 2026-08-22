import { unstable_cache } from "next/cache"

import {
  fetchGitHubContributions,
  GitHubUserNotFoundError,
} from "@/lib/github-contributions"
import type { Activity } from "@/registry/components/contribution-graph"

// Mirrors github-contributions-api.jogruber.de so the two are interchangeable.
type ContributionsResponse = {
  total: Record<string, number>
  contributions: Activity[]
}

const GITHUB_USERNAME_PATTERN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i
const YEAR_PATTERN = /^\d{4}$/

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
}

const getCachedContributions = unstable_cache(
  async (username: string, years: number[]): Promise<ContributionsResponse> => {
    if (years.length === 0) {
      const { total, contributions } = await fetchGitHubContributions(username)
      return { total: { lastYear: total }, contributions }
    }

    const results = await Promise.all(
      years.map((year) =>
        fetchGitHubContributions(username, {
          from: new Date(Date.UTC(year, 0, 1)),
          to: new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)),
        })
      )
    )

    return results.reduce<ContributionsResponse>(
      (response, { total, contributions }, index) => ({
        total: { ...response.total, [years[index]]: total },
        contributions: [...response.contributions, ...contributions],
      }),
      { total: {}, contributions: [] }
    )
  },
  ["github-contributions-api"],
  { revalidate: 86400 } // Cache for 1 day (86400 seconds)
)

function parseYears(values: string[]): number[] | null {
  if (values.length === 0 || (values.length === 1 && values[0] === "last")) {
    return []
  }

  if (!values.every((value) => YEAR_PATTERN.test(value))) {
    return null
  }

  return [...new Set(values.map(Number))].sort()
}

export async function GET(
  request: Request,
  { params }: RouteContext<"/api/github-contributions/[username]">
) {
  const { username } = await params
  const { searchParams } = new URL(request.url)

  if (!GITHUB_USERNAME_PATTERN.test(username)) {
    return Response.json(
      { error: "Invalid GitHub username." },
      { status: 400, headers: HEADERS }
    )
  }

  const years = parseYears(searchParams.getAll("y"))
  if (years === null) {
    return Response.json(
      { error: 'Query "y" must be "last" or one or more four-digit years.' },
      { status: 400, headers: HEADERS }
    )
  }

  try {
    const data = await getCachedContributions(username, years)
    return Response.json(data, { headers: HEADERS })
  } catch (error) {
    if (error instanceof GitHubUserNotFoundError) {
      return Response.json(
        { error: error.message },
        { status: 404, headers: HEADERS }
      )
    }

    console.error(error)
    return Response.json(
      { error: `Failed to fetch contributions of "${username}".` },
      { status: 502, headers: HEADERS }
    )
  }
}

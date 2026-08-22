import "server-only"

import type { Activity } from "@/registry/components/contribution-graph"

const CONTRIBUTION_LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
} as const

type ContributionLevel = keyof typeof CONTRIBUTION_LEVELS

const CONTRIBUTION_CALENDAR_QUERY = /* GraphQL */ `
  query ContributionCalendar($login: String!, $from: DateTime, $to: DateTime) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`

type ContributionCalendarResponse = {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number
          weeks: Array<{
            contributionDays: Array<{
              date: string
              contributionCount: number
              contributionLevel: ContributionLevel
            }>
          }>
        }
      }
    } | null
  }
  errors?: Array<{ type?: string; message: string }>
}

export type GitHubContributions = {
  total: number
  contributions: Activity[]
}

export type GitHubContributionsRange = {
  from: Date
  to: Date
}

export class GitHubUserNotFoundError extends Error {
  constructor(username: string) {
    super(`GitHub user "${username}" not found.`)
    this.name = "GitHubUserNotFoundError"
  }
}

// Without `range`, GitHub returns the last year like the profile graph.
// Ranges longer than one year are rejected by GitHub.
export async function fetchGitHubContributions(
  username: string,
  range?: GitHubContributionsRange
): Promise<GitHubContributions> {
  const token = process.env.GITHUB_API_TOKEN
  if (!token) {
    throw new Error(
      "GITHUB_API_TOKEN is required to fetch GitHub contributions"
    )
  }

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CONTRIBUTION_CALENDAR_QUERY,
      variables: {
        login: username,
        from: range?.from.toISOString(),
        to: range?.to.toISOString(),
      },
    }),
  })

  if (!res.ok) {
    throw new Error(
      `GitHub GraphQL request failed: ${res.status} ${res.statusText}`
    )
  }

  const { data, errors } = (await res.json()) as ContributionCalendarResponse
  const calendar = data?.user?.contributionsCollection.contributionCalendar

  if (!calendar) {
    if (errors?.some((error) => error.type === "NOT_FOUND")) {
      throw new GitHubUserNotFoundError(username)
    }

    throw new Error(
      errors?.map((error) => error.message).join("; ") ||
        `No contribution calendar for "${username}"`
    )
  }

  return {
    total: calendar.totalContributions,
    contributions: calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: CONTRIBUTION_LEVELS[day.contributionLevel] ?? 0,
      }))
    ),
  }
}

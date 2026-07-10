import { unstable_cache } from "next/cache"
import {
  eachYearOfInterval,
  format,
  getYear,
  startOfYear,
  subDays,
} from "date-fns"

import { GITHUB_USERNAME } from "@/config/site"

import type { Activity } from "./activity-mosaic"
import { ActivityMosaicCover } from "./activity-mosaic-cover"

export async function ProfileActivityMosaicCover() {
  const rowCount = 10
  const columnCount = 48
  const cellCount = rowCount * columnCount
  const contributions = await getGitHubContributions(GITHUB_USERNAME, cellCount)

  return (
    <ActivityMosaicCover
      activities={contributions}
      rowCount={rowCount}
      columnCount={columnCount}
    />
  )
}

function getYearRange(daysBack: number, now: Date = new Date()): number[] {
  if (!Number.isInteger(daysBack) || daysBack < 0) {
    throw new RangeError(
      `daysBack must be a non-negative integer, received: ${daysBack}`
    )
  }

  const startDate: Date = subDays(now, daysBack)

  const years: number[] = eachYearOfInterval({
    start: startOfYear(startDate),
    end: startOfYear(now),
  }).map((date) => getYear(date))

  return years
}

function buildContributionGrid(
  activities: Activity[],
  cellCount: number
): Activity[] {
  const contributionsSortedByDate = [...activities].sort((a, b) =>
    b.date.localeCompare(a.date)
  )

  const today = format(new Date(), "yyyy-MM-dd")
  const todayIndex = contributionsSortedByDate.findIndex(
    (c) => c.date === today
  )

  return contributionsSortedByDate.slice(todayIndex, todayIndex + cellCount)
}

type GitHubContributionsResponse = {
  contributions: Activity[]
}

const getGitHubContributions = unstable_cache(
  async (username: string, cellCount: number) => {
    const years = getYearRange(cellCount)
    const yearQueries = years.map((year) => `y=${year}`).join("&")

    const res = await fetch(
      `${process.env.GITHUB_CONTRIBUTIONS_API_URL || "https://github-contributions-api.jogruber.de"}/v4/${username}?${yearQueries}`
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch GitHub Contributions: ${res.statusText}`)
    }

    const { contributions } = (await res.json()) as GitHubContributionsResponse

    return buildContributionGrid(contributions, cellCount)
  },
  ["github-contributions", "activity-mosaic"],
  { revalidate: 7 * 24 * 60 * 60 } // Cache for 7 days
)

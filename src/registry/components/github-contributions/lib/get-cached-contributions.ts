import { unstable_cache } from "next/cache"

import type { Activity } from "@/registry/components/contribution-graph"

type GitHubContributionsResponse = {
  contributions: Activity[]
}

export const getCachedContributions = unstable_cache(
  async (username: string) => {
    const res = await fetch(
      `${process.env.GITHUB_CONTRIBUTIONS_API_URL || `https://github-contributions-api.jogruber.de`}/v4/${username}?y=last`
    )
    const data = (await res.json()) as GitHubContributionsResponse
    return data.contributions
  },
  ["github-contributions"],
  { revalidate: 86400 } // Cache for 1 day (86400 seconds)
)

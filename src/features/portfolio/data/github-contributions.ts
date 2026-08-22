import "server-only"

import { unstable_cache } from "next/cache"

import { GITHUB_USERNAME } from "@/config/site"
import { fetchGitHubContributions } from "@/lib/github-contributions"

export const getGitHubContributions = unstable_cache(
  async () => {
    try {
      const { contributions } = await fetchGitHubContributions(GITHUB_USERNAME)
      return contributions
    } catch {
      return []
    }
  },
  ["github-contributions"],
  { revalidate: 86400 } // Cache for 1 day (86400 seconds)
)

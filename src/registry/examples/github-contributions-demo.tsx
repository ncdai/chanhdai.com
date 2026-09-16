import { Suspense } from "react"

import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/registry/components/github-contributions"
import { getCachedContributions } from "@/registry/components/github-contributions/lib/get-cached-contributions"

const GITHUB_USERNAME = "ncdai"
const GITHUB_PROFILE_URL = "https://github.com/ncdai"

export default function GitHubContributionsDemo() {
  const contributions = getCachedContributions(GITHUB_USERNAME)

  return (
    <Suspense fallback={<GitHubContributionsFallback />}>
      <GitHubContributions
        contributions={contributions}
        githubProfileUrl={GITHUB_PROFILE_URL}
      />
    </Suspense>
  )
}

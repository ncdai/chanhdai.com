import { Suspense } from "react"

import { cn } from "@/lib/utils"
import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/registry/components/github-contributions"
import { getCachedContributions } from "@/registry/components/github-contributions/lib/get-cached-contributions"

const GITHUB_USERNAME = "ncdai"
const GITHUB_PROFILE_URL = "https://github.com/ncdai"

export default function GitHubContributionsHalloweenTheme() {
  const contributions = getCachedContributions(GITHUB_USERNAME)

  return (
    <Suspense fallback={<GitHubContributionsFallback />}>
      <GitHubContributions
        contributions={contributions}
        githubProfileUrl={GITHUB_PROFILE_URL}
        className={cn(
          // GitHub Halloween Theme
          '**:data-[level="0"]:fill-[#eff2f5] dark:**:data-[level="0"]:fill-[#151b23]',
          '**:data-[level="1"]:fill-[#f0db3d] dark:**:data-[level="1"]:fill-[#fac68f]',
          '**:data-[level="2"]:fill-[#ffd642] dark:**:data-[level="2"]:fill-[#c46212]',
          '**:data-[level="3"]:fill-[#f68c41] dark:**:data-[level="3"]:fill-[#984b10]',
          '**:data-[level="4"]:fill-[#1f2328] dark:**:data-[level="4"]:fill-[#e3d04f]'
        )}
      />
    </Suspense>
  )
}

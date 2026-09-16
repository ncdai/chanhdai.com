import { Suspense } from "react"

import { cn } from "@/lib/utils"
import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/registry/components/github-contributions"
import { getCachedContributions } from "@/registry/components/github-contributions/lib/get-cached-contributions"

const GITHUB_USERNAME = "ncdai"
const GITHUB_PROFILE_URL = "https://github.com/ncdai"

export default function GitHubContributionsDefaultTheme() {
  const contributions = getCachedContributions(GITHUB_USERNAME)

  return (
    <Suspense fallback={<GitHubContributionsFallback />}>
      <GitHubContributions
        contributions={contributions}
        githubProfileUrl={GITHUB_PROFILE_URL}
        className={cn(
          // GitHub Default Theme
          '**:data-[level="0"]:fill-[#eff2f5] dark:**:data-[level="0"]:fill-[#151b23]',
          '**:data-[level="1"]:fill-[#aceebb] dark:**:data-[level="1"]:fill-[#033a16]',
          '**:data-[level="2"]:fill-[#4ac26b] dark:**:data-[level="2"]:fill-[#196c2e]',
          '**:data-[level="3"]:fill-[#2da44e] dark:**:data-[level="3"]:fill-[#2ea043]',
          '**:data-[level="4"]:fill-[#116329] dark:**:data-[level="4"]:fill-[#56d364]'
        )}
      />
    </Suspense>
  )
}

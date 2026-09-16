import { Suspense } from "react"

import { cn } from "@/lib/utils"
import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/registry/components/github-contributions"
import { getCachedContributions } from "@/registry/components/github-contributions/lib/get-cached-contributions"

const GITHUB_USERNAME = "ncdai"
const GITHUB_PROFILE_URL = "https://github.com/ncdai"

export default function GitHubContributionsWinterTheme() {
  const contributions = getCachedContributions(GITHUB_USERNAME)

  return (
    <Suspense fallback={<GitHubContributionsFallback />}>
      <GitHubContributions
        contributions={contributions}
        githubProfileUrl={GITHUB_PROFILE_URL}
        className={cn(
          // GitHub Winter Theme
          '**:data-[level="0"]:fill-[#eff2f5] dark:**:data-[level="0"]:fill-[#151b23]',
          '**:data-[level="1"]:fill-[#b6e3ff] dark:**:data-[level="1"]:fill-[#0c2d6b]',
          '**:data-[level="2"]:fill-[#54aeff] dark:**:data-[level="2"]:fill-[#1158c7]',
          '**:data-[level="3"]:fill-[#0969da] dark:**:data-[level="3"]:fill-[#58a6ff]',
          '**:data-[level="4"]:fill-[#0a3069] dark:**:data-[level="4"]:fill-[#cae8ff]'
        )}
      />
    </Suspense>
  )
}

import { Suspense } from "react"

import { getGitHubContributions } from "@/features/portfolio/data/github-contributions"

import { Panel } from "../panel"
import { GitHubContributionFallback, GitHubContributionGraph } from "./graph"

export function GitHubContributions() {
  const contributions = getGitHubContributions()
  // const ID = "github-contributions"

  return (
    <Panel className="screen-line-top-none">
      {/* <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>GitHub Contributions</a>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader> */}

      <h2 className="sr-only">GitHub Contributions</h2>

      <Suspense fallback={<GitHubContributionFallback />}>
        <GitHubContributionGraph contributions={contributions} />
      </Suspense>

      <div className="h-px" />
    </Panel>
  )
}

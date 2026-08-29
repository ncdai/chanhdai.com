import {
  PageHeading,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"

import { BlocksNav } from "./blocks-nav"

export default function BlocksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageHeading>
        <PageHeadingTagline>Blocks</PageHeadingTagline>
        <PageHeadingTitle>
          Beautifully designed, production-ready.
        </PageHeadingTitle>
      </PageHeading>

      <div className="flex h-4" />

      <div className="screen-line-bottom flex h-px screen-line-bottom-border" />

      <BlocksNav />

      <div className="screen-line-top screen-line-bottom screen-line-top-border before:z-1">
        <div className="stripe-divider" />
      </div>

      {children}

      <div className="screen-line-bottom h-px" />

      <div className="p-2">
        <div className="relative border border-line p-4">
          <p className="font-mono text-sm text-muted-foreground">
            More blocks on the way…
          </p>

          <div className="*:absolute *:flex *:size-2 *:border *:bg-background dark:*:border-line">
            <div className="top-[-4.5px] left-[-4.5px]" />
            <div className="bottom-[-4.5px] left-[-4.5px]" />
            <div className="top-[-4.5px] right-[-4.5px]" />
            <div className="right-[-4.5px] bottom-[-4.5px]" />
          </div>
        </div>
      </div>
    </>
  )
}

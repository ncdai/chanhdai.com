import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Doc } from "@/features/doc/types/document"

export function DocNeighbourNav({
  previous,
  next,
}: {
  previous: Doc | null
  next: Doc | null
}) {
  return (
    <div className="max-sm:hidden">
      <div className="screen-dashed-line-top before:opacity-80">
        <div className="screen-line-top h-px overflow-x-clip" />
      </div>

      <nav
        className="flex justify-between gap-4 p-4"
        aria-label="Previous and next"
      >
        {previous && (
          <Button
            className="min-w-0 shrink border-none"
            variant="secondary"
            size="sm"
            nativeButton={false}
            render={<Link href={`/components/${previous.slug}`} />}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            <span className="sr-only">Previous: </span>
            <span className="truncate">{previous.metadata.title}</span>
          </Button>
        )}

        {next && (
          <Button
            className="ml-auto min-w-0 shrink border-none"
            variant="secondary"
            size="sm"
            nativeButton={false}
            render={<Link href={`/components/${next.slug}`} />}
          >
            <span className="sr-only">Next: </span>
            <span className="truncate">{next.metadata.title}</span>
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        )}
      </nav>
    </div>
  )
}

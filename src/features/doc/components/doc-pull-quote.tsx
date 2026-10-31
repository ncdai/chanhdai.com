import { cn } from "@/lib/utils"
import type { PullQuoteProps } from "@/registry/components/pull-quote"
import { PullQuote } from "@/registry/components/pull-quote"

export function DocPullQuote({ className, ...props }: PullQuoteProps) {
  return (
    <PullQuote className={cn("not-prose my-[2.5em]", className)} {...props} />
  )
}

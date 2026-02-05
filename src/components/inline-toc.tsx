import type { TOCItemType } from "fumadocs-core/toc"
import { TextIcon } from "lucide-react"

import type { Collapsible } from "@/components/ui/collapsible"
import {
  CollapsibleChevronsIcon,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleWithContext,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export function InlineTOC({
  items,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible> & {
  items: TOCItemType[]
}) {
  if (!items.length) {
    return null
  }

  return (
    <CollapsibleWithContext
      className={cn("not-prose rounded-xl bg-code font-sans", className)}
      {...props}
    >
      <CollapsibleTrigger className="inline-flex w-full items-center gap-2 py-2.5 pr-2 pl-4 text-sm font-medium [&_svg]:size-4">
        <TextIcon className="-translate-x-0.5" />
        {children ?? "On this page"}
        <div className="ml-auto shrink-0 text-muted-foreground" aria-hidden>
          <CollapsibleChevronsIcon />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden duration-300 data-[state=closed]:animate-collapsible-fade-up data-[state=open]:animate-collapsible-fade-down">
        <ul className="flex flex-col px-4 pb-2 text-sm text-muted-foreground">
          {items.map((item) => (
            <li
              key={item.url}
              className="flex py-1"
              style={{
                paddingInlineStart: 16 * Math.max(item.depth - 2, 0),
              }}
            >
              <a
                className="underline-offset-4 transition-colors hover:text-accent-foreground hover:underline"
                href={item.url}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </CollapsibleWithContext>
  )
}

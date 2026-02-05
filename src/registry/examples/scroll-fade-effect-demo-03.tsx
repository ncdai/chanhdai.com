import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export default function ScrollAreaDemo() {
  return (
    <ScrollArea
      className={cn(
        "h-72 w-48 rounded-lg border",
        "**:data-[slot=scroll-area-viewport]:scroll-fade-effect-y"
        // "**:data-[slot=scroll-area-viewport]:[--mask-offset-top:8px]",
        // "**:data-[slot=scroll-area-viewport]:[--mask-offset-bottom:8px]"
      )}
    >
      <div className="p-4">
        <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  )
}

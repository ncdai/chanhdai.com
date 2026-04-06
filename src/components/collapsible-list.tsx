import { ChevronDownIcon } from "lucide-react"
import React from "react"

import { Button } from "@/components/base/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/base/ui/collapsible"

export function CollapsibleList<T>({
  items,
  max = 3,

  keyExtractor,
  renderItem,
}: {
  items: T[]
  max?: number

  keyExtractor?: (item: T) => string
  renderItem: (item: T) => React.ReactNode
}) {
  return (
    <Collapsible className="group/collapsible">
      {items.slice(0, max).map((item, index) => (
        <div
          key={typeof keyExtractor === "function" ? keyExtractor(item) : index}
          className="border-b border-line"
        >
          {renderItem(item)}
        </div>
      ))}

      <CollapsibleContent>
        {items.slice(max).map((item, index) => (
          <div
            key={
              typeof keyExtractor === "function"
                ? keyExtractor(item)
                : max + index
            }
            className="border-b border-line"
          >
            {renderItem(item)}
          </div>
        ))}
      </CollapsibleContent>

      {items.length > max && (
        <div className="flex h-12 items-center justify-center pb-px">
          <CollapsibleTrigger
            render={
              <Button className="gap-2 border-none pr-2.5 pl-3" size="sm">
                <span className="hidden group-data-closed/collapsible:block">
                  Show More
                </span>

                <span className="hidden group-data-open/collapsible:block">
                  Show Less
                </span>

                <ChevronDownIcon className="group-data-open/collapsible:rotate-180" />
              </Button>
            }
          />
        </div>
      )}
    </Collapsible>
  )
}

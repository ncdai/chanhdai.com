import React from "react"
import { ChevronDownIcon } from "lucide-react"

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
      <ul>
        {items.slice(0, max).map((item, index) => (
          <li
            key={
              typeof keyExtractor === "function" ? keyExtractor(item) : index
            }
            className="border-b border-line"
          >
            {renderItem(item)}
          </li>
        ))}
      </ul>

      <CollapsibleContent render={<ul />}>
        {items.slice(max).map((item, index) => (
          <li
            key={
              typeof keyExtractor === "function"
                ? keyExtractor(item)
                : max + index
            }
            className="border-b border-line"
          >
            {renderItem(item)}
          </li>
        ))}
      </CollapsibleContent>

      {items.length > max && (
        <div className="screen-line-top -mt-px flex items-center justify-center py-4">
          <CollapsibleTrigger
            render={
              <Button
                className="gap-2 pr-2.5 pl-3 shadow-[inset_0_0_1px] shadow-foreground/20"
                variant="secondary"
                size="sm"
              >
                <span className="hidden group-data-closed/collapsible:block">
                  Show more
                </span>

                <span className="hidden group-data-open/collapsible:block">
                  Show less
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

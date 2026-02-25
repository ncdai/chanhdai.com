import { ChevronDownIcon } from "lucide-react"
import { Slot } from "radix-ui"
import React from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/base/ui/collapsible"
import { Button } from "@/components/ui/button"

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
      {items.slice(0, max).map((award, index) => (
        <Slot.Root
          key={typeof keyExtractor === "function" ? keyExtractor(award) : index}
          className="border-b border-edge"
        >
          {renderItem(award)}
        </Slot.Root>
      ))}

      <CollapsibleContent>
        {items.slice(max).map((award, index) => (
          <Slot.Root
            key={
              typeof keyExtractor === "function"
                ? keyExtractor(award)
                : max + index
            }
            className="border-b border-edge"
          >
            {renderItem(award)}
          </Slot.Root>
        ))}
      </CollapsibleContent>

      {items.length > max && (
        <div className="flex h-12 items-center justify-center pb-px">
          <CollapsibleTrigger
            render={
              <Button className="flex px-3" variant="default">
                <span className="hidden group-data-closed/collapsible:block">
                  Show More
                </span>

                <span className="hidden group-data-open/collapsible:block">
                  Show Less
                </span>

                <ChevronDownIcon
                  className="group-data-open/collapsible:rotate-180"
                  aria-hidden
                />
              </Button>
            }
          />
        </div>
      )}
    </Collapsible>
  )
}

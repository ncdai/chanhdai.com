import type { ComponentProps } from "react"
import * as SwipeActionsPrimitive from "@ncdai/react-swipe-actions"

import { cn } from "@/lib/utils"

type SwipeSide = SwipeActionsPrimitive.SwipeSide
type SwipeState = SwipeActionsPrimitive.SwipeState

const SwipeRoot = SwipeActionsPrimitive.SwipeRoot

const SwipeItem = SwipeActionsPrimitive.SwipeItem

const SwipeActions = SwipeActionsPrimitive.SwipeActions

function SwipeAction({
  className,
  children,
  ...props
}: ComponentProps<typeof SwipeActionsPrimitive.SwipeAction>) {
  return (
    <SwipeActionsPrimitive.SwipeAction
      className={cn(
        "bg-secondary text-xs font-medium whitespace-nowrap text-secondary-foreground select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground data-armed:brightness-90 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <SwipeActionsPrimitive.SwipeActionContent className="min-w-20 flex-col items-center justify-center gap-1.5 px-4">
        {children}
      </SwipeActionsPrimitive.SwipeActionContent>
    </SwipeActionsPrimitive.SwipeAction>
  )
}

function SwipeContent({
  className,
  ...props
}: ComponentProps<typeof SwipeActionsPrimitive.SwipeContent>) {
  return (
    <SwipeActionsPrimitive.SwipeContent
      className={cn("bg-background data-dragging:cursor-grabbing", className)}
      {...props}
    />
  )
}

export { SwipeAction, SwipeActions, SwipeContent, SwipeItem, SwipeRoot }
export type { SwipeSide, SwipeState }

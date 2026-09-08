"use client"

import { useState } from "react"
import { Trash2Icon } from "lucide-react"

import {
  SwipeAction,
  SwipeActions,
  SwipeContent,
  SwipeItem,
  SwipeRoot,
} from "@/registry/components/swipe-actions"

export default function SwipeActionsMinimalDemo() {
  const [items, setItems] = useState(INITIAL_ITEMS)

  const remove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="w-full overflow-clip rounded-xl border">
      <SwipeRoot render={<ul role="list" className="divide-y" />}>
        {items.map((item) => (
          <SwipeItem key={item.id} render={<li />}>
            <SwipeActions side="right">
              <SwipeAction
                fullSwipe
                className="rounded-lg bg-red-600 text-white"
                onClick={() => remove(item.id)}
              >
                <Trash2Icon className="size-4" />
                <span className="sr-only">Delete</span>
              </SwipeAction>
            </SwipeActions>

            <SwipeContent>
              <div className="p-4 text-sm text-foreground">{item.label}</div>
            </SwipeContent>
          </SwipeItem>
        ))}
      </SwipeRoot>

      {items.length === 0 && (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
          Nothing left.
        </p>
      )}
    </div>
  )
}

const INITIAL_ITEMS = [
  { id: "1", label: "components.json" },
  { id: "2", label: "registry.json" },
  { id: "3", label: "tailwind.config.ts" },
]

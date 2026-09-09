"use client"

import { useState } from "react"
import { ArchiveIcon, Trash2Icon } from "lucide-react"

import {
  SwipeAction,
  SwipeActions,
  SwipeContent,
  SwipeItem,
  SwipeRoot,
} from "@/registry/components/swipe-actions"

export default function SwipeActionsFullSwipeDemo() {
  const [items, setItems] = useState(INITIAL_ITEMS)

  const archive = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, archived: true } : item))
    )
  }

  const remove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="w-full overflow-clip rounded-xl border">
      <SwipeRoot render={<ul role="list" className="divide-y" />}>
        {items.map((item) => (
          <SwipeItem key={item.id} render={<li />}>
            <SwipeActions side="right" fullSwipe>
              <SwipeAction
                className="rounded-xl bg-red-600 text-white"
                onClick={() => remove(item.id)}
              >
                <Trash2Icon className="size-4" />
                <span className="sr-only">Delete</span>
              </SwipeAction>

              <SwipeAction
                className="rounded-xl bg-sky-500 text-white"
                onClick={() => archive(item.id)}
              >
                <ArchiveIcon className="size-4" />
                <span className="sr-only">Archive</span>
              </SwipeAction>
            </SwipeActions>

            <SwipeContent>
              <div className="flex items-center gap-2 p-4 text-sm text-foreground">
                {item.label}
                {item.archived && (
                  <span className="text-muted-foreground">Archived</span>
                )}
              </div>
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
  { id: "1", label: "components.json", archived: false },
  { id: "2", label: "registry.json", archived: false },
  { id: "3", label: "tailwind.config.ts", archived: false },
]

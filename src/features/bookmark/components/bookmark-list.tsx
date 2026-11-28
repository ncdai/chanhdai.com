import type { BookmarkListEntry } from "../types"

export function BookmarkList({ entries }: { entries: BookmarkListEntry[] }) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
      {entries.map((entry) => (
        <li key={entry.url} className="flex flex-col">
          <div className="flex flex-1 items-end justify-center px-2 pt-10">
            {entry.card}
          </div>

          <ShelfBoard />
        </li>
      ))}
    </ul>
  )
}

function ShelfBoard() {
  return (
    <div className="screen-line-top screen-line-bottom before:z-1" aria-hidden>
      <div className="stripe-divider h-2" />
    </div>
  )
}

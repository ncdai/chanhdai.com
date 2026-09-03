import type { BookmarkListEntry } from "../types"

export function BookmarkList({ entries }: { entries: BookmarkListEntry[] }) {
  return (
    <ul>
      {entries.map((entry) => (
        <li key={entry.url} className="border-b border-line">
          {entry.card}
        </li>
      ))}
    </ul>
  )
}

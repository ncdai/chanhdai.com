import { compareDesc } from "date-fns"

import { CollapsibleList } from "@/components/collapsible-list"

import { BOOKMARKS } from "../../data/bookmarks"
import { Panel, PanelHeader, PanelTitle } from "../panel"
import { BookmarkItem } from "./bookmark-item"

const SORTED_BOOKMARKS = [...BOOKMARKS].sort((a, b) => {
  return compareDesc(new Date(a.bookmarkedAt), new Date(b.bookmarkedAt))
})

export function Bookmarks() {
  return (
    <Panel id="bookmarks">
      <PanelHeader>
        <PanelTitle>Bookmarks</PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={SORTED_BOOKMARKS}
        max={3}
        renderItem={(item) => <BookmarkItem bookmark={item} />}
      />
    </Panel>
  )
}

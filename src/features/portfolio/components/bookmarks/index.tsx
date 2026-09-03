import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/base/ui/button"
import { BookmarkItem } from "@/features/bookmark/components/bookmark-item"
import { BOOKMARKS } from "@/features/bookmark/data"
import { sortBookmarksNewestFirst } from "@/features/bookmark/lib/sort"
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"

const SORTED_BOOKMARKS = sortBookmarksNewestFirst(BOOKMARKS)

const MAX_ITEMS = 6

const HOME_BOOKMARKS = SORTED_BOOKMARKS.slice(0, MAX_ITEMS)

const ID = "bookmarks"

export function Bookmarks() {
  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Bookmarks</a>
          <PanelTitleSup>({BOOKMARKS.length})</PanelTitleSup>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <ul>
        {HOME_BOOKMARKS.map((item) => (
          <li key={item.url} className="border-b border-line">
            <BookmarkItem bookmark={item} surface="home" />
          </li>
        ))}
      </ul>

      <div className="screen-line-top -mt-px flex items-center justify-center py-4">
        <Button
          className="gap-2 pr-2.5 pl-3 shadow-[inset_0_0_1px] shadow-foreground/20"
          variant="secondary"
          size="sm"
          nativeButton={false}
          render={<Link href="/bookmarks" />}
        >
          All bookmarks
          <ArrowRightIcon />
        </Button>
      </div>
    </Panel>
  )
}

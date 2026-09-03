import { Suspense } from "react"
import type { Metadata } from "next"
import type { CollectionPage, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { BookmarkFilters } from "@/features/bookmark/components/bookmark-filters"
import { BookmarkItem } from "@/features/bookmark/components/bookmark-item"
import { BookmarkList } from "@/features/bookmark/components/bookmark-list"
import { BookmarkListFiltered } from "@/features/bookmark/components/bookmark-list-filtered"
import { BOOKMARKS } from "@/features/bookmark/data"
import { sortBookmarksNewestFirst } from "@/features/bookmark/lib/sort"
import {
  BOOKMARK_CATEGORY_TO_PARAM,
  type BookmarkListEntry,
} from "@/features/bookmark/types"

const title = "Bookmarks"
const description =
  "Hand-picked articles, courses, books, and references worth your time."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/bookmarks",
  },
  openGraph: {
    url: "/bookmarks",
    type: "website",
    images: {
      url: ogImage,
      width: 1200,
      height: 630,
      alt: title,
    },
  },
  twitter: {
    card: "summary_large_image",
    site: X_HANDLE,
    creator: X_HANDLE,
    images: [ogImage],
  },
}

const SORTED_BOOKMARKS = sortBookmarksNewestFirst(BOOKMARKS)

function getCollectionPageJsonLd(
  items: { url: string }[]
): WithContext<CollectionPage> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/bookmarks"),
    name: title,
    description,
    url: absoluteUrl("/bookmarks"),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: item.url,
      })),
    },
    isPartOf: { "@id": JSON_LD_ID.website },
  }
}

export default function Page() {
  const entries = SORTED_BOOKMARKS.map<BookmarkListEntry>((bookmark) => ({
    url: bookmark.url,
    category: BOOKMARK_CATEGORY_TO_PARAM[bookmark.category],
    card: <BookmarkItem bookmark={bookmark} surface="list" />,
  }))

  return (
    <>
      <JsonLdScript data={getCollectionPageJsonLd(SORTED_BOOKMARKS)} />

      <JsonLdScript
        data={jsonLdBreadcrumbList([
          {
            name: "Home",
            href: "/",
          },
          {
            name: "Bookmarks",
            href: "/bookmarks",
          },
        ])}
      />

      <div className="min-h-svh">
        <PageHeading>
          <PageHeadingTagline>Bookmarks</PageHeadingTagline>
          <PageHeadingTitle>Things worth your time.</PageHeadingTitle>
          <PageHeadingDescription>
            Hand-picked articles, courses, books, and references.
          </PageHeadingDescription>
        </PageHeading>

        <div className="h-4" />

        <div className="screen-line-bottom flex h-px screen-line-bottom-border" />

        <Suspense fallback={<div className="h-12" />}>
          <BookmarkFilters />
        </Suspense>

        <div className="screen-line-top screen-line-bottom screen-line-top-border before:z-1">
          <div className="stripe-divider" />
        </div>

        <Suspense fallback={<BookmarkList entries={entries} />}>
          <BookmarkListFiltered entries={entries} />
        </Suspense>

        <div className="h-4" />
      </div>
    </>
  )
}

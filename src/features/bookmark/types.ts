import type { BookmarkCategoryParam } from "./lib/search-params"

/**
 * Defines the classification for bookmarks to ensure organized and scalable data.
 */
export enum BookmarkCategory {
  /**
   * Blog posts, technical articles, and personal or company opinion pieces.
   * Examples: Vercel Blog, Emil Kowalski's articles.
   */
  ARTICLE = "Article",

  /**
   * Educational platforms, video courses, and interactive learning websites.
   * Examples: animations.dev, Devouring Details, Interface Craft.
   */
  COURSE = "Course",

  /**
   * Published books, e-books, and extensive reading materials.
   * Examples: Making Software by Dan Hollick.
   */
  BOOK = "Book",

  /**
   * Official guidelines, handbooks, design principles, and philosophy documentation.
   * Examples: Vercel Web Interface Guidelines, Resend Handbook.
   */
  REFERENCE = "Reference",

  /**
   * UI and component libraries, blocks, and design kits.
   * Examples: React Bits, shadcn-based libraries.
   */
  UI_LIBRARY = "UI Library",

  /**
   * Software tools, libraries, and utilities that aid in development or design.
   */
  SOFTWARE = "Software",
}

export type Bookmark = {
  title: string
  /** Canonical link; also the entry's identity for list keys and click analytics. */
  url: string
  author?: string
  icon?: React.ReactElement
  category: BookmarkCategory
  bookmarkedAt: string
  /** 1-2 first-person sentences shown on cards. */
  why?: string
}

export const BOOKMARK_CATEGORY_TO_PARAM: Record<
  BookmarkCategory,
  BookmarkCategoryParam
> = {
  [BookmarkCategory.ARTICLE]: "article",
  [BookmarkCategory.COURSE]: "course",
  [BookmarkCategory.BOOK]: "book",
  [BookmarkCategory.REFERENCE]: "reference",
  [BookmarkCategory.UI_LIBRARY]: "ui-library",
  [BookmarkCategory.SOFTWARE]: "software",
}

/** Serializable subset of a bookmark, safe to pass to client components. */
export type BookmarkPreview = {
  title: string
  url: string
}

/**
 * `card` is a server-rendered slot: `Bookmark.icon` is server JSX, so a
 * bookmark cannot cross the client boundary as data, and rendering on the
 * server keeps the card out of the client bundle.
 */
export type BookmarkListEntry = {
  url: string
  category: BookmarkCategoryParam
  card: React.ReactNode
}

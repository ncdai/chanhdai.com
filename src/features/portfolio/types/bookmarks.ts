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
   * Software tools, libraries, and utilities that aid in development or design.
   */
  SOFTWARE = "Software",
}

export type Bookmark = {
  title: string
  url: string
  author?: string
  icon?: React.ReactElement
  category: BookmarkCategory
  bookmarkedAt: string
}

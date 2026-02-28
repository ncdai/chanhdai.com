import type { MetadataRoute } from "next"

import { SITE_INFO } from "@/config/site"
import { getAllDocs, getDocsByCategory } from "@/features/doc/data/documents"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllDocs().map((post) => ({
    url: `${SITE_INFO.url}/blog/${post.slug}`,
    lastModified: new Date(post.metadata.updatedAt).toISOString(),
  }))

  const components = getDocsByCategory("components").map((post) => ({
    url: `${SITE_INFO.url}/components/${post.slug}`,
    lastModified: new Date(post.metadata.updatedAt).toISOString(),
  }))

  const routes = ["", "/blog", "/components"].map((route) => ({
    url: `${SITE_INFO.url}${route}`,
    lastModified: new Date().toISOString(),
  }))

  return [...routes, ...posts, ...components]
}

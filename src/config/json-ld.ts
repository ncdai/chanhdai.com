import type { Person } from "schema-dts"

import { SITE_INFO } from "@/config/site"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

/**
 * Stable @id anchors so Google can merge JSON-LD nodes across separate
 * <script> blocks (and pages) into a single entity in the Knowledge Graph.
 * The "#fragment" keeps each node id distinct from the page URL itself.
 */
export const JSON_LD_ID = {
  website: `${SITE_INFO.url}/#website`,
  person: `${SITE_INFO.url}/#person`,
} as const

export const personJsonLd: Person = {
  "@type": "Person",
  "@id": JSON_LD_ID.person,
  name: USER.displayName,
  alternateName: [USER.username],
  identifier: USER.username,
  description: SITE_INFO.description,
  image: USER.avatar,
  url: SITE_INFO.url,
  // Public profiles opt in via their `sameAs` flag (Knowledge Graph).
  sameAs: SOCIAL_LINKS.filter((link) => link.sameAs).map((link) => link.href),
}

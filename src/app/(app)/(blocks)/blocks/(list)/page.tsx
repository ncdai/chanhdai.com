import type { Metadata } from "next"
import type { CollectionPage, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import { BlockList } from "@/features/blocks/components/block-list"
import { getBlocks } from "@/features/blocks/data/blocks"

export const dynamic = "force-static"
export const revalidate = false

const title = "Blocks"
const description = "Beautifully designed, production-ready."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/blocks",
  },
  openGraph: {
    url: "/blocks",
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

function getCollectionPageJsonLd(
  blocks: ReturnType<typeof getBlocks>
): WithContext<CollectionPage> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/blocks"),
    name: title,
    description,
    url: absoluteUrl("/blocks"),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: blocks.length,
      itemListElement: blocks.map((block, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/blocks/${block.categories?.[0]}/${block.name}`),
      })),
    },
    isPartOf: { "@id": JSON_LD_ID.website },
  }
}

export default function BlocksPage() {
  const blocks = getBlocks()

  return (
    <>
      <JsonLdScript data={getCollectionPageJsonLd(blocks)} />

      <JsonLdScript
        data={jsonLdBreadcrumbList([
          {
            name: "Home",
            href: "/",
          },
          {
            name: "Blocks",
            href: "/blocks",
          },
        ])}
      />

      <BlockList blocks={blocks} />
    </>
  )
}

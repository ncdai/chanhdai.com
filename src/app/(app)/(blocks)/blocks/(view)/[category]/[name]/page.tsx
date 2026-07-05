import { cache } from "react"
import type { Metadata, Route } from "next"
import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import type { SoftwareSourceCode, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { blockCategories } from "@/config/registry"
import { LICENSE, SOURCE_CODE_GITHUB_URL, X_HANDLE } from "@/config/site"
import { getAllBlockStaticParams } from "@/lib/blocks"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { getRegistryItem } from "@/lib/registry"
import { absoluteUrl } from "@/lib/utils"
import { Kbd } from "@/components/ui/kbd"
import { Button } from "@/components/base/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { BlockDisplay } from "@/app/(preview)/components/block-display"
import { DocKeyboardShortcuts } from "@/features/doc/components/doc-keyboard-shortcuts"
import { DocShareMenu } from "@/features/doc/components/doc-share-menu"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

const getCachedStaticParams = cache(getAllBlockStaticParams)

export async function generateStaticParams() {
  return await getCachedStaticParams()
}

const getCachedRegistryItem = cache(async (name: string) => {
  return await getRegistryItem(name)
})

export async function generateMetadata({
  params,
}: PageProps<"/blocks/[category]/[name]">): Promise<Metadata> {
  const { category, name } = await params

  const item = await getCachedRegistryItem(name)

  if (!item) {
    return {}
  }

  const title = item.name
  const description = item.description

  const blockUrl = `/blocks/${category}/${item.name}`
  const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

  return {
    title,
    description,
    alternates: {
      canonical: blockUrl,
    },
    openGraph: {
      url: blockUrl,
      type: "article",
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
}

function getSoftwareSourceCodeJsonLd(
  category: string,
  item: { name: string; description?: string; meta?: { createdAt?: string } }
): WithContext<SoftwareSourceCode> {
  const blockUrl = `/blocks/${category}/${item.name}`
  const description = item.description ?? ""

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "@id": absoluteUrl(blockUrl),
    name: item.name,
    description,
    image: absoluteUrl(
      `/og/simple?title=${encodeURIComponent(item.name)}&description=${encodeURIComponent(description)}`
    ),
    url: absoluteUrl(blockUrl),
    datePublished: item.meta?.createdAt
      ? new Date(item.meta.createdAt).toISOString()
      : undefined,
    codeRepository: SOURCE_CODE_GITHUB_URL,
    programmingLanguage: [{ "@type": "ComputerLanguage", name: "TypeScript" }],
    runtimePlatform: "React 19",
    codeSampleType: "full (compile ready) solution",
    keywords: ["react", "shadcn", "block"],
    license: LICENSE.url,
    author: { "@id": JSON_LD_ID.person },
    isPartOf: {
      "@type": "CollectionPage",
      "@id": absoluteUrl("/blocks"),
      name: "Blocks",
      url: absoluteUrl("/blocks"),
    },
  }
}

export default async function BlockViewPage({
  params,
}: PageProps<"/blocks/[category]/[name]">) {
  const { category, name } = await params

  const blocks = await getCachedStaticParams()

  const { previous, next } = findNeighbour(
    blocks.map((block) => `${block.category}/${block.name}`),
    `${category}/${name}`
  )

  const categoryItem = blockCategories.find((c) => c.name === category)

  const item = await getCachedRegistryItem(name)

  return (
    <>
      {item && (
        <JsonLdScript data={getSoftwareSourceCodeJsonLd(category, item)} />
      )}

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
          {
            name: categoryItem?.title || category,
            href: `/blocks/${category}`,
          },
          {
            name,
            href: `/blocks/${category}/${name}`,
          },
        ])}
      />

      <DocKeyboardShortcuts
        previous={previous ? (`/blocks/${previous}` as Route) : null}
        next={next ? (`/blocks/${next}` as Route) : null}
      />

      <div className="screen-line-bottom flex h-px" />

      <div className="flex items-center justify-between p-2 pl-4">
        <Button
          className="h-7 gap-2 border-none px-0 text-muted-foreground hover:text-foreground"
          variant="link"
          size="sm"
          nativeButton={false}
          render={
            <Link href={`/blocks/${category}`}>
              <ArrowLeftIcon />
              {categoryItem?.title || "Blocks"}
            </Link>
          }
        />

        <div className="flex items-center gap-2">
          <DocShareMenu title={name} url={`/blocks/${category}/${name}`} />

          {previous && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    className="size-7 border-none"
                    variant="secondary"
                    size="icon-sm"
                    nativeButton={false}
                    render={
                      <Link
                        href={`/blocks/${previous}`}
                        aria-label="Previous Block"
                      >
                        <ArrowLeftIcon />
                      </Link>
                    }
                  />
                }
              />
              <TooltipContent className="pr-2 pl-3">
                <div className="flex items-center gap-3">
                  Previous Block
                  <Kbd>
                    <ArrowLeftIcon />
                  </Kbd>
                </div>
              </TooltipContent>
            </Tooltip>
          )}

          {next && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    className="size-7 border-none"
                    variant="secondary"
                    size="icon-sm"
                    nativeButton={false}
                    render={
                      <Link href={`/blocks/${next}`} aria-label="Next Block">
                        <ArrowRightIcon />
                      </Link>
                    }
                  />
                }
              />
              <TooltipContent className="pr-2 pl-3">
                <div className="flex items-center gap-3">
                  Next Block
                  <Kbd>
                    <ArrowRightIcon />
                  </Kbd>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="screen-line-top h-px" />

      <BlockDisplay name={name} />

      <div className="screen-line-top h-px" />

      <div className="stripe-divider" />
    </>
  )
}

function findNeighbour(blocks: string[], slug: string) {
  const len = blocks.length

  for (let i = 0; i < len; ++i) {
    if (blocks[i] === slug) {
      return {
        previous: i > 0 ? blocks[i - 1] : null,
        next: i < len - 1 ? blocks[i + 1] : null,
      }
    }
  }

  return { previous: null, next: null }
}

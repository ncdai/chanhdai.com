import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { cache } from "react"

import { BlockDisplay } from "@/app/(preview)/components/block-display"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { registryCategories } from "@/config/registry"
import { X_HANDLE } from "@/config/site"
import { PostKeyboardShortcuts } from "@/features/blog/components/post-keyboard-shortcuts"
import { PostShareMenu } from "@/features/blog/components/post-share-menu"
import { getAllBlockStaticParams } from "@/lib/blocks"
import { getRegistryItem } from "@/lib/registry"
import { cn } from "@/lib/utils"

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

export default async function BlockViewPage({
  params,
}: PageProps<"/blocks/[category]/[name]">) {
  const { category, name } = await params

  const blocks = await getCachedStaticParams()

  const { previous, next } = findNeighbour(
    blocks.map((block) => `${block.category}/${block.name}`),
    `${category}/${name}`
  )

  const categoryItem = registryCategories.find((c) => c.slug === category)

  return (
    <>
      <PostKeyboardShortcuts
        previous={previous ? `/blocks/${previous}` : null}
        next={next ? `/blocks/${next}` : null}
      />

      <div className="screen-line-bottom flex h-px" />

      <div className="flex items-center justify-between p-2 pl-4">
        <Button
          className="h-7 gap-2 border-none px-0 text-muted-foreground hover:text-foreground"
          variant="link"
          size="sm"
          asChild
        >
          <Link href={`/blocks/${category}`}>
            <ArrowLeftIcon />
            {categoryItem?.name || "Blocks"}
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <PostShareMenu title={name} url={`/blocks/${category}/${name}`} />

          {previous && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    className="size-7 border-none"
                    variant="secondary"
                    size="icon-sm"
                    asChild
                  >
                    <Link
                      href={`/blocks/${previous}`}
                      aria-label="Previous Block"
                    >
                      <ArrowLeftIcon />
                    </Link>
                  </Button>
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
                    asChild
                  >
                    <Link href={`/blocks/${next}`} aria-label="Next Block">
                      <ArrowRightIcon />
                    </Link>
                  </Button>
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

      <div
        className={cn(
          "relative h-8 before:absolute before:left-[-100vw] before:-z-1 before:h-full before:w-[200vw]",
          "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-line)]/56"
        )}
      />
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

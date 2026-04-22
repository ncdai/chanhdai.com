import type { Metadata } from "next"
import { Fragment } from "react"

import { BlockDisplay } from "@/app/(preview)/components/block-display"
import { registryCategories } from "@/config/registry"
import { X_HANDLE } from "@/config/site"
import { getAllBlockIds } from "@/lib/blocks"
import { cn } from "@/lib/utils"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  return registryCategories.map((category) => ({
    category: category.slug,
  }))
}

export async function generateMetadata({
  params,
}: PageProps<"/blocks/[category]">): Promise<Metadata> {
  const { category } = await params

  const item = registryCategories.find((item) => item.slug === category)

  if (!item) {
    return {}
  }

  const title = item.name
  const description = item.description

  const categoryUrl = `/blocks/${item.slug}`
  const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

  return {
    title,
    description,
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      url: categoryUrl,
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
}

export default async function BlocksPage({
  params,
}: PageProps<"/blocks/[category]">) {
  const { category } = await params
  const blockIds = await getAllBlockIds(["registry:block"], [category])

  return (
    <>
      {blockIds.map((blockId) => (
        <Fragment key={blockId}>
          <BlockDisplay name={blockId} />
          <Separator />
        </Fragment>
      ))}
    </>
  )
}

function Separator() {
  return (
    <div className="screen-line-top screen-line-bottom">
      <div
        className={cn(
          "h-8 before:absolute before:left-[-100vw] before:-z-1 before:h-full before:w-[200vw]",
          "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-line)]/56"
        )}
      />
    </div>
  )
}

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"

import { Index } from "@/__registry__"
import { X_USERNAME } from "@/config/site"
import { getRegistryItem } from "@/lib/registry"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  const { Index } = await import("@/__registry__")

  const params: Array<{ name: string }> = []

  for (const itemName in Index) {
    const item = Index[itemName]
    if (["registry:block"].includes(item.type)) {
      params.push({
        name: item.name,
      })
    }
  }

  return params
}

const getCachedRegistryItem = cache(async (name: string) => {
  return await getRegistryItem(name)
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    name: string
  }>
}): Promise<Metadata> {
  const { name } = await params

  const item = await getCachedRegistryItem(name)

  if (!item) {
    return {}
  }

  const title = item.name
  const description = item.description

  const blockUrl = `/view/${item.name}`
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
      site: X_USERNAME,
      creator: X_USERNAME,
      images: [ogImage],
    },
  }
}

export default async function BlockPage({
  params,
}: {
  params: Promise<{
    name: string
  }>
}) {
  const name = (await params).name

  const item = await getCachedRegistryItem(name)
  const Component = Index[name]?.component

  if (!item || !Component) {
    return notFound()
  }

  return <Component />
}

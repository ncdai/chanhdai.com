import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"

import { Index } from "@/__registry__"
import { PreviewProvider } from "@/app/(preview)/components/preview-provider"
import { getCachedThemes } from "@/app/(preview)/lib/get-themes"
import { X_HANDLE } from "@/config/site"
import { getRegistryItem } from "@/lib/registry"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  const { Index } = await import("@/__registry__")

  const params: Array<{ name: string }> = []

  for (const itemName in Index) {
    const item = Index[itemName]
    if (["registry:block", "registry:example"].includes(item.type)) {
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
}: PageProps<"/preview/[name]">): Promise<Metadata> {
  const { name } = await params

  const item = await getCachedRegistryItem(name)

  if (!item) {
    return {}
  }

  const title = item.name
  const description = item.description

  const blockUrl = `/preview/${item.name}`
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
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function PreviewPage({
  params,
}: PageProps<"/preview/[name]">) {
  const name = (await params).name

  const [item, themes] = await Promise.all([
    getCachedRegistryItem(name),
    getCachedThemes(),
  ])
  const Component = Index[name]?.component

  if (!item || !Component) {
    return notFound()
  }

  return (
    <div className={item?.meta?.previewClassName}>
      <PreviewProvider themes={themes}>
        <Component />
      </PreviewProvider>
    </div>
  )
}

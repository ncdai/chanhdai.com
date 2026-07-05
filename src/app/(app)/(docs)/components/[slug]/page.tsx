import type { Metadata, Route } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getTableOfContents } from "fumadocs-core/content/toc"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import type { SoftwareSourceCode, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { LICENSE, SOURCE_CODE_GITHUB_URL, X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import { Kbd } from "@/components/ui/kbd"
import { Button } from "@/components/base/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { Prose } from "@/components/base/ui/typography"
import { MDX } from "@/components/mdx"
import { TOCInline } from "@/components/toc-inline"
import { TOCMinimap } from "@/components/toc-minimap"
import { DocKeyboardShortcuts } from "@/features/doc/components/doc-keyboard-shortcuts"
import {
  DocContentCol,
  DocRightCol,
} from "@/features/doc/components/doc-layout"
import { LLMCopyButtonWithViewOptions } from "@/features/doc/components/doc-page-actions"
import { DocShareMenu } from "@/features/doc/components/doc-share-menu"
import { DocSponsors } from "@/features/doc/components/doc-sponsors"
import {
  findNeighbour,
  getComponentDocs,
  getDocBySlug,
} from "@/features/doc/data/documents"
import type { Doc } from "@/features/doc/types/document"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  const docs = getComponentDocs()
  return docs.map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/components/[slug]">): Promise<Metadata> {
  const slug = (await params).slug
  const doc = getDocBySlug(slug)

  if (!doc || doc.metadata.category !== "components") {
    return notFound()
  }

  const { title, description, image, createdAt, updatedAt } = doc.metadata

  const postUrl = `/components/${doc.slug}`
  const ogImage =
    image ||
    `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

  return {
    title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      url: postUrl,
      type: "article",
      publishedTime: new Date(createdAt).toISOString(),
      modifiedTime: new Date(updatedAt).toISOString(),
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
  doc: Doc
): WithContext<SoftwareSourceCode> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "@id": absoluteUrl(`/components/${doc.slug}`),
    name: doc.metadata.title,
    description: doc.metadata.description,
    image:
      doc.metadata.image ||
      absoluteUrl(
        `/og/simple?title=${encodeURIComponent(doc.metadata.title)}&description=${encodeURIComponent(doc.metadata.description)}`
      ),
    url: absoluteUrl(`/components/${doc.slug}`),
    datePublished: new Date(doc.metadata.createdAt).toISOString(),
    dateModified: new Date(doc.metadata.updatedAt).toISOString(),
    codeRepository: SOURCE_CODE_GITHUB_URL,
    programmingLanguage: [{ "@type": "ComputerLanguage", name: "TypeScript" }],
    runtimePlatform: "React 19",
    codeSampleType: "full (compile ready) solution",
    keywords: ["react", "shadcn", "component"],
    license: LICENSE.url,
    author: { "@id": JSON_LD_ID.person },
    isPartOf: {
      "@type": "CollectionPage",
      "@id": absoluteUrl("/components"),
      name: "Components",
      url: absoluteUrl("/components"),
    },
  }
}

export default async function Page({
  params,
}: PageProps<"/components/[slug]">) {
  const slug = (await params).slug
  const doc = getDocBySlug(slug)

  if (!doc) {
    notFound()
  }

  if (doc.metadata.category !== "components") {
    notFound()
  }

  const toc = getTableOfContents(doc.content)

  const allDocs = getComponentDocs()
    .slice()
    .sort((a, b) =>
      a.metadata.title.localeCompare(b.metadata.title, "en", {
        sensitivity: "base",
      })
    )
  const { previous, next } = findNeighbour(allDocs, slug)

  return (
    <>
      <DocContentCol>
        <JsonLdScript data={getSoftwareSourceCodeJsonLd(doc)} />

        <JsonLdScript
          data={jsonLdBreadcrumbList([
            {
              name: "Home",
              href: "/",
            },
            {
              name: "Components",
              href: "/components",
            },
            {
              name: doc.metadata.title,
              href: `/components/${slug}`,
            },
          ])}
        />

        <DocKeyboardShortcuts
          previous={previous ? (`/components/${previous.slug}` as Route) : null}
          next={next ? (`/components/${next.slug}` as Route) : null}
        />

        <div className="screen-dashed-line-bottom after:opacity-80">
          <div className="screen-line-bottom h-px overflow-x-clip" />
        </div>

        <div className="flex items-center justify-between p-2 pl-4">
          <Button
            className="h-7 gap-2 border-none px-0 tracking-wider text-muted-foreground hover:text-foreground hover:no-underline"
            variant="link"
            size="sm"
            nativeButton={false}
            render={
              <Link href="/components">
                <ArrowLeftIcon />
                Components
              </Link>
            }
          />

          <div className="flex items-center gap-2">
            <LLMCopyButtonWithViewOptions
              markdownUrl={`/components/${doc.slug}.mdx`}
              isComponent
            />

            <DocShareMenu
              title={doc.metadata.title}
              url={`/components/${doc.slug}`}
            />

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
                          href={`/components/${previous.slug}`}
                          aria-label="Previous Component"
                        >
                          <ArrowLeftIcon />
                        </Link>
                      }
                    />
                  }
                />
                <TooltipContent className="pr-2 pl-3">
                  <div className="flex items-center gap-3">
                    Previous component
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
                        <Link
                          href={`/components/${next.slug}`}
                          aria-label="Next component"
                        >
                          <ArrowRightIcon />
                        </Link>
                      }
                    />
                  }
                />
                <TooltipContent className="pr-2 pl-3">
                  <div className="flex items-center gap-3">
                    Next component
                    <Kbd>
                      <ArrowRightIcon />
                    </Kbd>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="screen-dashed-line-top screen-dashed-line-bottom before:opacity-80 after:opacity-80">
          <div className="screen-line-top screen-line-bottom overflow-x-clip py-px">
            <div className="h-4" />
          </div>
        </div>

        <div className="screen-dashed-line-bottom after:opacity-80">
          <h1
            data-slot="doc-title"
            className="screen-line-bottom overflow-x-clip px-4 text-4xl font-medium tracking-tight text-balance"
          >
            {doc.metadata.title}
          </h1>
        </div>

        <Prose className="px-(--page-padding) pt-8 [--page-padding:--spacing(4)]">
          <p className="text-muted-foreground">{doc.metadata.description}</p>

          <TOCInline className="lg:hidden" items={toc} />

          <div>
            <MDX code={doc.content} />
          </div>
        </Prose>

        <DocSponsors />

        <div className="screen-dashed-line-top before:opacity-80">
          <div className="screen-line-top h-4 overflow-x-clip" />
        </div>
      </DocContentCol>

      <DocRightCol>
        <div className="sticky top-[calc(var(--doc-cols-top,0)+(--spacing(3)))] translate-x-2 opacity-0 in-data-doc-cols-ready:opacity-100">
          <TOCMinimap items={toc} />
        </div>
      </DocRightCol>
    </>
  )
}

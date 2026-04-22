import { getTableOfContents } from "fumadocs-core/content/toc"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { BlogPosting as PageSchema, WithContext } from "schema-dts"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { MDX } from "@/components/mdx"
import { TOCInline } from "@/components/toc-inline"
import { TOCMinimap } from "@/components/toc-minimap"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Prose } from "@/components/ui/typography"
import { SITE_INFO, X_HANDLE } from "@/config/site"
import { PostKeyboardShortcuts } from "@/features/blog/components/post-keyboard-shortcuts"
import { LLMCopyButtonWithViewOptions } from "@/features/blog/components/post-page-actions"
import { PostShareMenu } from "@/features/blog/components/post-share-menu"
import {
  DocContainer,
  DocContentCol,
  DocGrid,
  DocLeftCol,
  DocRightCol,
} from "@/features/doc/components/doc-layout"
import { DocPageRoot } from "@/features/doc/components/doc-page-root"
import {
  findNeighbour,
  getDocBySlug,
  getDocsByCategory,
} from "@/features/doc/data/documents"
import type { Doc } from "@/features/doc/types/document"
import { USER } from "@/features/portfolio/data/user"
import { cn } from "@/lib/utils"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  const docs = getDocsByCategory("components")
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

function getPageJsonLd(doc: Doc): WithContext<PageSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: doc.metadata.title,
    description: doc.metadata.description,
    image:
      doc.metadata.image ||
      `/og/simple?title=${encodeURIComponent(doc.metadata.title)}&description=${encodeURIComponent(doc.metadata.description)}`,
    url: `${SITE_INFO.url}/components/${doc.slug}`,
    datePublished: new Date(doc.metadata.createdAt).toISOString(),
    dateModified: new Date(doc.metadata.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: USER.displayName,
      identifier: USER.username,
      image: USER.avatar,
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

  const allDocs = getDocsByCategory("components")
    .slice()
    .sort((a, b) =>
      a.metadata.title.localeCompare(b.metadata.title, "en", {
        sensitivity: "base",
      })
    )
  const { previous, next } = findNeighbour(allDocs, slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd(doc)).replace(/</g, "\\u003c"),
        }}
      />

      <PostKeyboardShortcuts
        previous={previous ? `/components/${previous.slug}` : null}
        next={next ? `/components/${next.slug}` : null}
      />

      <DocPageRoot>
        <DocContainer>
          <div className="screen-line-bottom h-px" />

          <div className="flex items-center justify-between p-2 pl-4">
            <Button
              className="h-7 gap-2 border-none px-0 text-muted-foreground hover:text-foreground hover:no-underline"
              variant="link"
              size="sm"
              asChild
            >
              <Link href="/components">
                <ArrowLeftIcon />
                Components
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <LLMCopyButtonWithViewOptions
                markdownUrl={`/components/${doc.slug}.mdx`}
                isComponent
              />

              <PostShareMenu
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
                        asChild
                      >
                        <Link
                          href={`/components/${previous.slug}`}
                          aria-label="Previous Component"
                        >
                          <ArrowLeftIcon />
                        </Link>
                      </Button>
                    }
                  />
                  <TooltipContent className="pr-2 pl-3">
                    <div className="flex items-center gap-3">
                      Previous Component
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
                        <Link
                          href={`/components/${next.slug}`}
                          aria-label="Next Component"
                        >
                          <ArrowRightIcon />
                        </Link>
                      </Button>
                    }
                  />
                  <TooltipContent className="pr-2 pl-3">
                    <div className="flex items-center gap-3">
                      Next Component
                      <Kbd>
                        <ArrowRightIcon />
                      </Kbd>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          <div className="screen-line-top screen-line-bottom">
            <div
              className={cn(
                "h-8 before:absolute before:left-[-100vw] before:-z-1 before:h-full before:w-[200vw]",
                "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-line)]/56"
              )}
            />
          </div>

          <h1
            data-slot="doc-title"
            className="screen-line-bottom px-4 text-3xl font-semibold tracking-tight text-balance"
          >
            {doc.metadata.title}
          </h1>
        </DocContainer>

        <DocGrid>
          <DocLeftCol />

          <DocContentCol>
            <Prose className="px-4 pt-8">
              <p className="text-muted-foreground">
                {doc.metadata.description}
              </p>

              <TOCInline className="lg:hidden" items={toc} />

              <div>
                <MDX code={doc.content} />
              </div>
            </Prose>

            <div className="screen-line-top h-4" />
          </DocContentCol>

          <DocRightCol>
            <TOCMinimap items={toc} />
          </DocRightCol>
        </DocGrid>
      </DocPageRoot>
    </>
  )
}

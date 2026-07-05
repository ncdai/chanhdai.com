import type { Metadata, Route } from "next"
import Link from "next/link"
import { addQueryParams } from "@/utils/url"
import { Grip, LayoutDashboard } from "lucide-react"
import type { CollectionPage, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { registryConfig } from "@/config/registry"
import { UTM_PARAMS, X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl, cn } from "@/lib/utils"
import AdUnit from "@/components/ad-unit"
import { Button } from "@/components/base/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { TrustedRegistryIcon } from "@/components/icons"
import {
  PageHeading,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { RegistryCommandAnimated } from "@/components/registry-command-animated"
import { ComponentIcon } from "@/features/doc/components/component-icon"
import { getComponentDocs } from "@/features/doc/data/documents"
import type { Doc } from "@/features/doc/types/document"

import {
  ComponentItem,
  ComponentItemDot,
  ComponentItemIcon,
  ComponentItemTitle,
} from "./component-item"

const title = "Components"
const description = "Pixel-perfect, uniquely crafted."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/components",
  },
  openGraph: {
    url: "/components",
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
  docs: { name: string; slug: string }[]
): WithContext<CollectionPage> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/components"),
    name: title,
    description,
    url: absoluteUrl("/components"),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: docs.length,
      itemListElement: docs.map((doc, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/components/${doc.slug}`),
      })),
    },
    isPartOf: { "@id": JSON_LD_ID.website },
  }
}

export default function Page() {
  const allComponents = getComponentDocs()
    .slice()
    .sort((a, b) =>
      a.metadata.title.localeCompare(b.metadata.title, "en", {
        sensitivity: "base",
      })
    )

  const newComponents = allComponents.filter((c) => c.metadata.new)

  const trustedRegistryUrl = addQueryParams(
    "https://ui.shadcn.com/docs/directory",
    {
      q: registryConfig.namespace,
      ...UTM_PARAMS,
    }
  )

  return (
    <>
      <JsonLdScript
        data={getCollectionPageJsonLd(
          allComponents.map((doc) => ({
            name: doc.metadata.title,
            slug: doc.slug,
          }))
        )}
      />

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
        ])}
      />

      <div>
        <PageHeading>
          <PageHeadingTagline>Components</PageHeadingTagline>
          <PageHeadingTitle>Pixel-perfect, uniquely crafted.</PageHeadingTitle>
        </PageHeading>

        <div className="h-4" />

        <div className="screen-line-top screen-line-bottom">
          <RegistryCommandAnimated />
        </div>

        <div className="stripe-divider" />

        <div className="screen-line-bottom h-px" />

        {newComponents.length > 0 && (
          <>
            <div className="flex h-10 items-center pl-4">
              <h2 className="text-sm font-medium text-muted-foreground">
                New components
              </h2>
            </div>

            <div className="screen-line-bottom h-px" />

            <ComponentList items={newComponents} showNew={false} />

            <div className="screen-line-top screen-line-bottom pb-px before:-top-px">
              <div className="stripe-divider" />
            </div>
          </>
        )}

        <div className="flex items-center gap-1.5 p-1.5 pl-4">
          <h2 className="flex-1 text-sm font-medium text-muted-foreground">
            {allComponents.length} components
          </h2>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  className="size-7"
                  variant="outline"
                  size="icon-sm"
                  aria-label="List"
                >
                  <Grip />
                </Button>
              }
            />
            <TooltipContent>
              <p>List</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  className="size-7 border-none text-muted-foreground"
                  variant="ghost"
                  size="icon-sm"
                  nativeButton={false}
                  render={<Link href="/components/showcase" />}
                  aria-label="Showcase"
                >
                  <LayoutDashboard />
                </Button>
              }
            />
            <TooltipContent>
              <p>Showcase</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="screen-line-bottom h-px" />

        <ComponentList items={allComponents} />

        <div className="screen-line-top flex justify-center p-4 before:-top-px">
          <a
            className="flex h-7 items-center gap-1 rounded-full bg-primary pr-2.5 pl-2 text-sm font-medium whitespace-nowrap text-primary-foreground select-none [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0"
            href={trustedRegistryUrl}
            target="_blank"
            rel="noopener"
          >
            <TrustedRegistryIcon />
            Trusted Registry
          </a>
        </div>

        <div className="screen-line-bottom h-px" />

        <AdUnit className="screen-line-bottom p-4" slot="3900447059" />

        <div className="h-4" />
      </div>
    </>
  )
}

function ComponentList({
  items,
  showNew = true,
}: {
  items: Doc[]
  showNew?: boolean
}) {
  return (
    <div className="relative overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 max-sm:hidden sm:grid-cols-2 md:grid-cols-3">
        <div className="border-r border-line" />
        <div className="border-r border-line max-md:hidden" />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {items.map((c) => (
          <li
            key={c.slug}
            className={cn(
              "max-sm:screen-line-bottom",
              "sm:max-md:nth-[2n+1]:screen-line-bottom",
              "md:nth-[3n+1]:screen-line-bottom"
            )}
          >
            <ComponentItem href={`/components/${c.slug}` as Route}>
              <ComponentItemIcon>
                <ComponentIcon slug={c.slug} />
                {showNew && (c.metadata.new || c.metadata.updated) && (
                  <ComponentItemDot
                    aria-label={c.metadata.new ? "New" : "Updated"}
                  />
                )}
              </ComponentItemIcon>
              <ComponentItemTitle as="h3">
                {c.metadata.title}
              </ComponentItemTitle>
            </ComponentItem>
          </li>
        ))}
      </ul>
    </div>
  )
}

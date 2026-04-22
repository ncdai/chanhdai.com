import { PlusIcon } from "lucide-react"
import type { Metadata } from "next"

import { Button } from "@/components/base/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/base/ui/dialog"
import { ComponentIcon } from "@/components/icons"
import { MDX } from "@/components/mdx"
import {
  PageHeading,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { RegistryCommandAnimated } from "@/components/registry-command-animated"
import { registryConfig } from "@/config/registry"
import { UTM_PARAMS, X_HANDLE } from "@/config/site"
import { getDocsByCategory } from "@/features/doc/data/documents"
import { cn } from "@/lib/utils"
import { addQueryParams } from "@/utils/url"

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

const addRegistryCode = `\`\`\`bash
npx shadcn@latest registry add ${registryConfig.namespace}
\`\`\``

export default function Page() {
  const posts = getDocsByCategory("components")

  return (
    <div className="min-h-svh">
      <PageHeading>
        <PageHeadingTagline>Components</PageHeadingTagline>
        <PageHeadingTitle>Pixel-perfect, uniquely crafted.</PageHeadingTitle>
      </PageHeading>

      <div className="h-4" />

      <div className="screen-line-top screen-line-bottom">
        <RegistryCommandAnimated />

        <Dialog>
          <DialogTrigger
            render={
              <Button
                className="absolute top-1.5 right-10 h-7 gap-1.5 border-none pr-2.5 pl-2"
                variant="secondary"
                size="sm"
              >
                <PlusIcon className="size-3.5" />
                Add
              </Button>
            }
          />

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Registry</DialogTitle>
              <DialogDescription className="text-balance">
                Run this command to add{" "}
                <a
                  className="text-foreground link-underline"
                  href={addQueryParams("https://ui.shadcn.com/docs/directory", {
                    q: registryConfig.namespace,
                    ...UTM_PARAMS,
                  })}
                  target="_blank"
                  rel="noopener"
                >
                  {registryConfig.namespace}
                </a>{" "}
                to your project.
              </DialogDescription>
            </DialogHeader>

            <div className="overflow-auto *:data-rehype-pretty-code-figure:my-0">
              <MDX code={addRegistryCode} />
            </div>

            <DialogFooter>
              <DialogClose render={<Button>Done</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      <div className="screen-line-bottom h-px" />

      <div className="relative">
        <div className="absolute inset-0 -z-1 grid grid-cols-1 max-sm:hidden sm:grid-cols-2 md:grid-cols-3">
          <div className="border-r border-line" />
          <div className="border-r border-line max-md:hidden" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {posts
            .slice()
            .sort((a, b) =>
              a.metadata.title.localeCompare(b.metadata.title, "en", {
                sensitivity: "base",
              })
            )
            .map((c) => (
              <ComponentItem key={c.slug} href={`/components/${c.slug}`}>
                <ComponentItemIcon>
                  <ComponentIcon variant={c.slug} />
                  {(c.metadata.new || c.metadata.updated) && (
                    <ComponentItemDot
                      aria-label={c.metadata.new ? "New" : "Updated"}
                    />
                  )}
                </ComponentItemIcon>
                <ComponentItemTitle as="h2">
                  {c.metadata.title}
                </ComponentItemTitle>
              </ComponentItem>
            ))}
        </div>
      </div>

      <div className="h-2" />
    </div>
  )
}

function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-full",
        "before:absolute before:left-[-100vw] before:-z-1 before:h-8 before:w-[200vw]",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-line)]/56",
        className
      )}
    />
  )
}

import { PlusIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { ComponentIcon } from "@/components/icons"
import { MDX } from "@/components/mdx"
import { RegistryCommandAnimated } from "@/components/registry-command-animated"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { registryConfig } from "@/config/registry"
import { UTM_PARAMS } from "@/config/site"
import { getDocsByCategory } from "@/features/doc/data/documents"
import { cn } from "@/lib/utils"
import { addQueryParams } from "@/utils/url"

export const metadata: Metadata = {
  title: "UI",
  description: "A collection of reusable components.",
  alternates: {
    canonical: "/components",
  },
  openGraph: {
    url: "/components",
    type: "website",
    images: {
      url: "https://assets.chanhdai.com/images/ui-og-image-dark.webp",
      width: 1200,
      height: 630,
      alt: "UI",
    },
  },
  twitter: {
    card: "summary_large_image",
    site: "@iamncdai",
    creator: "@iamncdai",
    images: ["https://assets.chanhdai.com/images/ui-og-image-dark.webp"],
  },
}

// const componentsJSON = `\`\`\`json title="components.json" showLineNumbers {3}
// {
//   "registries": {
//     "${registryConfig.namespace}": "${registryConfig.namespaceUrl}"
//   }
// }
// \`\`\``

const addRegistryCode = `\`\`\`bash
npx shadcn@latest registry add ${registryConfig.namespace}
\`\`\``

export default function Page() {
  const posts = getDocsByCategory("components")

  return (
    <div className="min-h-svh">
      <div className="screen-line-after px-4">
        <h1 className="text-3xl leading-none font-semibold tracking-tight">
          UI
        </h1>
      </div>

      <div className="p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          {metadata.description} <span className="max-md:block" />
          <a
            className="whitespace-nowrap underline-offset-4 hover:underline"
            href={addQueryParams("https://ui.shadcn.com/docs/directory", {
              q: registryConfig.namespace,
              ...UTM_PARAMS,
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            Trusted registry
          </a>{" "}
          for shadcn/ui.
        </p>

        {/* <div className="flex items-center gap-1.5 *:data-[slot=tag]:gap-1.5">
          <Tag className="font-sans font-medium">
            <Icons.react />
            React 19
          </Tag>

          <Tag className="font-sans font-medium">
            <Icons.tailwindcss />
            Tailwind CSS v4
          </Tag>
        </div> */}
      </div>

      <div className="screen-line-before screen-line-after relative">
        <RegistryCommandAnimated />

        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="absolute top-1.5 right-10 rounded-lg pr-2.5 pl-2"
              variant="secondary"
              size="sm"
            >
              <PlusIcon />
              Add
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Registry</DialogTitle>
              <DialogDescription className="text-balance">
                Run this command to add{" "}
                <a
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                  href={addQueryParams("https://ui.shadcn.com/docs/directory", {
                    q: registryConfig.namespace,
                    ...UTM_PARAMS,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
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
              <DialogClose asChild>
                <Button>Done</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>

          {/* <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Configure MCP</DialogTitle>
              <DialogDescription className="text-balance">
                Copy and paste the following code into your project&apos;s
                components.json.
              </DialogDescription>
            </DialogHeader>

            <div className="overflow-auto *:data-rehype-pretty-code-figure:my-0">
              <MDX code={componentsJSON} />
            </div>

            <DialogFooter className="sm:justify-between">
              <Button variant="outline" asChild>
                <a
                  href="https://ui.shadcn.com/docs/mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the docs
                </a>
              </Button>

              <DialogClose asChild>
                <Button>Done</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent> */}
        </Dialog>
      </div>

      <Separator />

      <div className="relative">
        <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-2 max-sm:hidden sm:grid-cols-2 md:grid-cols-3">
          <div className="border-r border-edge" />
          <div className="border-l border-edge md:border-x" />
          <div className="border-l border-edge max-md:hidden" />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {posts
            .slice()
            .sort((a, b) =>
              a.metadata.title.localeCompare(b.metadata.title, "en", {
                sensitivity: "base",
              })
            )
            .map((post) => (
              <Link
                key={post.slug}
                href={`/components/${post.slug}`}
                className={cn(
                  "group flex items-center gap-4 p-4 pr-2 transition-[background-color] ease-out hover:bg-accent-muted",
                  "max-sm:screen-line-before max-sm:screen-line-after",
                  "sm:max-md:nth-[2n+1]:screen-line-before sm:max-md:nth-[2n+1]:screen-line-after",
                  "md:nth-[3n+1]:screen-line-before md:nth-[3n+1]:screen-line-after"
                )}
              >
                <div className="relative flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted ring-1 ring-edge ring-offset-1 ring-offset-background">
                  <ComponentIcon
                    className="pointer-events-none size-4 text-muted-foreground"
                    variant={post.slug}
                    aria-hidden="true"
                  />
                  {post.metadata.new && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center">
                      <span className="flex size-2 rounded-sm bg-info ring-1 ring-background" />
                      <span className="sr-only">New</span>
                    </span>
                  )}
                </div>

                <h2 className="line-clamp-1 leading-snug font-medium text-balance">
                  {post.metadata.title}
                </h2>
              </Link>
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
        "before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw]",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
        className
      )}
    />
  )
}

import type { Metadata } from "next"
import Link from "next/link"

import { ComponentIcon, Icons } from "@/components/icons"
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
import { Tag } from "@/components/ui/tag"
import { registryConfig } from "@/config/registry"
import { UTM_PARAMS } from "@/config/site"
import { getPostsByCategory } from "@/features/blog/data/posts"
import { cn } from "@/lib/utils"
import { addQueryParams } from "@/utils/url"

export const metadata: Metadata = {
  title: "Components",
  description: "A collection of reusable components.",
}

const componentsJSON = `\`\`\`json title="components.json" showLineNumbers {3}
{
  "registries": {
    "${registryConfig.namespace}": "${registryConfig.namespaceUrl}"
  }
}
\`\`\``

export default function Page() {
  const posts = getPostsByCategory("components")

  return (
    <div className="min-h-svh">
      <div className="screen-line-after px-4">
        <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
      </div>

      <div className="space-y-4 p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          {metadata.description} <span className="max-md:block" />
          <a
            className="whitespace-nowrap underline-offset-4 hover:underline"
            href={addQueryParams(`https://ui.shadcn.com/docs/directory`, {
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

        <div className="flex items-center gap-1.5 *:data-[slot=tag]:gap-1.5">
          <Tag className="font-sans font-medium">
            <Icons.react />
            React 19
          </Tag>

          <Tag className="font-sans font-medium">
            <Icons.tailwindcss />
            Tailwind CSS v4
          </Tag>
        </div>
      </div>

      <div className="screen-line-before screen-line-after relative">
        <RegistryCommandAnimated />

        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="absolute top-1.5 right-10 rounded-lg px-2"
              variant="secondary"
              size="sm"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.85 0a4.16 4.16 0 0 0-2.95 1.217L1.456 10.66a.835.835 0 0 0 0 1.18.835.835 0 0 0 1.18 0l9.442-9.442a2.49 2.49 0 0 1 3.541 0 2.49 2.49 0 0 1 0 3.541L8.59 12.97l-.1.1a.835.835 0 0 0 0 1.18.835.835 0 0 0 1.18 0l.1-.098 7.03-7.034a2.49 2.49 0 0 1 3.542 0l.049.05a2.49 2.49 0 0 1 0 3.54l-8.54 8.54a1.96 1.96 0 0 0 0 2.755l1.753 1.753a.835.835 0 0 0 1.18 0 .835.835 0 0 0 0-1.18l-1.753-1.753a.266.266 0 0 1 0-.394l8.54-8.54a4.185 4.185 0 0 0 0-5.9l-.05-.05a4.16 4.16 0 0 0-2.95-1.218c-.2 0-.401.02-.6.048a4.17 4.17 0 0 0-1.17-3.552A4.16 4.16 0 0 0 13.85 0m0 3.333a.84.84 0 0 0-.59.245L6.275 10.56a4.186 4.186 0 0 0 0 5.902 4.186 4.186 0 0 0 5.902 0L19.16 9.48a.835.835 0 0 0 0-1.18.835.835 0 0 0-1.18 0l-6.985 6.984a2.49 2.49 0 0 1-3.54 0 2.49 2.49 0 0 1 0-3.54l6.983-6.985a.835.835 0 0 0 0-1.18.84.84 0 0 0-.59-.245"
                  fill="currentColor"
                />
              </svg>
              MCP
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-xl">
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
          </DialogContent>
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
                    variant={post.metadata.icon}
                    aria-hidden="true"
                  />
                  {post.metadata.new && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center">
                      <span className="flex size-2 rounded-sm bg-info ring-1 ring-background" />
                      <span className="sr-only">New</span>
                    </span>
                  )}
                </div>

                <h2 className="line-clamp-1 leading-snug font-medium text-balance underline-offset-4 group-hover:underline">
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

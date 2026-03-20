import type { Metadata } from "next"

import { X_USERNAME } from "@/config/site"
import { cn } from "@/lib/utils"

import { BlocksNav } from "./blocks-nav"

const title = "Blocks"
const description =
  "A collection of beautifully designed, production-ready blocks."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/blocks",
  },
  openGraph: {
    url: "/blocks",
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
    site: X_USERNAME,
    creator: X_USERNAME,
    images: [ogImage],
  },
}

export default function BlocksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div
        className={cn(
          "screen-line-bottom h-8",
          "before:absolute before:-left-[100vw] before:-z-1 before:h-full before:w-[200vw]",
          "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-line)]/56"
        )}
      />

      <div className="screen-line-bottom px-4">
        <h1 className="text-3xl leading-none font-semibold tracking-tight">
          {title}
        </h1>
      </div>

      <div className="screen-line-bottom p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="p-4">
        <BlocksNav />
      </div>

      <div className="screen-line-top screen-line-bottom">
        <div
          className={cn(
            "h-8 before:absolute before:-left-[100vw] before:-z-1 before:h-full before:w-[200vw]",
            "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-line)]/56"
          )}
        />
      </div>

      {children}
    </>
  )
}

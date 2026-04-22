import type { Metadata } from "next"
import { Fragment } from "react"

import { BlockDisplay } from "@/app/(preview)/components/block-display"
import { X_HANDLE } from "@/config/site"
import { cn } from "@/lib/utils"

export const dynamic = "force-static"
export const revalidate = false

const title = "Blocks"
const description = "Beautifully designed, production-ready."

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
    site: X_HANDLE,
    creator: X_HANDLE,
    images: [ogImage],
  },
}

const FEATURED_BLOCKS = [
  "team-01",
  "hero-01",
  "blog-02",
  "blog-01",
  "testimonials-01",
  "testimonials-02",
  "experience-01",
]

export default function BlocksPage() {
  return (
    <>
      {FEATURED_BLOCKS.map((name) => (
        <Fragment key={name}>
          <BlockDisplay name={name} />
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

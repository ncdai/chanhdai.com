import type { Metadata } from "next"

import { SITE_INFO, X_USERNAME } from "@/config/site"
import { SponsorItem } from "@/features/sponsor/components/sponsor-item"
import { SponsorItemPlus } from "@/features/sponsor/components/sponsor-item-plus"
import { sponsors } from "@/features/sponsor/data"

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Grateful for the support that helps me grow and maintain high-quality projects.",
  alternates: {
    canonical: "/sponsors",
  },
  openGraph: {
    url: "/sponsors",
    type: "website",
    images: {
      url: SITE_INFO.ogImage,
      width: 1200,
      height: 630,
      alt: "Sponsors",
    },
  },
  twitter: {
    card: "summary_large_image",
    site: X_USERNAME,
    creator: X_USERNAME,
    images: [SITE_INFO.ogImage],
  },
}

export default function Page() {
  return (
    <div className="min-h-svh">
      <div className="screen-line-bottom px-4">
        <h1 className="text-3xl font-semibold tracking-tight">Sponsors</h1>
      </div>

      <div className="p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          {metadata.description}
        </p>
      </div>

      <div className="screen-line-top relative pt-4">
        <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-line" />
          <div className="border-l border-line" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sponsors.map((item) => (
            <SponsorItem key={item.name} item={item} />
          ))}

          <SponsorItemPlus />
        </div>
      </div>

      <div className="h-4" />
    </div>
  )
}

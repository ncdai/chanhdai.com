import type { Metadata } from "next"

import { SponsorItem } from "@/features/sponsors/components/sponsor-item"
import { SponsorItemPlus } from "@/features/sponsors/components/sponsor-item-plus"
import { sponsors } from "@/features/sponsors/data"

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Grateful for the support that helps me grow and maintain high-quality projects.",
}

export default function Page() {
  return (
    <div className="min-h-svh">
      <div className="screen-line-after px-4">
        <h1 className="text-3xl font-semibold tracking-tight">Sponsors</h1>
      </div>

      <div className="p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          {metadata.description}
        </p>
      </div>

      <div className="screen-line-before relative pt-4">
        <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-edge" />
          <div className="border-l border-edge" />
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

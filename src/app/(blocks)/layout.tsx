import dynamic from "next/dynamic"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

const ScrollToTop = dynamic(() =>
  import("@/components/scroll-to-top").then((mod) => mod.ScrollToTop)
)

export default function AppLayoutWide({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader width="wide" />
      <main className="max-w-screen overflow-x-hidden px-2">
        <div className="container mx-auto border-x border-edge">{children}</div>
      </main>
      <SiteFooter width="wide" />
      <ScrollToTop />
    </>
  )
}

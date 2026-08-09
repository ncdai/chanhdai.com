import dynamic from "next/dynamic"

import { SiteBottomNav } from "@/components/site-bottom-nav"
import { SiteFooterCad } from "@/components/site-footer-cad"
import { SiteHeader } from "@/components/site-header"

const ScrollToTop = dynamic(() =>
  import("@/components/scroll-to-top").then((mod) => mod.ScrollToTop)
)

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    // References:
    // - https://base-ui.com/react/overview/quick-start#portals
    // - https://base-ui.com/react/overview/quick-start#ios-26-safari
    <div className="group/layout relative isolate">
      <SiteHeader />
      <main className="max-w-screen overflow-x-clip px-2">{children}</main>
      <SiteFooterCad />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50"
        aria-hidden
      >
        <div className="h-(--fade-bottom-height) bg-linear-to-b from-transparent to-background mask-linear-[to_top,var(--background)_25%,transparent] backdrop-blur-[1px]" />
        <div className="bg-background pb-[env(safe-area-inset-bottom,0)]" />
      </div>
      <SiteBottomNav />
      <ScrollToTop />
    </div>
  )
}

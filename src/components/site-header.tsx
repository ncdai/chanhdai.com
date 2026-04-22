import dynamic from "next/dynamic"
import Link from "next/link"

import blocks from "@/__registry__/__blocks__.json"
import { NavDesktop } from "@/components/nav-desktop"
import { NavItemGitHub } from "@/components/nav-item-github"
import { SiteHeaderMark } from "@/components/site-header-mark"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { MAIN_NAV, MOBILE_NAV } from "@/config/site"
import { getAllDocs } from "@/features/doc/data/documents"
import type { DocPreview } from "@/features/doc/types/document"
import { cn } from "@/lib/utils"

const BrandContextMenu = dynamic(() =>
  import("@/components/brand-context-menu").then((mod) => mod.BrandContextMenu)
)

const CommandMenu = dynamic(() =>
  import("@/components/command-menu").then((mod) => mod.CommandMenu)
)

const NavMobile = dynamic(() =>
  import("@/components/nav-mobile").then((mod) => mod.NavMobile)
)

export function SiteHeader() {
  const docs = getAllDocs()

  // Minimize data serialized to client component - only send necessary fields
  const docPreviews: DocPreview[] = docs.map((doc) => ({
    slug: doc.slug,
    title: doc.metadata.title,
    category: doc.metadata.category,
  }))

  return (
    <>
      <header className="sticky top-0 z-50 max-w-screen overflow-x-hidden bg-background px-2 pt-2">
        <div className="screen-line-top screen-line-bottom mx-auto flex h-12 items-center justify-between gap-2 border-x border-line px-2 group-has-data-[slot=layout-wide]/layout:container after:z-1 after:transition-[background-color] sm:gap-4 md:max-w-3xl">
          <BrandContextMenu>
            <Link
              className="transition-[scale] ease-out active:scale-[0.98] has-data-[visible=false]:pointer-events-none [&_svg]:h-8 [&_svg]:shrink-0"
              href="/"
              aria-label="Home"
            >
              <SiteHeaderMark />
            </Link>
          </BrandContextMenu>

          <div className="flex-1" />

          <NavDesktop items={MAIN_NAV} />

          <div className="flex items-center *:first:mr-2 max-sm:*:data-[slot=command-menu-trigger]:hidden">
            <CommandMenu docs={docPreviews} blocks={blocks} enabledHotkeys />
            <NavItemGitHub />
            <Separator
              orientation="vertical"
              className="mx-2 data-vertical:h-4 data-vertical:self-center"
            />
            <ThemeToggle />
          </div>

          <div className="absolute top-[-3.5px] left-[-4.5px] z-2 flex size-2 border border-line bg-background" />
          <div className="absolute top-[-3.5px] right-[-4.5px] z-2 flex size-2 border border-line bg-background" />
        </div>
      </header>

      {/* Nav Mobile */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-[calc(--spacing(24)+env(safe-area-inset-bottom,0))] bg-linear-to-b from-transparent from-[calc(env(safe-area-inset-bottom,0%))] to-background mask-linear-[to_top,var(--background)_25%,transparent] backdrop-blur-[1px] sm:hidden" />
      <div
        className={cn(
          "fixed bottom-[calc(--spacing(2)+env(safe-area-inset-bottom,0))] left-1/2 z-50 flex w-fit -translate-x-1/2 items-center rounded-xl bg-popover py-1 pr-1 pl-2.5 shadow-md ring ring-foreground/10 sm:hidden dark:ring-foreground/20",
          "*:data-[slot=command-menu-trigger]:min-w-20 *:data-[slot=command-menu-trigger]:gap-2 *:data-[slot=command-menu-trigger]:rounded-none *:data-[slot=command-menu-trigger]:border-none *:data-[slot=command-menu-trigger]:bg-transparent *:data-[slot=command-menu-trigger]:px-0 *:data-[slot=command-menu-trigger]:hover:bg-transparent *:data-[slot=command-menu-trigger]:active:scale-none"
        )}
      >
        <CommandMenu docs={docPreviews} blocks={blocks} />
        <Separator
          orientation="vertical"
          className="mr-1 ml-2.5 data-vertical:h-6 data-vertical:self-center"
        />
        <NavMobile items={MOBILE_NAV} />
      </div>
    </>
  )
}

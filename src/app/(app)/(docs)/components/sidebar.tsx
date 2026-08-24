/**
 * This component is inspired by Devouring Details and Skiper UI.
 */

"use client"

import { memo, useEffect, useRef } from "react"
import type { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { useHotkeys } from "react-hotkeys-hook"

import { cn } from "@/lib/utils"
import { useSidebarOpen } from "@/hooks/use-sidebar-open"
import { Kbd } from "@/components/ui/kbd"
import { Button } from "@/components/base/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"

import { SidebarIcon } from "./sidebar-icon"

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { isOpen, toggleSidebar } = useSidebarOpen()

  useHotkeys("s", toggleSidebar)

  return (
    <div
      className={cn(
        "[--sidebar-width:--spacing(60)]",
        "[--sidebar-radius:var(--radius-xl)]",
        "[--sidebar-top:calc(var(--header-height)+(--spacing(12))+(--spacing(0.75)))]",
        "sticky top-(--sidebar-top) isolate flex flex-col max-xl:hidden"
      )}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              className={cn(
                "[--trigger-inset:--spacing(1.5)]",
                "[--trigger-radius:calc(var(--sidebar-radius)-var(--trigger-inset)+1px)]",
                "absolute top-(--trigger-inset) left-(--trigger-inset) z-10 size-7 rounded-(--trigger-radius) border-none",
                "in-data-[sidebar-open=false]:inset-ring-1 in-data-[sidebar-open=false]:inset-ring-border"
              )}
              variant="ghost"
              size="icon-sm"
              onClick={toggleSidebar}
            >
              <SidebarIcon />
            </Button>
          }
        />
        <TooltipContent className="pr-2 pl-3" side="right">
          <div className="flex items-center gap-3">
            Toggle Sidebar
            <Kbd>S</Kbd>
          </div>
        </TooltipContent>
      </Tooltip>

      {/*
        The visual open state is keyed off `data-sidebar-open` on <html>, set
        by a blocking script in the root layout, so the persisted state paints
        correctly before hydration.
      */}
      <div
        className={cn(
          "relative flex flex-col rounded-(--sidebar-radius) border bg-background",
          "h-[calc(100svh-var(--sidebar-top)-var(--fade-bottom-height))] w-(--sidebar-width)",
          "translate-x-0 in-data-[sidebar-open=false]:-translate-x-[calc(var(--sidebar-width)-1px)]",
          "transition-[translate] duration-350 ease-[cubic-bezier(0.24,0.88,0.28,0.92)]"
        )}
        tabIndex={isOpen ? 0 : -1}
        aria-hidden={!isOpen}
        suppressHydrationWarning
      >
        <div
          data-sidebar-scroll-area=""
          className="no-scrollbar grow scroll-fade overflow-x-clip overflow-y-auto overscroll-contain pt-10.25"
        >
          {children}
        </div>

        {/*
          Pointer-only rail toggle, hidden from assistive technology on
          purpose: the trigger button with the S hotkey is the accessible
          control.
        */}
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          onClick={toggleSidebar}
          className={cn(
            "absolute inset-y-10 -right-3 w-4 cursor-pointer",
            "after:absolute after:inset-y-0 after:right-1 after:w-1 after:rounded-sm",
            "after:transition-[background-color] after:ease-out hover:after:bg-foreground/20"
          )}
        />
      </div>
    </div>
  )
}

type MenuItem<T extends string = string> = {
  title: string
  href: T
}

export function SidebarContent({ items }: { items: MenuItem<Route>[] }) {
  const pathname = usePathname()

  const itemActiveRef = useRef<HTMLAnchorElement | null>(null)

  // Center the active item manually; scrollIntoView would scroll the page too.
  useEffect(() => {
    const item = itemActiveRef.current
    const scrollArea = item?.closest("[data-sidebar-scroll-area]")
    if (!item || !scrollArea) return

    const scrollAreaRect = scrollArea.getBoundingClientRect()
    const itemRect = item.getBoundingClientRect()

    scrollArea.scrollTop +=
      itemRect.top -
      scrollAreaRect.top -
      (scrollAreaRect.height - itemRect.height) / 2
  }, [])

  return (
    <div
      className="flex flex-col gap-2 py-5.25 pr-0.5 pl-3"
      style={
        {
          "--normal-line-width": `${lineVariants.normal.width}px`,
        } as React.CSSProperties
      }
    >
      {items.map((item, index) => (
        <SidebarMenuItem
          key={item.href}
          ref={item.href === pathname ? itemActiveRef : undefined}
          title={item.title}
          href={item.href}
          isActive={item.href === pathname}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  )
}

const MotionLink = motion.create(Link)

const lineVariants = {
  normal: { width: 24 },
  active: { width: 40 },
  hover: { width: 40 },
}

const SidebarMenuItem = memo(function SidebarMenuItem({
  ref,
  title,
  href,
  isActive = false,
  isLast = false,
}: MenuItem<Route> & {
  ref?: React.Ref<HTMLAnchorElement>
  isActive?: boolean
  isLast?: boolean
}) {
  return (
    <>
      <MotionLink
        ref={ref}
        aria-current={isActive ? "page" : undefined}
        className="group relative flex h-px items-center gap-3 after:absolute after:top-1/2 after:left-0 after:size-full after:-translate-y-1/2 after:p-3.5"
        href={href}
        initial={false}
        animate={isActive ? "active" : "normal"}
        whileHover="hover"
      >
        <motion.span
          className="block h-px shrink-0 bg-foreground/20 transition-[background-color] ease-out group-hover:bg-foreground group-aria-[current=page]:bg-foreground"
          variants={lineVariants}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
        <span className="text-sm whitespace-nowrap text-muted-foreground transition-[color] ease-out group-hover:text-foreground group-aria-[current=page]:text-foreground">
          {title}
        </span>
      </MotionLink>

      {!isLast && (
        <>
          <span className="block h-px w-(--normal-line-width) bg-foreground/20" />
          <span className="block h-px w-(--normal-line-width) bg-foreground/20" />
        </>
      )}
    </>
  )
})

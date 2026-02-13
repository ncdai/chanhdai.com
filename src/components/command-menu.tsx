"use client"

import { useCommandState } from "cmdk"
import type { LucideProps } from "lucide-react"
import {
  AwardIcon,
  BookmarkIcon,
  BoxIcon,
  BriefcaseBusinessIcon,
  CircleCheckBigIcon,
  CornerDownLeftIcon,
  DownloadIcon,
  FileTextIcon,
  HeartIcon,
  LayersIcon,
  MoonStarIcon,
  MousePointer2Icon,
  QuoteIcon,
  RssIcon,
  SunMediumIcon,
  TextIcon,
  TextInitialIcon,
  TriangleDashedIcon,
  TypeIcon,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { toast } from "sonner"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import type { PostPreview } from "@/features/blog/types/post"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"
import { useDuckFollowerVisibility } from "@/hooks/use-duck-follower-visibility"
import { useSound } from "@/hooks/use-sound"
import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"
import { copyToClipboardWithEvent } from "@/utils/copy"

import { ChanhDaiMark, getMarkSVG } from "./chanhdai-mark"
import { getWordmarkSVG } from "./chanhdai-wordmark"
import { ComponentIcon, Icons } from "./icons"
import { Button } from "./ui/button"
import { Kbd, KbdGroup } from "./ui/kbd"
import { Separator } from "./ui/separator"

type CommandLinkItem = {
  title: string
  href: string

  icon?: React.ComponentType<LucideProps>
  iconImage?: string
  keywords?: string[]
  openInNewTab?: boolean
}

const MENU_LINKS: CommandLinkItem[] = [
  {
    title: "Portfolio",
    href: "/",
    icon: ChanhDaiMark,
  },
  {
    title: "Components",
    href: "/components",
    icon: Icons.react,
  },
  {
    title: "Blog",
    href: "/blog",
    icon: RssIcon,
  },
]

const PORTFOLIO_LINKS: CommandLinkItem[] = [
  {
    title: "About",
    href: "/#about",
    icon: TextInitialIcon,
  },
  {
    title: "Testimonials",
    href: "/testimonials",
    icon: QuoteIcon,
  },
  {
    title: "Tech Stack",
    href: "/#stack",
    icon: LayersIcon,
  },
  {
    title: "Experience",
    href: "/#experience",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Projects",
    href: "/#projects",
    icon: BoxIcon,
  },
  {
    title: "Honors & Awards",
    href: "/#awards",
    icon: AwardIcon,
  },
  {
    title: "Certifications",
    href: "/#certs",
    icon: CircleCheckBigIcon,
  },
  {
    title: "Bookmarks",
    href: "/#bookmarks",
    icon: BookmarkIcon,
  },
  {
    title: "Download vCard",
    href: "/vcard",
    icon: DownloadIcon,
  },
]

const SOCIAL_LINK_ITEMS: CommandLinkItem[] = SOCIAL_LINKS.map((item) => ({
  title: item.title,
  href: item.href,
  iconImage: item.icon,
  openInNewTab: true,
}))

const OTHER_LINK_ITEMS: CommandLinkItem[] = [
  {
    title: "Sponsors",
    href: "/sponsors",
    icon: HeartIcon,
  },
  {
    title: "llms.txt",
    href: "/llms.txt",
    icon: FileTextIcon,
    openInNewTab: true,
  },
  {
    title: "RSS Feed",
    href: "/rss",
    icon: RssIcon,
    openInNewTab: true,
  },
]

export function CommandMenu({ posts }: { posts: PostPreview[] }) {
  const router = useRouter()

  const { setTheme, resolvedTheme } = useTheme()

  const [open, setOpen] = useState(false)

  const playClick = useSound("/audio/ui-sounds/click.wav")

  const [, setIsDuckFollowerVisible] = useDuckFollowerVisibility()

  useHotkeys("mod+k, slash", (e) => {
    e.preventDefault()

    setOpen((open) => {
      if (!open) {
        trackEvent({
          name: "open_command_menu",
          properties: {
            method: "keyboard",
            key: e.key === "/" ? "/" : e.metaKey ? "cmd+k" : "ctrl+k",
          },
        })
      }
      return !open
    })
  })

  const handleOpenLink = useCallback(
    (href: string, openInNewTab = false) => {
      setOpen(false)

      trackEvent({
        name: "command_menu_action",
        properties: {
          action: "navigate",
          href: href,
          open_in_new_tab: openInNewTab,
        },
      })

      if (openInNewTab) {
        window.open(href, "_blank", "noopener")
      } else {
        router.push(href)
      }
    },
    [router]
  )

  const handleCopyText = useCallback((text: string, message: string) => {
    setOpen(false)
    copyToClipboardWithEvent(text, {
      name: "command_menu_action",
      properties: {
        action: "copy",
        text: text,
      },
    })
    toast.success(message)
  }, [])

  const createThemeHandler = useCallback(
    (theme: "light" | "dark" | "system") => () => {
      setOpen(false)
      playClick(0.5)

      trackEvent({
        name: "command_menu_action",
        properties: {
          action: "change_theme",
          theme: theme,
        },
      })

      setTheme(theme)

      // if (!document.startViewTransition) {
      //   setTheme(theme);
      //   return;
      // }

      // document.startViewTransition(() => setTheme(theme));
    },
    [playClick, setTheme]
  )

  const handleToggleDuckFollower = useCallback(() => {
    setOpen(false)
    setIsDuckFollowerVisible((isVisible) => !isVisible)

    trackEvent({
      name: "command_menu_action",
      properties: {
        action: "toggle_duck_follower",
      },
    })
  }, [setIsDuckFollowerVisible])

  const { componentLinks, blogLinks } = useMemo(
    () => ({
      componentLinks: posts
        .filter((post) => post.category === "components")
        .sort((a, b) =>
          a.title.localeCompare(b.title, "en", {
            sensitivity: "base",
          })
        )
        .map(postToCommandLinkItem),
      blogLinks: posts
        .filter((post) => post.category !== "components")
        .map(postToCommandLinkItem),
    }),
    [posts]
  )

  return (
    <>
      <Button
        variant="secondary"
        className={cn(
          "h-8 gap-1.5 rounded-full border border-input bg-white px-2.5 text-muted-foreground shadow-xs select-none hover:bg-white dark:bg-input/30 dark:hover:bg-input/30",
          "relative before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]"
        )}
        onClick={() => {
          setOpen(true)
          trackEvent({
            name: "open_command_menu",
            properties: {
              method: "click",
            },
          })
        }}
      >
        <Icons.search aria-hidden />

        <span className="font-sans text-sm/4 font-medium sm:hidden">
          Search…
        </span>

        <KbdGroup className="hidden sm:in-[.os-macos_&]:flex">
          <Kbd className="w-5 min-w-5">⌘</Kbd>
          <Kbd className="w-5 min-w-5">K</Kbd>
        </KbdGroup>

        <KbdGroup className="hidden sm:not-[.os-macos_&]:flex">
          <Kbd>Ctrl</Kbd>
          <Kbd className="w-5 min-w-5">K</Kbd>
        </KbdGroup>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandMenuInput />

        <CommandList className="min-h-80 supports-timeline-scroll:scroll-fade-effect-y">
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandLinkGroup
            heading="Menu"
            links={MENU_LINKS}
            onLinkSelect={handleOpenLink}
          />

          <CommandLinkGroup
            heading="Portfolio"
            links={PORTFOLIO_LINKS}
            onLinkSelect={handleOpenLink}
          />

          <CommandLinkGroup
            heading="Components"
            links={componentLinks}
            fallbackIcon={Icons.react}
            onLinkSelect={handleOpenLink}
          />

          <CommandLinkGroup
            heading="Blog"
            links={blogLinks}
            fallbackIcon={TextIcon}
            onLinkSelect={handleOpenLink}
          />

          <CommandLinkGroup
            heading="Social Links"
            links={SOCIAL_LINK_ITEMS}
            onLinkSelect={handleOpenLink}
          />

          <CommandGroup heading="Brand Assets">
            <CommandItem
              onSelect={() => {
                handleCopyText(
                  getMarkSVG(resolvedTheme === "light" ? "#000" : "#fff"),
                  "Mark as SVG copied"
                )
              }}
            >
              <ChanhDaiMark />
              Copy Mark as SVG
            </CommandItem>

            <CommandItem
              onSelect={() => {
                handleCopyText(
                  getWordmarkSVG(resolvedTheme === "light" ? "#000" : "#fff"),
                  "Logotype as SVG copied"
                )
              }}
            >
              <TypeIcon />
              Copy Logotype as SVG
            </CommandItem>

            <CommandItem
              onSelect={() => handleOpenLink("/blog/chanhdai-brand")}
            >
              <TriangleDashedIcon />
              Brand Guidelines
            </CommandItem>

            <CommandItem asChild>
              <a href="https://assets.chanhdai.com/chanhdai-brand.zip" download>
                <DownloadIcon />
                Download Brand Assets
              </a>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Theme">
            <CommandItem
              keywords={["theme"]}
              onSelect={createThemeHandler("light")}
            >
              <SunMediumIcon />
              Light
            </CommandItem>
            <CommandItem
              keywords={["theme"]}
              onSelect={createThemeHandler("dark")}
            >
              <MoonStarIcon />
              Dark
            </CommandItem>
            <CommandItem
              keywords={["theme"]}
              onSelect={createThemeHandler("system")}
            >
              <Icons.contrast />
              Auto
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Interactive Features">
            <CommandItem onSelect={handleToggleDuckFollower}>
              <MousePointer2Icon />
              Toggle Duck Follower
            </CommandItem>
          </CommandGroup>

          <CommandLinkGroup
            heading="Other"
            links={OTHER_LINK_ITEMS}
            onLinkSelect={handleOpenLink}
          />
        </CommandList>

        <CommandMenuFooter />
      </CommandDialog>
    </>
  )
}

function CommandMenuInput() {
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    if (searchValue.length >= 2) {
      const timeoutId = setTimeout(() => {
        trackEvent({
          name: "command_menu_search",
          properties: {
            query: searchValue,
            query_length: searchValue.length,
          },
        })
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [searchValue])

  return (
    <CommandInput
      placeholder="Type a command or search…"
      value={searchValue}
      onValueChange={setSearchValue}
    />
  )
}

function CommandLinkGroup({
  heading,
  links,
  fallbackIcon,
  onLinkSelect,
}: {
  heading: string
  links: CommandLinkItem[]
  fallbackIcon?: React.ComponentType<LucideProps>
  onLinkSelect: (href: string, openInNewTab?: boolean) => void
}) {
  return (
    <CommandGroup heading={heading}>
      {links.map((link) => {
        const Icon = link?.icon ?? fallbackIcon ?? React.Fragment

        return (
          <CommandItem
            key={link.href}
            keywords={link.keywords}
            onSelect={() => onLinkSelect(link.href, link.openInNewTab)}
          >
            {link?.iconImage ? (
              <Image
                className="rounded-sm corner-squircle supports-corner-shape:rounded-[50%]"
                src={link.iconImage}
                alt={link.title}
                width={16}
                height={16}
                unoptimized
              />
            ) : (
              <Icon />
            )}
            {link.title}
          </CommandItem>
        )
      })}
    </CommandGroup>
  )
}

type CommandKind = "command" | "page" | "link"

type CommandMetaMap = Map<
  string,
  {
    commandKind: CommandKind
  }
>

function buildCommandMetaMap() {
  const commandMetaMap: CommandMetaMap = new Map()

  commandMetaMap.set("Download vCard", { commandKind: "command" })

  commandMetaMap.set("Light", { commandKind: "command" })
  commandMetaMap.set("Dark", { commandKind: "command" })
  commandMetaMap.set("Auto", { commandKind: "command" })

  commandMetaMap.set("Copy Mark as SVG", {
    commandKind: "command",
  })
  commandMetaMap.set("Copy Logotype as SVG", {
    commandKind: "command",
  })
  commandMetaMap.set("Download Brand Assets", {
    commandKind: "command",
  })

  SOCIAL_LINK_ITEMS.forEach((item) => {
    commandMetaMap.set(item.title, {
      commandKind: "link",
    })
  })

  return commandMetaMap
}

const COMMAND_META_MAP = buildCommandMetaMap()

const ENTER_ACTION_LABELS: Record<CommandKind, string> = {
  command: "Run Command",
  page: "Go to Page",
  link: "Open Link",
}

function CommandMenuFooter() {
  const selectedCommandKind = useCommandState(
    (state) => COMMAND_META_MAP.get(state.value)?.commandKind ?? "page"
  )

  return (
    <>
      <div className="flex h-10" />

      <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-between gap-2 rounded-b-2xl border-t bg-zinc-100/30 px-4 text-xs font-medium dark:bg-zinc-800/30">
        <ChanhDaiMark className="size-6 text-muted-foreground" aria-hidden />

        <div className="flex shrink-0 items-center gap-2">
          <span>{ENTER_ACTION_LABELS[selectedCommandKind]}</span>
          <Kbd>
            <CornerDownLeftIcon />
          </Kbd>
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
          <span className="text-muted-foreground">Exit</span>
          <Kbd>Esc</Kbd>
        </div>
      </div>
    </>
  )
}

function postToCommandLinkItem(post: PostPreview): CommandLinkItem {
  const isComponent = post.category === "components"

  const IconComponent = isComponent
    ? (props: LucideProps) => <ComponentIcon {...props} variant={post.icon} />
    : undefined

  return {
    title: post.title,
    href: isComponent ? `/components/${post.slug}` : `/blog/${post.slug}`,
    keywords: isComponent ? ["component"] : undefined,
    icon: IconComponent,
  }
}

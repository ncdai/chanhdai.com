"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { copyToClipboardWithEvent } from "@/utils/copy"
import { useRouter } from "@bprogress/next/app"
import { useTiks } from "@rexa-developer/tiks/react"
import {
  BookmarkIcon,
  BoxIcon,
  BriefcaseBusinessIcon,
  CircleCheckBigIcon,
  CornerDownLeftIcon,
  CrownIcon,
  DownloadIcon,
  FileTextIcon,
  GraduationCapIcon,
  LayersIcon,
  LineChartIcon,
  MonitorIcon,
  MoonStarIcon,
  QuoteIcon,
  RssIcon,
  ScaleIcon,
  SquareDashedIcon,
  SunMediumIcon,
  TextInitialIcon,
  TypeIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useHotkeys } from "react-hotkeys-hook"
import { toast } from "sonner"

import { trackEvent } from "@/lib/events"
import { useClickSound } from "@/hooks/soundcn/use-click-sound"
import { useMutationObserver } from "@/hooks/use-mutation-observer"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { trackBookmarkClick } from "@/features/bookmark/lib/analytics"
import { getBookmarkExternalHref } from "@/features/bookmark/lib/bookmark-link"
import type { BookmarkPreview } from "@/features/bookmark/types"
import { ComponentIcon } from "@/features/doc/components/component-icon"
import type { DocPreview } from "@/features/doc/types/document"
import { SOCIAL_ICONS } from "@/features/portfolio/components/social-link-icons"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"

import { ChanhDaiMark, getMarkSVG } from "./chanhdai-mark"
import { getWordmarkSVG } from "./chanhdai-wordmark"
import {
  FavouriteIcon,
  GridViewIcon,
  NewsIcon,
  ReactIcon,
  SearchIcon,
} from "./icons"
import { Button } from "./ui/button"
import { Kbd, KbdGroup } from "./ui/kbd"

type CommandKind =
  | "command"
  | "page"
  | "link"
  | "component"
  | "block"
  | "bookmark"

type CommandLinkItem = {
  title: string
  href: string
  kind: CommandKind
  icon?: React.ReactElement
  iconImage?: string
  shortcut?: string
  keywords?: string[]
  openInNewTab?: boolean
}

type BlockItem = {
  name: string
  description: string
  categories: string[]
}

const MENU_LINKS: CommandLinkItem[] = [
  {
    title: "Home",
    href: "/",
    kind: "page",
    icon: <ChanhDaiMark />,
    shortcut: "GH",
  },
  {
    title: "Components",
    href: "/components",
    kind: "page",
    icon: <ReactIcon />,
    shortcut: "GC",
  },
  {
    title: "Blocks",
    href: "/blocks",
    kind: "page",
    icon: <GridViewIcon />,
    shortcut: "GB",
  },
  {
    title: "Blog",
    href: "/blog",
    kind: "page",
    icon: <NewsIcon />,
    shortcut: "GL",
  },
  {
    title: "Sponsors",
    href: "/sponsors",
    kind: "page",
    icon: <FavouriteIcon />,
    shortcut: "GS",
  },
  {
    title: "Testimonials",
    href: "/testimonials",
    kind: "page",
    icon: <QuoteIcon strokeWidth={1.5} />,
    shortcut: "GT",
  },
]

const PORTFOLIO_LINKS: CommandLinkItem[] = [
  {
    title: "Hello",
    href: "/#hello",
    kind: "page",
    icon: <TextInitialIcon />,
  },
  {
    title: "Stack",
    href: "/#stack",
    kind: "page",
    icon: <LayersIcon />,
  },
  {
    title: "Experience",
    href: "/#experience",
    kind: "page",
    icon: <BriefcaseBusinessIcon />,
  },
  {
    title: "Education",
    href: "/#education",
    kind: "page",
    icon: <GraduationCapIcon />,
  },
  {
    title: "Projects",
    href: "/#projects",
    kind: "page",
    icon: <BoxIcon />,
  },
  {
    title: "Awards",
    href: "/#awards",
    kind: "page",
    icon: <CrownIcon />,
  },
  {
    title: "Certifications",
    href: "/#certs",
    kind: "page",
    icon: <CircleCheckBigIcon />,
  },
  {
    title: "Intellectual property",
    href: "/#ip",
    kind: "page",
    icon: <ScaleIcon />,
  },
  {
    title: "Bookmarks",
    href: "/#bookmarks",
    kind: "page",
    icon: <BookmarkIcon />,
  },
  {
    title: "Insights",
    href: "/#insights",
    kind: "page",
    icon: <LineChartIcon />,
  },
]

const SOCIAL_LINK_ITEMS: CommandLinkItem[] = SOCIAL_LINKS.map((item) => ({
  title: item.title,
  href: item.href,
  kind: "link",
  icon: SOCIAL_ICONS[item.name],
  openInNewTab: true,
}))

const OTHER_LINK_ITEMS: CommandLinkItem[] = [
  {
    title: "Download vCard",
    href: "/vcard",
    kind: "command",
    icon: <DownloadIcon />,
  },
  {
    title: "llms.txt",
    href: "/llms.txt",
    kind: "link",
    icon: <FileTextIcon />,
    openInNewTab: true,
  },
  {
    title: "RSS Feed",
    href: "/rss",
    kind: "link",
    icon: <RssIcon />,
    openInNewTab: true,
  },
]

export function CommandMenu({
  docs,
  blocks,
  bookmarks,
  enabledHotkeys = false,
}: {
  docs: DocPreview[]
  blocks: BlockItem[]
  bookmarks: BookmarkPreview[]
  enabledHotkeys?: boolean
}) {
  const router = useRouter()

  const { setTheme } = useTheme()

  const [open, setOpen] = useState(false)

  const [selectedCommandKind, setSelectedCommandKind] =
    useState<CommandKind | null>(null)

  const [click] = useClickSound()

  const { success: tiksSuccess } = useTiks()

  useHotkeys(
    "mod+k, slash",
    (e) => {
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
    },
    { enabled: enabledHotkeys }
  )

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

  const handleCopyText = useCallback(
    (text: string, message: string) => {
      setOpen(false)
      copyToClipboardWithEvent(text, {
        name: "command_menu_action",
        properties: {
          action: "copy",
          text: text,
        },
      })
      toast.success(message)
      tiksSuccess()
    },
    [tiksSuccess]
  )

  const createThemeHandler = useCallback(
    (theme: "light" | "dark" | "system") => () => {
      click()
      setOpen(false)

      trackEvent({
        name: "command_menu_action",
        properties: {
          action: "change_theme",
          theme: theme,
        },
      })

      setTheme(theme)
    },
    [click, setTheme]
  )

  const components = useMemo(
    () =>
      docs
        .filter((doc) => doc.category === "components")
        .sort((a, b) =>
          a.title.localeCompare(b.title, "en", {
            sensitivity: "base",
          })
        ),
    [docs]
  )

  const componentsGroup = useMemo(() => {
    if (!components || components.length === 0) {
      return null
    }

    return (
      <CommandGroup heading="Components">
        {components.map((component) => {
          return (
            <CommandMenuItem
              key={component.slug}
              keywords={["component"]}
              onHighlight={() => {
                setSelectedCommandKind("component")
              }}
              onSelect={() => {
                handleOpenLink(`/components/${component.slug}`)
              }}
            >
              <ComponentIcon slug={component.slug} />
              <p className="line-clamp-1">{component.title}</p>
            </CommandMenuItem>
          )
        })}
      </CommandGroup>
    )
  }, [components, handleOpenLink])

  const blocksGroup = useMemo(() => {
    if (!blocks || blocks.length === 0) {
      return null
    }

    return (
      <CommandGroup heading="Blocks">
        {blocks.map((block) => {
          return (
            <CommandMenuItem
              key={block.name}
              keywords={["block"]}
              onHighlight={() => {
                setSelectedCommandKind("block")
              }}
              onSelect={() => {
                handleOpenLink(`/blocks/${block.categories[0]}/${block.name}`)
              }}
            >
              <GridViewIcon />
              <p className="line-clamp-1">{block.description}</p>
              <span className="ml-auto font-mono text-xs font-normal text-muted-foreground tabular-nums max-sm:hidden">
                {block.name}
              </span>
            </CommandMenuItem>
          )
        })}
      </CommandGroup>
    )
  }, [blocks, handleOpenLink])

  const blogLinks = useMemo(
    () =>
      docs
        .filter((doc) => doc.category === "blog")
        .map<CommandLinkItem>((doc) => ({
          title: doc.title,
          href: `/blog/${doc.slug}`,
          kind: "page",
          keywords: ["blog"],
        })),
    [docs]
  )

  const bookmarksGroup = useMemo(() => {
    if (!bookmarks || bookmarks.length === 0) {
      return null
    }

    return (
      <CommandGroup heading="Bookmarks">
        {bookmarks.map((bookmark) => {
          return (
            <CommandMenuItem
              key={bookmark.url}
              keywords={["bookmark"]}
              onHighlight={() => {
                setSelectedCommandKind("bookmark")
              }}
              onSelect={() => {
                trackBookmarkClick({
                  url: bookmark.url,
                  surface: "palette",
                })

                handleOpenLink(getBookmarkExternalHref(bookmark.url), true)
              }}
            >
              <BookmarkIcon />
              <p className="line-clamp-1">{bookmark.title}</p>
            </CommandMenuItem>
          )
        })}
      </CommandGroup>
    )
  }, [bookmarks, handleOpenLink])

  const handleLinkHighlight = useCallback((link: CommandLinkItem) => {
    setSelectedCommandKind(link.kind)
  }, [])

  const handleCommandHighlight = useCallback(() => {
    setSelectedCommandKind("command")
  }, [])

  return (
    <>
      <CommandMenuTrigger
        onClick={() => {
          setOpen(true)
          trackEvent({
            name: "open_command_menu",
            properties: {
              method: "click",
            },
          })
        }}
      />

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandMenuInput />

        <div className="rounded-xl bg-background ring-1 ring-border">
          <CommandList className="min-h-80 scroll-fade">
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandLinkGroup
              heading="Menu"
              links={MENU_LINKS}
              onLinkHighlight={handleLinkHighlight}
              onLinkSelect={handleOpenLink}
            />

            <CommandLinkGroup
              heading="Portfolio"
              links={PORTFOLIO_LINKS}
              onLinkHighlight={handleLinkHighlight}
              onLinkSelect={handleOpenLink}
            />

            {componentsGroup}

            {blocksGroup}

            <CommandLinkGroup
              heading="Blog"
              links={blogLinks}
              fallbackIcon={<NewsIcon />}
              onLinkHighlight={handleLinkHighlight}
              onLinkSelect={handleOpenLink}
            />

            {bookmarksGroup}

            <CommandLinkGroup
              heading="Social Links"
              links={SOCIAL_LINK_ITEMS}
              onLinkHighlight={handleLinkHighlight}
              onLinkSelect={handleOpenLink}
            />

            <CommandGroup heading="Brand Assets">
              <CommandMenuItem
                onHighlight={handleCommandHighlight}
                onSelect={() => {
                  handleCopyText(getMarkSVG(), "Mark as SVG copied")
                }}
              >
                <ChanhDaiMark />
                Copy Mark as SVG
              </CommandMenuItem>

              <CommandMenuItem
                onHighlight={handleCommandHighlight}
                onSelect={() => {
                  handleCopyText(getWordmarkSVG(), "Logotype as SVG copied")
                }}
              >
                <TypeIcon />
                Copy Logotype as SVG
              </CommandMenuItem>

              <CommandMenuItem
                onHighlight={() => {
                  setSelectedCommandKind("link")
                }}
                onSelect={() => handleOpenLink("/blog/chanhdai-brand")}
              >
                <SquareDashedIcon />
                Brand Guidelines
              </CommandMenuItem>

              <CommandMenuItem onHighlight={handleCommandHighlight} asChild>
                <a
                  href="https://assets.chanhdai.com/chanhdai-brand.zip"
                  download
                >
                  <DownloadIcon />
                  Download Brand Assets
                </a>
              </CommandMenuItem>
            </CommandGroup>

            <CommandGroup heading="Theme">
              <CommandMenuItem
                keywords={["theme"]}
                onHighlight={handleCommandHighlight}
                onSelect={createThemeHandler("light")}
              >
                <SunMediumIcon />
                Light
              </CommandMenuItem>
              <CommandMenuItem
                keywords={["theme"]}
                onHighlight={handleCommandHighlight}
                onSelect={createThemeHandler("dark")}
              >
                <MoonStarIcon />
                Dark
              </CommandMenuItem>
              <CommandMenuItem
                keywords={["theme"]}
                onHighlight={handleCommandHighlight}
                onSelect={createThemeHandler("system")}
              >
                <MonitorIcon />
                System
              </CommandMenuItem>
            </CommandGroup>

            <CommandLinkGroup
              heading="Other"
              links={OTHER_LINK_ITEMS}
              onLinkHighlight={handleLinkHighlight}
              onLinkSelect={handleOpenLink}
            />
          </CommandList>
        </div>

        <CommandMenuFooter selectedCommandKind={selectedCommandKind} />
      </CommandDialog>
    </>
  )
}

export default CommandMenu

function CommandMenuTrigger({ ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="command-menu-trigger"
      className="gap-1.5 border-none px-1.5 text-muted-foreground will-change-[scale] select-none"
      variant="ghost"
      size="sm"
      {...props}
    >
      <SearchIcon />

      <span className="font-sans text-sm/4 font-medium sm:hidden">Search…</span>

      <KbdGroup className="hidden gap-0.75 sm:in-[.os-macos_&]:flex">
        <Kbd className="w-5 min-w-auto">⌘</Kbd>
        <Kbd className="w-5 min-w-auto">K</Kbd>
      </KbdGroup>

      <KbdGroup className="hidden gap-0.75 sm:not-[.os-macos_&]:flex">
        <Kbd>Ctrl</Kbd>
        <Kbd className="w-5 min-w-auto">K</Kbd>
      </KbdGroup>
    </Button>
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

function CommandMenuItem({
  children,
  onHighlight,
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  onHighlight?: () => void
  "data-selected"?: string
  "aria-selected"?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  useMutationObserver(ref, (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-selected" &&
        ref.current?.getAttribute("aria-selected") === "true"
      ) {
        onHighlight?.()
      }
    })
  })

  return (
    <CommandItem ref={ref} {...props}>
      {children}
    </CommandItem>
  )
}

function CommandLinkGroup({
  heading,
  links,
  fallbackIcon,
  onLinkHighlight,
  onLinkSelect,
}: {
  heading: string
  links: CommandLinkItem[]
  fallbackIcon?: React.ReactElement
  onLinkHighlight: (link: CommandLinkItem) => void
  onLinkSelect: (href: string, openInNewTab?: boolean) => void
}) {
  return (
    <CommandGroup heading={heading}>
      {links.map((link) => {
        const icon = link?.icon ?? fallbackIcon ?? <React.Fragment />

        return (
          <CommandMenuItem
            key={link.href}
            keywords={link.keywords}
            onHighlight={() => onLinkHighlight(link)}
            onSelect={() => onLinkSelect(link.href, link.openInNewTab)}
          >
            {link?.iconImage ? (
              <img
                className="size-4 rounded-sm"
                src={link.iconImage}
                alt={link.title}
              />
            ) : (
              icon
            )}

            <p className="line-clamp-1">{link.title}</p>

            {link.shortcut && (
              <CommandShortcut className="font-mono tracking-[0.2em] max-sm:hidden">
                {link.shortcut}
              </CommandShortcut>
            )}
          </CommandMenuItem>
        )
      })}
    </CommandGroup>
  )
}

const ENTER_ACTION_LABELS: Record<CommandKind, string> = {
  command: "Run command",
  page: "Go to page",
  link: "Open link",
  component: "Go to component",
  block: "Go to block",
  bookmark: "Open bookmark",
}

function CommandMenuFooter({
  selectedCommandKind,
}: {
  selectedCommandKind: CommandKind | null
}) {
  return (
    <>
      <div className="flex h-10" />

      <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-between gap-2 rounded-b-2xl px-4 text-xs font-medium">
        <ChanhDaiMark className="size-6 text-muted-foreground" />

        <div className="flex items-center gap-2 max-sm:hidden">
          <span>{ENTER_ACTION_LABELS[selectedCommandKind ?? "page"]}</span>
          <Kbd>
            <CornerDownLeftIcon />
          </Kbd>
        </div>
      </div>
    </>
  )
}

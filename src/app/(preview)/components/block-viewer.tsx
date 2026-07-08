"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { getRegistryItemNamespace, getRegistryItemUrl } from "@/utils/registry"
import { IconCheck, IconCopy, IconX } from "@tabler/icons-react"
import { CheckIcon, ChevronRightIcon } from "lucide-react"
import type { PanelImperativeHandle } from "react-resizable-panels"
import type {
  RegistryItem,
  registryItemFileSchema,
  registryItemSchema,
} from "shadcn/schema"
import type { z } from "zod"

import { trackEvent } from "@/lib/events"
import type {
  createFileTreeForRegistryItemFiles,
  FileTree,
} from "@/lib/registry"
import { cn } from "@/lib/utils"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/base/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/base/ui/collapsible"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/base/ui/popover"
import { Separator } from "@/components/base/ui/separator"
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
} from "@/components/base/ui/sidebar"
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/components/base/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/base/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import {
  DesktopIcon,
  FolderIcon,
  FolderOpenIcon,
  FullScreenIcon,
  getIconForLanguageExtension,
  RefreshIcon,
  SmartPhoneIcon,
  TabletIcon,
  TerminalIcon,
} from "@/components/icons"
import { OpenInV0Button } from "@/components/v0-open-button"
import { CopyButton, CopyStateIcon } from "@/registry/components/copy-button"
import { sendToIframe } from "@/app/(preview)/hooks/use-iframe-sync"
import type { PreviewSearchParams } from "@/app/(preview)/lib/search-params"
import { serializePreviewSearchParams } from "@/app/(preview)/lib/search-params"

type View = "preview" | "code"

type BlockViewerContext = {
  item: z.infer<typeof registryItemSchema>

  setView: (view: View) => void

  activeFile: string | null
  setActiveFile: (file: string) => void

  tree: ReturnType<typeof createFileTreeForRegistryItemFiles> | null
  highlightedFiles:
    | (z.infer<typeof registryItemFileSchema> & {
        highlightedContent: string
      })[]
    | null

  iframeKey?: number
  setIframeKey?: React.Dispatch<React.SetStateAction<number>>

  resizablePanelRef: React.RefObject<PanelImperativeHandle | null> | null

  themes: Map<string, RegistryItem>
  theme: PreviewSearchParams["theme"]
  setTheme: (theme: PreviewSearchParams["theme"]) => void
}

const BlockViewerContext = createContext<BlockViewerContext | null>(null)

function useBlockViewer() {
  const context = useContext(BlockViewerContext)
  if (!context) {
    throw new Error("useBlockViewer must be used within a BlockViewerProvider.")
  }
  return context
}

function BlockViewerProvider({
  item,
  tree,
  highlightedFiles,
  themes,
  children,
}: Pick<BlockViewerContext, "item" | "tree" | "highlightedFiles" | "themes"> & {
  children: React.ReactNode
}) {
  const [view, setView] = useState<View>("preview")
  const [theme, setTheme] = useState<PreviewSearchParams["theme"]>(null)

  const [activeFile, setActiveFile] = useState<
    BlockViewerContext["activeFile"]
  >(highlightedFiles?.[0].target ?? null)

  const [iframeKey, setIframeKey] = useState(0)

  const resizablePanelRef = useRef<PanelImperativeHandle>(null)

  return (
    <BlockViewerContext.Provider
      value={{
        item,
        setView,
        activeFile,
        setActiveFile,
        tree,
        highlightedFiles,
        iframeKey,
        setIframeKey,
        resizablePanelRef,
        themes,
        theme,
        setTheme,
      }}
    >
      <div
        id={item.name}
        className="flex min-w-0 scroll-mt-14 flex-col-reverse items-stretch gap-2 p-2 md:flex-col lg:pr-0"
        style={
          {
            "--height": item.meta?.iframeHeight ?? "768px",
          } as React.CSSProperties
        }
      >
        <Tabs
          value={view}
          onValueChange={(value) => {
            setView(value as View)
            trackEvent({
              name: "block_viewer_tab_change",
              properties: { block: item.name, tab: value },
            })
          }}
        >
          {children}
        </Tabs>
      </div>
    </BlockViewerContext.Provider>
  )
}

type BlockViewerProps = Pick<
  BlockViewerContext,
  "item" | "tree" | "highlightedFiles" | "themes"
>

export function BlockViewer({
  item,
  tree,
  highlightedFiles,
  themes,
  ...props
}: BlockViewerProps) {
  return (
    <BlockViewerProvider
      item={item}
      tree={tree}
      highlightedFiles={highlightedFiles}
      themes={themes}
      {...props}
    >
      <BlockViewerToolbar />
      <div className="screen-line-top h-px max-lg:hidden" />
      <BlockViewerView />
      <BlockViewerCode />
      <BlockViewerMobile />
    </BlockViewerProvider>
  )
}

function BlockViewerToolbar() {
  const { setView, item, resizablePanelRef, setIframeKey, theme } =
    useBlockViewer()

  const { state, copy } = useCopyToClipboard()

  return (
    <div className="flex w-full items-center gap-2 px-2 max-lg:hidden">
      <TabsList>
        <TabsTrigger className="px-3" value="preview">
          Preview
        </TabsTrigger>
        <TabsTrigger className="px-3" value="code">
          Code
        </TabsTrigger>
        <TabsIndicator />
      </TabsList>

      <Separator
        orientation="vertical"
        className="mx-2 data-vertical:h-4 data-vertical:self-center"
      />

      <a
        href={`#${item.name}`}
        className="line-clamp-1 text-sm font-medium link"
      >
        {item.description?.replace(/\.$/, "")}
      </a>

      <div className="ml-auto flex items-center gap-2">
        <ThemePicker />

        <div className="flex h-8 items-center gap-0.75 rounded-lg border p-0.75">
          <ToggleGroup
            className="gap-0.75 *:data-[slot=toggle-group-item]:h-6 *:data-[slot=toggle-group-item]:min-w-6 *:data-[slot=toggle-group-item]:rounded-sm! *:data-[slot=toggle-group-item]:px-0"
            defaultValue={["100%"]}
            onValueChange={([value]) => {
              setView("preview")
              resizablePanelRef?.current?.resize(value || "100%")
              trackEvent({
                name: "block_viewer_resize",
                properties: { block: item.name, size: value || "100%" },
              })
            }}
          >
            <ToggleGroupItem aria-label="Mobile" value="30%">
              <SmartPhoneIcon />
            </ToggleGroupItem>

            <ToggleGroupItem aria-label="Tablet" value="60%">
              <TabletIcon />
            </ToggleGroupItem>

            <ToggleGroupItem aria-label="Desktop" value="100%">
              <DesktopIcon />
            </ToggleGroupItem>
          </ToggleGroup>

          <Separator
            orientation="vertical"
            className="data-vertical:h-4 data-vertical:self-center"
          />

          <Button
            className="rounded-sm border-none dark:hover:bg-muted"
            variant="ghost"
            size="icon-xs"
            nativeButton={false}
            render={
              <a
                href={serializePreviewSearchParams(`/preview/${item.name}`, {
                  theme,
                })}
                target="_blank"
                rel="noopener"
                aria-label="Open in New Tab"
                onClick={() =>
                  trackEvent({
                    name: "block_viewer_open_preview",
                    properties: { block: item.name },
                  })
                }
              >
                <FullScreenIcon className="size-4" />
              </a>
            }
          />

          <Separator
            orientation="vertical"
            className="data-vertical:h-4 data-vertical:self-center"
          />

          <Button
            className="rounded-sm border-none dark:hover:bg-muted"
            variant="ghost"
            size="icon-xs"
            aria-label="Refresh Preview"
            onClick={() => {
              setView("preview")
              setIframeKey?.((v) => v + 1)
              trackEvent({
                name: "block_viewer_refresh_preview",
                properties: { block: item.name },
              })
            }}
          >
            <RefreshIcon className="size-4" />
          </Button>
        </div>

        <Separator
          orientation="vertical"
          className="mx-2 data-vertical:h-4 data-vertical:self-center"
        />

        <Button
          className="w-fit gap-1.5 px-2 font-mono text-[0.8125rem] font-normal shadow-none active:scale-none [&_svg]:text-muted-foreground"
          variant="outline"
          size="sm"
          onClick={() => {
            const code = `npx shadcn@latest add ${getRegistryItemNamespace(item.name)}`
            copy(code)
            trackEvent({
              name: "copy_npm_command",
              properties: { code },
            })
          }}
        >
          <CopyStateIcon
            state={state}
            idleIcon={<TerminalIcon />}
            doneIcon={<CheckIcon />}
          />
          <span>
            <span className="text-muted-foreground">npx shadcn add</span>{" "}
            {getRegistryItemNamespace(item.name)}
          </span>
        </Button>

        <Separator
          orientation="vertical"
          className="ml-2 data-vertical:h-4 data-vertical:self-center"
        />

        <OpenInV0Button url={getRegistryItemUrl(item.name)} />
      </div>
    </div>
  )
}

function BlockViewerView() {
  const { resizablePanelRef } = useBlockViewer()

  return (
    <TabsContent
      className="flex h-(--height) flex-none max-lg:hidden"
      value="preview"
      keepMounted
    >
      <div className="relative w-full">
        <div className="absolute inset-0 right-2 rounded-xl bg-black/0.75 bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center [--pattern-foreground:var(--color-zinc-950)]/5 dark:bg-white/0.75 dark:[--pattern-foreground:var(--color-white)]/5" />

        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel
            panelRef={resizablePanelRef}
            className="relative overflow-hidden rounded-xl after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:inset-ring-1 after:inset-ring-foreground/10"
            minSize="30%"
            defaultSize="100%"
          >
            <BlockViewerIframe />
          </ResizablePanel>

          <ResizableHandle
            className={cn(
              "relative w-2 -translate-x-4 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              "after:absolute after:top-1/2 after:left-0.5 after:h-12 after:w-1.5 after:translate-x-0 after:-translate-y-1/2 after:rounded-full after:bg-foreground/10 after:transition-all",
              "data-[separator=active]:after:scale-y-125 data-[separator=active]:after:bg-foreground/30 data-[separator=hover]:after:bg-foreground/20"
            )}
            disableDoubleClick
          />

          <ResizablePanel minSize="0%" defaultSize="0%" />
        </ResizablePanelGroup>
      </div>
    </TabsContent>
  )
}

function BlockViewerIframe({ className }: { className?: string }) {
  const { iframeKey, item, theme } = useBlockViewer()

  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) {
      return
    }

    const sendParams = () => {
      sendToIframe(iframe, "preview-params", { theme })
    }

    if (iframe.contentWindow) {
      sendParams()
    }

    iframe.addEventListener("load", sendParams)
    return () => {
      iframe.removeEventListener("load", sendParams)
    }
  }, [theme])

  const iframeSrc = useMemo(
    () => {
      // The iframe src needs to include the serialized preview params
      // for the initial load, but not be reactive to them as it would cause
      // full-iframe reloads on every param change (flashes & loss of state).
      // Further updates of the search params will be sent to the iframe
      // via a postMessage channel, for it to sync its own history onto the host's.
      return serializePreviewSearchParams(`/preview/${item.name}`, { theme })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [iframeKey]
  )

  return (
    <iframe
      key={iframeKey}
      ref={iframeRef}
      className={cn("no-scrollbar w-full bg-background", className)}
      src={iframeSrc}
      loading="lazy"
      height={item.meta?.iframeHeight ?? 768}
    />
  )
}

function BlockViewerCode() {
  const { highlightedFiles, activeFile } = useBlockViewer()

  const file = useMemo(() => {
    return highlightedFiles?.find((file) => file.target === activeFile)
  }, [highlightedFiles, activeFile])

  if (!file) {
    return null
  }

  const language = file.path.split(".").pop() ?? "tsx"

  return (
    <TabsContent
      className="mr-2 flex h-(--height) flex-none gap-2 text-code-foreground max-lg:hidden"
      value="code"
      keepMounted
    >
      <div className="w-72">
        <BlockViewerFileTree />
      </div>

      <figure
        className="my-0 flex min-w-0 flex-1 flex-col overflow-hidden"
        data-rehype-pretty-code-figure=""
      >
        <figcaption
          data-rehype-pretty-code-title
          data-language={language}
          className="h-10 shrink-0"
        >
          {getIconForLanguageExtension(language)}
          <span className="truncate">{file.target}</span>
          <BlockCopyCodeButton />
        </figcaption>

        <div
          key={file?.path}
          className="h-full overflow-hidden rounded-[9px] border bg-code [&_pre]:no-scrollbar [&_pre]:h-full [&_pre]:scroll-fade [&_pre]:overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: file?.highlightedContent ?? "" }}
        />
      </figure>
    </TabsContent>
  )
}

function BlockViewerFileTree() {
  const { tree } = useBlockViewer()

  if (!tree) {
    return null
  }

  return (
    <SidebarProvider className="flex min-h-full flex-col [--sidebar:var(--surface)] dark:[--sidebar-accent:var(--muted)]/50">
      <Sidebar
        collapsible="none"
        className="w-full flex-1 rounded-xl p-1 pt-0 inset-ring-1 inset-ring-border/64"
      >
        <SidebarGroupLabel className="h-10 rounded-none px-4 text-sm">
          Files
        </SidebarGroupLabel>

        <SidebarGroup className="flex-1 rounded-[9px] border bg-background px-0">
          <SidebarGroupContent>
            <SidebarMenu className="translate-x-0 gap-px">
              {tree.map((file, index) => (
                <Tree key={index} item={file} index={1} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </Sidebar>
    </SidebarProvider>
  )
}

function Tree({ item, index }: { item: FileTree; index: number }) {
  const { activeFile, setActiveFile } = useBlockViewer()

  if (!item.children) {
    const language = item.name.split(".").pop() ?? "tsx"
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          data-index={index}
          className="rounded-none pl-(--index) whitespace-nowrap data-active:font-normal [&_svg]:text-muted-foreground"
          style={
            {
              "--index": `${index * (index === 2 ? 1.2 : 1.3)}rem`,
            } as React.CSSProperties
          }
          isActive={item.path === activeFile}
          onClick={() => item.path && setActiveFile(item.path)}
        >
          <ChevronRightIcon className="invisible" />
          {getIconForLanguageExtension(language)}
          {item.name}
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible flex flex-col gap-px data-open:[&>button>svg:first-child]:rotate-90"
        defaultOpen
      >
        <CollapsibleTrigger
          render={
            <SidebarMenuButton
              className={cn(
                "rounded-none pl-(--index) whitespace-nowrap [&_svg]:text-muted-foreground",
                "aria-[expanded=false]:*:data-[slot=folder]:block aria-expanded:*:data-[slot=folder-open]:block"
              )}
              style={
                {
                  "--index": `${index * (index === 1 ? 1 : 1.2)}rem`,
                } as React.CSSProperties
              }
            />
          }
        >
          <ChevronRightIcon className="transition-transform" />
          <FolderIcon data-slot="folder" className="hidden" />
          <FolderOpenIcon data-slot="folder-open" className="hidden" />
          {item.name}
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub className="m-0 w-full translate-x-0 gap-px border-none p-0">
            {item.children.map((subItem, key) => (
              <Tree key={key} item={subItem} index={index + 1} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

function BlockCopyCodeButton() {
  const { item, activeFile } = useBlockViewer()

  const file = useMemo(() => {
    return item.files?.find((file) => file.target === activeFile)
  }, [item.files, activeFile])

  const content = file?.content

  if (!content) {
    return null
  }

  return (
    <CopyButton
      className="absolute top-1.5 right-1.5 size-7 rounded-md border-none text-muted-foreground [&_svg]:text-inherit [&_svg:not([class*='size-'])]:size-4"
      variant="ghost"
      size="icon-xs"
      text={content}
      idleIcon={<IconCopy />}
      doneIcon={<IconCheck />}
      errorIcon={<IconX />}
      onCopySuccess={() => {
        trackEvent({
          name: "copy_block_code",
          properties: {
            name: item.name,
            file: file.path,
          },
        })
      }}
    />
  )
}

function BlockViewerMobile() {
  const { item } = useBlockViewer()

  return (
    <div className="flex flex-col gap-2 lg:hidden">
      <div className="flex items-center gap-2 px-2">
        <div className="line-clamp-2 text-sm font-medium text-balance">
          {item.description?.replace(/\.$/, "")}
        </div>

        <div className="ml-auto shrink-0 font-mono text-sm text-muted-foreground">
          {getRegistryItemNamespace(item.name)}
        </div>
      </div>

      <div className="screen-line-top h-px" />

      <div className="relative overflow-hidden rounded-xl border">
        <BlockViewerIframe />
      </div>
    </div>
  )
}

function ThemePicker() {
  const { item, themes, theme, setTheme } = useBlockViewer()

  const themeItem = theme ? themes.get(theme) : null

  const { shadcnThemes, tweakcnThemes } = useMemo(() => {
    const themesArray = Array.from(themes.values())
    return {
      shadcnThemes: themesArray.filter((t) => t.meta?.source === "shadcn"),
      tweakcnThemes: themesArray.filter((t) => t.meta?.source === "tweakcn"),
    }
  }, [themes])

  const handleThemeSelect = (value: PreviewSearchParams["theme"]) => {
    setTheme(value)
    trackEvent({
      name: "block_viewer_theme_change",
      properties: { block: item.name, theme: value ?? "default" },
    })
  }

  return (
    <Popover modal>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button
                  className="bg-transparent px-1.75 shadow-none dark:border-border dark:bg-transparent dark:aria-expanded:bg-input/50"
                  variant="outline"
                  size="sm"
                  aria-label="Theme"
                >
                  <ThemePalette cssVars={themeItem?.cssVars} />
                </Button>
              }
            />
          }
        />
        <TooltipContent>
          {themeItem?.title || themeItem?.name || "Default"}
        </TooltipContent>
      </Tooltip>

      <PopoverContent
        className="rounded-2xl p-0"
        align="start"
        alignOffset={-8}
      >
        <Command
          className={cn(
            "**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-input-wrapper]_svg]:size-5 **:[[cmdk-input]]:h-10",
            "**:[[cmdk-group]]:px-2",
            "**:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
            "[&_[cmdk-item]_svg]:size-5 **:[[cmdk-item]]:px-2 **:[[cmdk-item]]:py-2"
          )}
        >
          <CommandInput placeholder="Search theme…" />

          <CommandList className="min-h-80 scroll-fade">
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Current theme">
              <CommandItem onSelect={() => handleThemeSelect(null)}>
                <ThemePalette />
                Default
                {!theme && <CheckIcon className="ml-auto" strokeWidth={3} />}
              </CommandItem>
            </CommandGroup>

            <ThemePickerGroup
              title="shadcn/ui"
              themes={shadcnThemes}
              activeTheme={theme}
              onThemeSelect={handleThemeSelect}
            />

            <ThemePickerGroup
              title="tweakcn"
              themes={tweakcnThemes}
              activeTheme={theme}
              onThemeSelect={handleThemeSelect}
            />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function ThemePickerGroup({
  title,
  themes,
  activeTheme,
  onThemeSelect,
}: {
  title: string
  themes: RegistryItem[]
  activeTheme: PreviewSearchParams["theme"]
  onThemeSelect: (theme: PreviewSearchParams["theme"]) => void
}) {
  return (
    <CommandGroup heading={`${title} themes (${themes.length})`}>
      {themes.map((item) => (
        <CommandItem key={item.name} onSelect={() => onThemeSelect(item.name)}>
          <ThemePalette cssVars={item.cssVars} />
          {item.title || item.name}
          {activeTheme === item.name && (
            <CheckIcon className="ml-auto" strokeWidth={3} />
          )}
        </CommandItem>
      ))}
    </CommandGroup>
  )
}

const THEME_PALETTE_KEYS = ["primary", "accent", "muted", "secondary"] as const

function ThemePalette({ cssVars }: { cssVars?: RegistryItem["cssVars"] }) {
  return (
    <div className="flex shrink-0 gap-0.5">
      {THEME_PALETTE_KEYS.map((key) => (
        <div
          key={key}
          className={cn(
            "flex h-4 w-2.5 shrink-0 rounded-xs inset-ring-1 inset-ring-foreground/15",
            "bg-(--color-palette) dark:bg-(--color-palette-dark)"
          )}
          style={
            {
              "--color-palette": cssVars?.light?.[key] ?? `var(--${key})`,
              "--color-palette-dark": cssVars?.dark?.[key] ?? `var(--${key})`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

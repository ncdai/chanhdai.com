"use client"

import { CheckIcon, ChevronRightIcon } from "lucide-react"
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type { PanelImperativeHandle } from "react-resizable-panels"
import type {
  RegistryItem,
  registryItemFileSchema,
  registryItemSchema,
} from "shadcn/schema"
import type { z } from "zod"

import { sendToIframe } from "@/app/(preview)/hooks/use-iframe-sync"
import type { PreviewSearchParams } from "@/app/(preview)/lib/search-params"
import { serializePreviewSearchParams } from "@/app/(preview)/lib/search-params"
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
import { getIconForLanguageExtension, Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
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
} from "@/components/ui/sidebar"
import { OpenInV0Button } from "@/components/v0-open-button"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { trackEvent } from "@/lib/events"
import type {
  createFileTreeForRegistryItemFiles,
  FileTree,
} from "@/lib/registry"
import { cn } from "@/lib/utils"
import { CopyButton, CopyStateIcon } from "@/registry/components/copy-button"
import { getRegistryItemNamespace, getRegistryItemUrl } from "@/utils/registry"

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
        <Tabs value={view} onValueChange={(value) => setView(value as View)}>
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
      <div className="screen-line-before h-px max-lg:hidden" />
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
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsIndicator />
      </TabsList>

      <Separator
        orientation="vertical"
        className="mx-2 data-vertical:h-4 data-vertical:self-center"
      />

      <a
        href={`#${item.name}`}
        className="line-clamp-1 text-sm font-medium underline-offset-4 hover:underline"
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
            }}
          >
            <ToggleGroupItem aria-label="Mobile" value="30%">
              <Icons.smartPhone />
            </ToggleGroupItem>

            <ToggleGroupItem aria-label="Tablet" value="60%">
              <Icons.tablet />
            </ToggleGroupItem>

            <ToggleGroupItem aria-label="Desktop" value="100%">
              <Icons.desktop />
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
            asChild
          >
            <a
              href={serializePreviewSearchParams(`/preview/${item.name}`, {
                theme,
              })}
              target="_blank"
            >
              <Icons.fullScreen className="size-4" />
              <span className="sr-only">Open in New Tab</span>
            </a>
          </Button>

          <Separator
            orientation="vertical"
            className="data-vertical:h-4 data-vertical:self-center"
          />

          <Button
            className="rounded-sm border-none dark:hover:bg-muted"
            variant="ghost"
            size="icon-xs"
            onClick={() => {
              setView("preview")
              setIframeKey?.((v) => v + 1)
            }}
          >
            <Icons.refresh className="size-4" />
            <span className="sr-only">Refresh Preview</span>
          </Button>
        </div>

        <Separator
          orientation="vertical"
          className="mx-2 data-vertical:h-4 data-vertical:self-center"
        />

        <Button
          className="w-fit gap-1.5 px-2 font-mono text-[0.8125rem] shadow-none will-change-transform active:scale-none [&_svg]:text-muted-foreground"
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
            idleIcon={<Icons.terminal />}
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
            className="relative overflow-hidden rounded-xl"
            minSize="30%"
            defaultSize="100%"
          >
            <BlockViewerIframe />
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-foreground/10 ring-inset" />
          </ResizablePanel>

          <ResizableHandle className="relative w-2 bg-transparent p-0 after:absolute after:top-1/2 after:right-0 after:h-12 after:w-1.5 after:-translate-y-1/2 after:rounded-full after:bg-border after:transition-all hover:after:bg-zinc-300 dark:hover:after:bg-zinc-700" />

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
        className="my-0 flex min-w-0 flex-1 flex-col overflow-hidden border"
        data-rehype-pretty-code-figure=""
      >
        <figcaption
          data-rehype-pretty-code-title
          data-language={language}
          className="h-10 shrink-0 pe-1.5"
        >
          {getIconForLanguageExtension(language)}
          <p className="truncate">{file.target}</p>
          <div className="ml-auto flex">
            <BlockCopyCodeButton />
          </div>
        </figcaption>

        <div
          key={file?.path}
          className="no-scrollbar overflow-y-auto"
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
    <SidebarProvider className="flex min-h-full flex-col [--sidebar:var(--code)] dark:[--sidebar-accent:var(--muted)]/50">
      <Sidebar collapsible="none" className="w-full flex-1 rounded-xl border">
        <SidebarGroupLabel className="h-10 rounded-none border-b px-4 text-sm">
          Explorer
        </SidebarGroupLabel>

        <SidebarGroup className="px-0">
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
          className="rounded-none pl-(--index) whitespace-nowrap data-active:font-normal"
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
        className="group/collapsible flex flex-col gap-px [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className={cn(
              "rounded-none pl-(--index) whitespace-nowrap",
              "data-[state=closed]:*:data-[slot=folder]:block data-[state=open]:*:data-[slot=folder-open]:block"
            )}
            style={
              {
                "--index": `${index * (index === 1 ? 1 : 1.2)}rem`,
              } as React.CSSProperties
            }
          >
            <ChevronRightIcon className="text-muted-foreground transition-transform" />
            <Icons.folder data-slot="folder" className="hidden" />
            <Icons.folderOpen data-slot="folder-open" className="hidden" />
            {item.name}
          </SidebarMenuButton>
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
      className="rounded-md border-none [&_svg]:text-foreground"
      variant="secondary"
      size="icon-xs"
      text={content}
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

      <div className="screen-line-before h-px" />

      <div className="relative overflow-hidden rounded-xl border">
        <BlockViewerIframe />
      </div>
    </div>
  )
}

function ThemePicker() {
  const { themes, theme, setTheme } = useBlockViewer()

  const themeItem = theme ? themes.get(theme) : null

  return (
    <Popover modal>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger asChild>
              <Button
                className="bg-transparent px-1.75 shadow-none dark:border-border dark:bg-transparent dark:aria-expanded:bg-input/50"
                variant="outline"
                size="sm"
                aria-label="Theme"
              >
                <ThemePalette cssVars={themeItem?.cssVars} />
              </Button>
            </PopoverTrigger>
          }
        />
        <TooltipContent>
          {themeItem?.title || themeItem?.name || "Default"}
        </TooltipContent>
      </Tooltip>

      <PopoverContent className="rounded-2xl p-0">
        <Command
          className={cn(
            "**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-input-wrapper]_svg]:size-5 **:[[cmdk-input]]:h-10",
            "**:[[cmdk-group]]:px-2",
            "**:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
            "[&_[cmdk-item]_svg]:size-5 **:[[cmdk-item]]:px-2 **:[[cmdk-item]]:py-2"
          )}
        >
          <CommandInput placeholder="Search theme…" />

          <CommandList className="min-h-80 supports-timeline-scroll:scroll-fade-effect-y">
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="chanhdai.com">
              <CommandItem onSelect={() => setTheme(null)}>
                <ThemePalette />
                Default
                {!theme && <CheckIcon className="ml-auto" strokeWidth={3} />}
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="tweakcn themes">
              {Array.from(themes.values()).map((item) => (
                <CommandItem
                  key={item.name}
                  onSelect={() => setTheme(item.name)}
                >
                  <ThemePalette cssVars={item.cssVars} />
                  {item.title || item.name}
                  {theme === item.name && (
                    <CheckIcon className="ml-auto" strokeWidth={3} />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
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
            "flex h-4 w-2.5 shrink-0 rounded-xs ring-1 ring-foreground/15 ring-inset",
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

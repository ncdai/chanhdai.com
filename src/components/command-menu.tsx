"use client";

import { useCommandState } from "cmdk";
import type { LucideProps } from "lucide-react";
import {
  BriefcaseBusinessIcon,
  CircleUserIcon,
  CornerDownLeftIcon,
  LetterTextIcon,
  MoonStarIcon,
  RssIcon,
  SunIcon,
  TextIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import type { Post } from "@/features/blog/types/post";
import { SOCIAL_LINKS } from "@/features/profile/data/social-links";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";

import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

type CommandLinkItem = {
  title: string;
  href: string;

  icon?: React.ComponentType<LucideProps>;
  iconImage?: string;
  keywords?: string[];
  openInNewTab?: boolean;
};

const MENU_LINKS: CommandLinkItem[] = [
  {
    title: "Portfolio",
    href: "/",
    icon: CircleUserIcon,
  },
  {
    title: "Blog",
    href: "/blog",
    icon: RssIcon,
  },
];

const PORTFOLIO_LINKS: CommandLinkItem[] = [
  {
    title: "Sobre",
    href: "/#about",
    icon: LetterTextIcon,
  },
  {
    title: "Stack",
    href: "/#stack",
    icon: Icons.ts,
  },
  {
    title: "Experiência",
    href: "/#experience",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Projetos",
    href: "/#projects",
    icon: Icons.project,
  },
  {
    title: "Certificações",
    href: "/#certs",
    icon: Icons.certificate,
  },
  {
    title: "Baixar vCard",
    href: "/vcard",
    icon: CircleUserIcon,
  },
];

const SOCIAL_LINK_ITEMS: CommandLinkItem[] = SOCIAL_LINKS.map((item) => ({
  title: item.title,
  href: item.href,
  iconImage: item.icon,
  openInNewTab: true,
}));

export function CommandMenu({ posts }: { posts: Post[] }) {
  const router = useRouter();

  const { setTheme } = useTheme();

  const [open, setOpen] = useState(false);

  const playClick = useSound("/audio/ui-sounds/click.wav");

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    document.addEventListener(
      "keydown",
      (e: KeyboardEvent) => {
        if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
          if (
            (e.target instanceof HTMLElement && e.target.isContentEditable) ||
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement ||
            e.target instanceof HTMLSelectElement
          ) {
            return;
          }

          e.preventDefault();
          setOpen((open) => !open);
        }
      },
      { signal }
    );

    return () => abortController.abort();
  }, []);

  const handleOpenLink = useCallback(
    (href: string, openInNewTab = false) => {
      setOpen(false);

      if (openInNewTab) {
        window.open(href, "_blank", "noopener");
      } else {
        router.push(href);
      }
    },
    [router]
  );

  const createThemeHandler = useCallback(
    (theme: "light" | "dark" | "system") => () => {
      setOpen(false);
      playClick();
      setTheme(theme);

      // if (!document.startViewTransition) {
      //   setTheme(theme);
      //   return;
      // }

      // document.startViewTransition(() => setTheme(theme));
    },
    [playClick, setTheme]
  );

  const blogLinks = useMemo(
    () =>
      posts
        .filter((post) => post.metadata?.category !== "components")
        .map(postToCommandLinkItem),
    [posts]
  );

  return (
    <>
      <Button
        variant="secondary"
        className="h-8 gap-1.5 rounded-full border bg-zinc-50 px-2.5 text-muted-foreground select-none hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-900"
        onClick={() => setOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 16 16"
          aria-hidden
        >
          <path
            d="M10.278 11.514a5.824 5.824 0 1 1 1.235-1.235l3.209 3.208A.875.875 0 0 1 14.111 15a.875.875 0 0 1-.624-.278l-3.209-3.208Zm.623-4.69a4.077 4.077 0 1 1-8.154 0 4.077 4.077 0 0 1 8.154 0Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>

        <span className="font-sans text-sm/4 font-medium sm:hidden">
          Buscar
        </span>

        <CommandMenuKbd className="hidden tracking-wider sm:in-[.os-macos_&]:flex">
          ⌘K
        </CommandMenuKbd>
        <CommandMenuKbd className="hidden sm:not-[.os-macos_&]:flex">
          Ctrl K
        </CommandMenuKbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Digite um comando ou pesquise..." />

        <CommandList className="min-h-80">
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

          <CommandLinkGroup
            heading="Menu"
            links={MENU_LINKS}
            onLinkSelect={handleOpenLink}
          />

          <CommandSeparator />

          <CommandLinkGroup
            heading="Portfolio"
            links={PORTFOLIO_LINKS}
            onLinkSelect={handleOpenLink}
          />

          <CommandSeparator />

          <CommandLinkGroup
            heading="Blog"
            links={blogLinks}
            fallbackIcon={TextIcon}
            onLinkSelect={handleOpenLink}
          />

          <CommandSeparator />

          <CommandLinkGroup
            heading="Redes Sociais"
            links={SOCIAL_LINK_ITEMS}
            onLinkSelect={handleOpenLink}
          />

          <CommandSeparator />

          <CommandGroup heading="Tema">
            <CommandItem
              keywords={["theme", "tema"]}
              onSelect={createThemeHandler("light")}
            >
              <SunIcon />
              Claro
            </CommandItem>
            <CommandItem
              keywords={["theme", "tema"]}
              onSelect={createThemeHandler("dark")}
            >
              <MoonStarIcon />
              Escuro
            </CommandItem>
            <CommandItem
              keywords={["theme", "tema"]}
              onSelect={createThemeHandler("system")}
            >
              <Icons.contrast />
              Automático
            </CommandItem>
          </CommandGroup>
        </CommandList>

        <CommandMenuFooter />
      </CommandDialog>
    </>
  );
}

function CommandLinkGroup({
  heading,
  links,
  fallbackIcon,
  onLinkSelect,
}: {
  heading: string;
  links: CommandLinkItem[];
  fallbackIcon?: React.ComponentType<LucideProps>;
  onLinkSelect: (href: string, openInNewTab?: boolean) => void;
}) {
  return (
    <CommandGroup heading={heading}>
      {links.map((link) => {
        const Icon = link?.icon ?? fallbackIcon ?? React.Fragment;

        return (
          <CommandItem
            key={link.href}
            keywords={link.keywords}
            onSelect={() => onLinkSelect(link.href, link.openInNewTab)}
          >
            {link?.iconImage ? (
              <Image
                className="rounded-sm"
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
        );
      })}
    </CommandGroup>
  );
}

type CommandKind = "command" | "page" | "link";

type CommandMetaMap = Map<
  string,
  {
    commandKind: CommandKind;
  }
>;

function buildCommandMetaMap() {
  const commandMetaMap: CommandMetaMap = new Map();

  commandMetaMap.set("Baixar vCard", { commandKind: "command" });

  commandMetaMap.set("Claro", { commandKind: "command" });
  commandMetaMap.set("Escuro", { commandKind: "command" });
  commandMetaMap.set("Automático", { commandKind: "command" });

  SOCIAL_LINK_ITEMS.forEach((item) => {
    commandMetaMap.set(item.title, {
      commandKind: "link",
    });
  });

  return commandMetaMap;
}

const COMMAND_META_MAP = buildCommandMetaMap();

const ENTER_ACTION_LABELS: Record<CommandKind, string> = {
  command: "Executar Comando",
  page: "Ir para Página",
  link: "Abrir Link",
};

function CommandMenuFooter() {
  const selectedCommandKind = useCommandState(
    (state) => COMMAND_META_MAP.get(state.value)?.commandKind ?? "page"
  );

  return (
    <>
      <div className="flex h-10" />

      <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-center gap-2 border-t bg-zinc-100/30 px-4 text-xs font-medium dark:bg-zinc-800/30">
        <div className="flex shrink-0 items-center gap-2">
          <span>{ENTER_ACTION_LABELS[selectedCommandKind]}</span>
          <CommandMenuKbd>
            <CornerDownLeftIcon />
          </CommandMenuKbd>
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
          <span className="text-muted-foreground">Sair</span>
          <CommandMenuKbd>Esc</CommandMenuKbd>
        </div>
      </div>
    </>
  );
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none flex h-5 min-w-6 items-center justify-center gap-1 rounded-sm bg-black/5 px-1 font-sans text-[13px] font-normal text-muted-foreground shadow-[inset_0_-1px_2px] shadow-black/10 select-none dark:bg-white/10 dark:shadow-white/10 dark:text-shadow-xs [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  );
}

function postToCommandLinkItem(post: Post): CommandLinkItem {
  const isComponent = post.metadata?.category === "components";

  return {
    title: post.metadata.title,
    href: isComponent ? `/components/${post.slug}` : `/blog/${post.slug}`,
    keywords: isComponent ? ["component"] : undefined,
  };
}

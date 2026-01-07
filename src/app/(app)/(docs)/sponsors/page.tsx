import { HeartIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { SPONSORSHIP_URL } from "@/config/site";
import { sponsors } from "@/features/sponsors/data";
import type { Sponsor } from "@/features/sponsors/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Grateful for the support that helps me grow and maintain high-quality projects.",
};

export default function Page() {
  return (
    <div className="min-h-svh">
      <div className="screen-line-after px-4">
        <h1 className="text-3xl font-semibold">Sponsors</h1>
      </div>

      <div className="p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          {metadata.description}
        </p>
      </div>

      <div className="screen-line-before screen-line-after relative py-4">
        <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-edge" />
          <div className="border-l border-edge" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sponsors.map((item) => renderSponsorItem(item))}
        </div>
      </div>

      <div className="flex justify-center p-2">
        <Button asChild>
          <a href={SPONSORSHIP_URL} target="_blank" rel="noopener noreferrer">
            <HeartIcon />
            Sponsor My Work
          </a>
        </Button>
      </div>

      <div className="screen-line-before h-4" />
    </div>
  );
}

function renderSponsorItem(item: Sponsor) {
  const website =
    item.type === "individual"
      ? `https://github.com/${item.username}`
      : item.website;

  return (
    <a
      key={item.name}
      className={cn(
        "flex min-h-20 items-center gap-4 px-4 transition-[background-color] ease-out hover:bg-accent2",
        "max-sm:screen-line-before max-sm:screen-line-after",
        "sm:nth-[2n+1]:screen-line-before sm:nth-[2n+1]:screen-line-after"
      )}
      href={`${website}?utm_source=chanhdai.com&utm_medium=sponsor&utm_campaign=portfolio`}
      target="_blank"
      rel="noopener sponsored"
    >
      {item.type === "organization" ? (
        <div className="flex-1 [&_img]:mx-auto [&_img]:w-full [&_img]:max-w-80">
          <img
            className="hidden [html.light_&]:block"
            src={item.logo}
            alt={`${item.name} logo light`}
          />
          <img
            className="hidden [html.dark_&]:block"
            src={item.logoDark}
            alt={`${item.name} logo dark`}
          />
        </div>
      ) : (
        <div className="grid flex-1 grid-cols-[auto_1fr] items-center gap-x-4">
          <div className="relative row-span-2 size-10 shrink-0">
            <Image
              className="size-10 rounded-full select-none"
              src={`https://github.com/${item.username}.png`}
              alt={item.username}
              width={40}
              height={40}
              unoptimized
            />
            <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-black/10 ring-inset dark:ring-white/15" />
          </div>

          <div className="flex items-center gap-2 text-base leading-5 font-semibold text-foreground">
            {item.name}
            {item.tier && (
              <Tag className="h-5 rounded-md font-normal capitalize">
                {item.tier}
              </Tag>
            )}
          </div>

          <div className="translate-y-px text-xs leading-5 text-muted-foreground">
            {item.tagline}
          </div>
        </div>
      )}
    </a>
  );
}

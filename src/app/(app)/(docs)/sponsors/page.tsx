import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import sponsors from "@/features/sponsors/sponsors.json";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "We are grateful to our sponsors who help us grow and support our projects.",
};

export default function Page() {
  return (
    <div className="min-h-svh">
      <div className="screen-line-after px-4">
        <h1 className="text-3xl font-semibold">Sponsors</h1>
      </div>

      <div className="p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          We are grateful to our sponsors who help us grow and support our
          projects.
        </p>
      </div>

      <div className="screen-line-before screen-line-after relative py-4">
        <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-edge" />
          <div className="border-l border-edge" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sponsors.map((item) => (
            <a
              key={item.name}
              className={cn(
                "flex min-h-20 items-center justify-center gap-4 hover:bg-accent2",
                "max-sm:screen-line-before max-sm:screen-line-after",
                "sm:nth-[2n+1]:screen-line-before sm:nth-[2n+1]:screen-line-after"
              )}
              href={item.homepage}
              title={item.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className="[&_svg]:pointer-events-none [&_svg]:h-6 [&_svg]:w-auto [&_svg]:shrink-0"
                dangerouslySetInnerHTML={{ __html: item.logo }}
              />
            </a>
          ))}

          {Array.from({ length: Math.max(0, 6 - sponsors.length) }).map(
            (_, i) => (
              <PlaceholderLogo key={`placeholder-${i}`} />
            )
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 p-2">
        <Button asChild>
          <a
            href="https://github.com/sponsors/ncdai"
            target="_blank"
            rel="noopener noreferrer"
          >
            Become a Sponsor
          </a>
        </Button>
      </div>

      <div className="screen-line-before h-4" />
    </div>
  );
}

function PlaceholderLogo() {
  return (
    <div
      className={cn(
        "flex min-h-20",
        "max-sm:screen-line-before max-sm:screen-line-after",
        "sm:nth-[2n+1]:screen-line-before sm:nth-[2n+1]:screen-line-after"
      )}
    />
  );
}

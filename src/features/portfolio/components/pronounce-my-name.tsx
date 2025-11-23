"use client";

import { Volume2Icon } from "lucide-react";

import { useSound } from "@/hooks/use-sound";
import { trackEvent } from "@/lib/events";
import { cn } from "@/lib/utils";

export function PronounceMyName({
  className,
  namePronunciationUrl,
}: {
  className?: string;
  namePronunciationUrl: string;
}) {
  const play = useSound(namePronunciationUrl);

  return (
    <button
      className={cn(
        "relative text-muted-foreground transition-[color,scale] select-none hover:text-foreground active:scale-[0.9]",
        "after:absolute after:-inset-1",
        className
      )}
      onClick={() => {
        play();
        trackEvent({
          name: "play_name_pronunciation",
        });
      }}
    >
      <Volume2Icon className="size-4.5" />
      <span className="sr-only">Pronounce my name</span>
    </button>
  );
}

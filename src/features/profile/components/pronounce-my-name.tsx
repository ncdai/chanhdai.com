"use client";

import { Volume2Icon } from "lucide-react";

import { useSound } from "@/hooks/use-sound";
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
      onClick={() => play()}
    >
      <Volume2Icon className="size-[0.6em]" />
      <span className="sr-only">Pronunciar meu nome</span>
    </button>
  );
}

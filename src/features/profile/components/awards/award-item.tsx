import dayjs from "dayjs";
import { AwardIcon } from "lucide-react";
import React from "react";

import { Markdown } from "@/components/markdown";
import { Prose } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

import { Award } from "../../types/awards";

export function AwardItem({
  className,
  award,
}: {
  className?: string;
  award: Award;
}) {
  return (
    <div className={cn("flex items-center", className)}>
      <AwardIcon className="mx-4 size-5 shrink-0 text-muted-foreground" />

      <div className="space-y-1 border-l border-grid px-2 py-4">
        <div className="font-heading font-semibold text-balance">
          {award.title}
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm text-muted-foreground">
          <div>{award.prize}</div>

          <div className="flex h-4 w-px shrink-0 bg-border" />
          <div>{dayjs(award.date).format("MM.YYYY")}</div>

          <div className="flex h-4 w-px shrink-0 bg-border" />
          <div>{award.grade}</div>
        </div>

        {award.description && (
          <Prose className="pt-1">
            <Markdown>{award.description}</Markdown>
          </Prose>
        )}
      </div>
    </div>
  );
}

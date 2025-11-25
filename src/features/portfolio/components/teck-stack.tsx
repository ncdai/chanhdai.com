import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { TECH_STACK } from "../data/tech-stack";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";

export function TeckStack() {
  return (
    <Panel id="stack">
      <PanelHeader>
        <PanelTitle>Stack</PanelTitle>
      </PanelHeader>

      <PanelContent
        className={cn(
          "[--pattern-foreground:var(--color-zinc-950)]/5 dark:[--pattern-foreground:var(--color-white)]/5",
          "bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center",
          "bg-zinc-950/0.75 dark:bg-white/0.75"
        )}
      >
        <ul className="flex flex-wrap gap-4 select-none">
          {TECH_STACK.map((tech) => {
            return (
              <li key={tech.key} className="flex">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={tech.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={tech.title}
                    >
                      {tech.theme ? (
                        <>
                          <Image
                            src={`https://assets.chanhdai.com/images/tech-stack-icons/${tech.key}-light.svg`}
                            alt={`${tech.title} light icon`}
                            width={32}
                            height={32}
                            className="hidden [html.light_&]:block"
                            unoptimized
                          />
                          <Image
                            src={`https://assets.chanhdai.com/images/tech-stack-icons/${tech.key}-dark.svg`}
                            alt={`${tech.title} dark icon`}
                            width={32}
                            height={32}
                            className="hidden [html.dark_&]:block"
                            unoptimized
                          />
                        </>
                      ) : (
                        <Image
                          src={`https://assets.chanhdai.com/images/tech-stack-icons/${tech.key}.svg`}
                          alt={`${tech.title} icon`}
                          width={32}
                          height={32}
                          unoptimized
                        />
                      )}
                      <span className="sr-only">{tech.title}</span>
                    </a>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>{tech.title}</p>
                  </TooltipContent>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </PanelContent>
    </Panel>
  );
}

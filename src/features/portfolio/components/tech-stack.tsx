import Image from "next/image"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"

import { TECH_STACK } from "../data/tech-stack"
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

const ICON_SIZE = 24

export function TechStack() {
  return (
    <Panel id="stack">
      <PanelHeader>
        <PanelTitle>Stack</PanelTitle>
      </PanelHeader>

      <PanelContent>
        <ul className="flex flex-wrap gap-4 select-none">
          {TECH_STACK.map((tech) => {
            return (
              <li key={tech.key} className="flex">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <a
                        href={tech.href}
                        target="_blank"
                        rel="noopener"
                        aria-label={tech.title}
                      >
                        {tech.theme ? (
                          <>
                            <Image
                              src={`https://assets.chanhdai.com/images/tech-stack-icons/${tech.key}-light.svg`}
                              alt={`${tech.title} light icon`}
                              width={ICON_SIZE}
                              height={ICON_SIZE}
                              className="hidden [html.light_&]:block"
                              unoptimized
                            />
                            <Image
                              src={`https://assets.chanhdai.com/images/tech-stack-icons/${tech.key}-dark.svg`}
                              alt={`${tech.title} dark icon`}
                              width={ICON_SIZE}
                              height={ICON_SIZE}
                              className="hidden [html.dark_&]:block"
                              unoptimized
                            />
                          </>
                        ) : (
                          <Image
                            src={`https://assets.chanhdai.com/images/tech-stack-icons/${tech.key}.svg`}
                            alt={`${tech.title} icon`}
                            width={ICON_SIZE}
                            height={ICON_SIZE}
                            unoptimized
                          />
                        )}
                      </a>
                    }
                  />
                  <TooltipContent>
                    <p>{tech.title}</p>
                  </TooltipContent>
                </Tooltip>
              </li>
            )
          })}
        </ul>
      </PanelContent>
    </Panel>
  )
}

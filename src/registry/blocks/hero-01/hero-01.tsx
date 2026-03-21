import { Volume2Icon } from "lucide-react"
import type { JSX } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LaravelIcon,
  NextJSIcon,
  NodeJSIcon,
  ReactIcon,
  TailwindCSSIcon,
} from "@/registry/blocks/hero-01/components/hero-01-icons"

export function Hero01() {
  return (
    <div className="relative w-screen overflow-hidden pb-8">
      <div className="container mx-auto max-sm:px-2">
        <div className="screen-line-top screen-line-bottom border-x border-line md:hidden">
          <svg
            className="pointer-events-none absolute inset-0 overflow-visible text-line"
            viewBox="0 0 210 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="text-line">
              <path
                d="M380.853 105.099L-201.625 464.632"
                stroke="currentColor"
                strokeDasharray="4 2"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M-165.247 -267.831L369.777 600.141"
                stroke="currentColor"
                strokeDasharray="4 2"
                vectorEffect="non-scaling-stroke"
              />
            </g>

            <g>
              <path
                d="M209.5 260L130 260"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M129.5 339.5L129.5 210"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M159.5 260L159.5 210"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M3.09944e-06 210L209.5 210"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M160 240L130.133 240"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M149.5 240L149.5 260"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
              />
            </g>

            <g>
              <rect
                x="159.5"
                y="210"
                width="30"
                height="30"
                transform="rotate(90 159.5 210)"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
              />
              <rect
                x="149.5"
                y="240"
                width="20"
                height="20"
                transform="rotate(90 149.5 240)"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
              />
              <rect
                x="159.5"
                y="240"
                width="20"
                height="10"
                transform="rotate(90 159.5 240)"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
              />
            </g>

            {/* golden spiral */}
            <path
              className="text-border"
              d="M149.643 239.897C155.106 239.897 159.619 244.414 159.619 249.882C159.619 255.35 155.106 259.868 149.643 259.868C138.717 259.868 129.69 250.833 129.69 239.897C129.69 223.493 143.23 209.941 159.619 209.941C186.935 209.941 209.5 232.527 209.5 259.868C209.5 303.613 173.396 339.75 129.69 339.75C58.6695 339.75 -1.22732e-05 281.027 -9.16589e-06 209.941C-4.14648e-06 95.1103 94.7738 0.24998 209.5 0.249985C395.69 0.250001 549.5 154.06 549.5 340.25"
              stroke="currentColor"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="relative grid aspect-[1/1.618] grid-cols-[1.618fr_minmax(0,1fr)] grid-rows-[1.618fr_1fr]">
            <MainContent className="col-[1/span_2] row-1" />

            <div className="col-2 row-2" />

            <div className="col-1 row-2 flex flex-col items-center justify-center overflow-hidden p-2 sm:p-4" />
          </div>
        </div>

        <div className="screen-line-top screen-line-bottom hidden border-x border-line md:block">
          <svg
            className="pointer-events-none absolute inset-0 overflow-visible text-line"
            viewBox="0 0 340 210"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="text-line">
              <path
                d="M105.1 -170.853L464.633 411.625"
                stroke="currentColor"
                strokeDasharray="4 2"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M-267.831 375.247L600.141 -159.777"
                stroke="currentColor"
                strokeDasharray="4 2"
                vectorEffect="non-scaling-stroke"
              />
            </g>

            <g>
              <path
                d="M260 0.5V80"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M339.5 80.5H210"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M210 210V0.5"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
              />
            </g>

            <g>
              <rect
                x="210"
                y="50.5"
                width="30"
                height="30"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
              />
              <rect
                x="240"
                y="60.5"
                width="20"
                height="20"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
              />
              <rect
                x="240"
                y="50.5"
                width="20"
                height="10"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
              />
            </g>

            {/* golden spiral */}
            <path
              className="text-border"
              d="M239.897 60.3571C239.897 54.894 244.414 50.381 249.882 50.381C255.35 50.381 259.868 54.894 259.868 60.3571C259.868 71.2835 250.833 80.3095 239.897 80.3095C223.493 80.3095 209.941 66.7704 209.941 50.381C209.941 23.0652 232.527 0.499999 259.868 0.5C303.613 0.499995 339.75 36.6043 339.75 80.3095C339.75 151.33 281.027 210 209.941 210C95.1103 210 0.25 115.226 0.25 0.5C0.250008 -185.69 154.06 -339.5 340.25 -339.5"
              stroke="currentColor"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="relative grid aspect-[1.618/1] grid-cols-[1.618fr_minmax(0,1fr)] grid-rows-[1fr_1.618fr]">
            <MainContent className="col-1 row-[1/span_2]" />

            <div className="col-2 row-1" />

            <div className="col-2 row-2 flex items-center justify-center overflow-hidden p-4 lg:p-8" />
          </div>
        </div>
      </div>
    </div>
  )
}

function MainContent({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center overflow-hidden p-4 lg:p-8",
        className
      )}
    >
      <h1 className="mb-4 font-heading text-[2.5rem] leading-none font-semibold tracking-tight text-foreground sm:mb-6 sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl">
        Plan. Build. Ship.
      </h1>

      <p className="mb-6 text-base leading-normal! text-muted-foreground sm:mb-8 sm:text-xl sm:text-balance md:text-lg lg:text-xl">
        Acme{" "}
        <button
          className="relative top-0.75 inline-flex transition-[scale] outline-none active:scale-[0.97] sm:top-1"
          aria-label="Pronunciation"
        >
          <Volume2Icon className="size-[1em]" />
        </button>{" "}
        provides{" "}
        <strong className="font-normal text-foreground">professional</strong>,{" "}
        <strong className="font-normal text-foreground">high-quality</strong>{" "}
        software design and development services based on your ideas.
      </p>

      <div className="mb-6 grid grid-cols-2 items-center gap-4 sm:mb-8 sm:flex">
        <Button className="border-none px-4 sm:px-8" size="lg" asChild>
          <a href="#">Sign up now</a>
        </Button>

        <Button className="px-4 sm:px-8" variant="outline" size="lg" asChild>
          <a href="#">Learn more</a>
        </Button>
      </div>

      <div className="relative -ml-4 lg:ml-0">
        <div className="absolute -top-2 right-0 z-1 block h-10 w-20 bg-background mask-[linear-gradient(to_left,white,transparent)] lg:hidden" />

        <div className="no-scrollbar flex items-center gap-4 overflow-x-auto px-4 lg:px-0">
          <TechItem icon={<NodeJSIcon />} title="Node.js" />
          <TechItem icon={<LaravelIcon />} title="Laravel" />
          <TechItem icon={<NextJSIcon />} title="Next.js" />
          <TechItem icon={<ReactIcon />} title="React" />
          <TechItem icon={<TailwindCSSIcon />} title="Tailwind CSS" />
        </div>
      </div>
    </div>
  )
}

function TechItem({ icon, title }: { icon: JSX.Element; title: string }) {
  return (
    <div className="flex items-center space-x-2 text-muted-foreground select-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6">
      {icon}
      <span className="text-sm font-medium whitespace-nowrap">{title}</span>
    </div>
  )
}
